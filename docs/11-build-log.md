# 11 — Build Log

What was built, what broke, and what was decided as a result. Written during the
build, not reconstructed afterwards.

This is the source for **minute 2 of the video** ("how it was built and why those
decisions") and for the Bangalore Q&A. Every entry is a real thing that happened.

---

## Phase 1 — Scaffold, tokens, shell

**Built.** Next.js 15 (App Router) + TypeScript + Tailwind v4. Design tokens from
[05-design-system.md](05-design-system.md) transcribed into `app/globals.css`
verbatim. Root layout with the persistent demo-data footer. `lib/format.ts`
(Indian digit grouping, dates, tenure) and `lib/latency.ts` (the 300–600ms delay).

**Problem 1 — the generator would not run, and shipped a vulnerable version.**
`create-next-app` refuses a non-empty directory, and this repo already held the
whole `docs/` set. The version it installs (`next@15.5.2`) also carries a
published security advisory (CVE-2025-66478).

**Fix.** Wrote `package.json`, `tsconfig.json`, `next.config.ts` and
`postcss.config.mjs` by hand — four small files, no generator — and pinned Next to
the patched backport `15.5.23`. Verified with `npm run build`.

**Why it matters.** The submission is a public URL. Shipping a framework build
with a known advisory on it is not a detail a judge sees, but it is one the
entrant should not be defending in a Q&A.

---

**Problem 2 — the token names collided with Tailwind's own namespace.**
Tailwind v4 reads `--text-*` inside `@theme` as the *font-size* scale. The design
system uses `--text`, `--text-muted`, `--text-faint` as *colours*. Registering
them directly would have generated a `text-muted` utility that sets a font size to
a hex colour.

**Fix.** The raw tokens stay in `:root` exactly as the design doc writes them, and
a separate `@theme inline` block maps them into renamed slots
(`--color-ink`, `--color-ink-muted`, `--color-ok`, …).

**Why it matters.** The docs stay the single source of truth for colour. Nobody
has to remember to update two files, so the built site cannot drift from the
design system it claims to follow.

---

## Phase 2 — Mock data and the API layer

**Built.** Typed seed for three members, six claims and their timeline nodes; the
rejection taxonomy (`lib/decode.ts`); the TDS and pension maths (`lib/estimate.ts`);
the validator's cross-checks (`lib/mock/kyc.ts`); five route handlers matching the
contract in [06-architecture.md](06-architecture.md), each behind the artificial
delay.

**Problem 3 — hard-coded dates would rot, and would break the story.**
The seed in [04-mock-data.md](04-mock-data.md) uses fixed 2025 dates. Two things
go wrong with that: the demo reads as stale, and — much worse — Ramesh's claim is
supposed to be stuck for **21 days** against a normal 3–7. With fixed dates that
number grows every day the site is up. By judging week it would have said 40. By
Round 2, 60.

**Fix.** `lib/mock/clock.ts`. Every date is an offset from today —
`filedOn: daysAgo(23)`, stage entered `daysAgo(21)` — so every interval in the
docs stays exact forever, and the site is never out of date.

**Why it matters to a citizen.** "21 days, usually 3–7" is the line that makes the
whole product land. It has to be true whenever someone opens it.

---

**Problem 4 — the pension screen had nothing to show.**
All three demo members have under 10 years of service, and a monthly EPS pension
requires 10. A pension mode would have shown an empty or, worse, an invented
number.

**Fix.** Pension mode now states the 10-year rule outright, computes the Table D
one-time withdrawal benefit that actually applies (₹15,000 × 2.98 = ₹44,700 for
Arun), and puts it next to what the same record would pay monthly at 10 years
(₹2,143 a month for life).

**Why it matters to a citizen.** This is the single most misunderstood rule in
EPS, and EPFO states it nowhere. The constraint produced a better screen than the
original plan had.

---

**Problem 5 — the demo password was being served to the browser.**
The member seed carries `password` for the mock login, and the first version of
the route handlers returned the whole member object.

**Fix.** `publicMember()` in `lib/session.ts` strips it; every handler returns
through it.

---

## Phase 3 and 4 — Components and the five screens

**Built.** `ActionCard`, `StatusTimeline`, `MismatchDiff`, `SeverityBadge`,
`FeeBreakdown`, plus `AppHeader`, `StatusPill` and the loading/error states. Then
the five routes: login, claim list, claim detail with the decoder, validator,
calculator.

**Problem 6 — a screen contradicted itself.**
Arun's second claim (Form 10C) rendered the pill "Moving normally" directly above
the line "33 days here — usually 5–10".

**Fix.** The claim's status is now `STALLED`, and its timeline node with it.

**Why it matters to a citizen.** A portal that contradicts itself on one screen is
exactly the thing being replaced. One visible contradiction costs more trust than
a missing feature.

---

**Problem 7 — the diff component was being used to say something it does not mean.**
The validator ran every failed check through `MismatchDiff`, so "service length"
rendered as `3y 2m` against `5y 0m` with the differing characters highlighted in
red — as if two records disagreed. They do not. One is the member's service, the
other is a threshold in the tax rules.

**Fix.** `KycCheck` gained a `kind`: `records` (a genuine disagreement, gets the
diff), `threshold` (a value measured against a rule), `presence` (there or not).
Only `records` gets the diff treatment.

**Why it matters to a citizen.** The red diff means "two of your records disagree,
and that is why you were rejected". Spending it on a tax threshold makes the
member think their service history is wrong, which would send them to the wrong
correction.

---

**Problem 8 — a warning was written in blocker language.**
The Form 15G check, a warning, reused the blocker sentence: *"a claim cannot be
settled without it."* That is false — 15G is optional, it only costs money.

**Fix.** The copy is severity-aware: blockers say the claim cannot be settled,
warnings say it will not stop the claim but changes what you receive.

---

**Problem 9 — the arithmetic did not read top to bottom.**
The TDS deduction was rendered above the "Total in your account" subtotal, so the
numbers on screen did not add up in the order they were read.

**Fix.** `FeeBreakdown` gained a `deductions` slot that sits between subtotal and
total: contributions → total in your account → TDS → you receive.

---

**Problem 10 — the Form 15G toggle did nothing when tapped on the box.**
The checkbox was nested inside its `<label>`. Tapping the label worked; tapping
the box itself fired twice — once directly, once through label activation — and
the state landed back where it started.

**Fix.** Input and label are siblings, wired with `htmlFor`. The label is a
full-width 44px target.

**Why it matters to a citizen.** That toggle is where ₹70,234 appears and
disappears. On a phone it is the most tapped control in the build.

---

**Problem 11 — small pluralisation and reference-format tells.**
The verdict line read "1 blockers". The claim reference printed as `CLM_C1`, with
the underscore from the seed id.

**Fix.** Pluralised the counts; `claimRef()` renders `CLM-C1`.

**Why it matters.** These are the details that tell a reader whether a thing was
built or generated.

---

## Phase 5 — Build, mobile, deploy prep

**Built.** Clean production build (110 kB first load on the heaviest route). 375px
pass with no horizontal scroll on any route. Tap targets raised to 44px.

**Problem 12 — running the build while the dev server was live broke both.**
`npm run build` rewrites `.next` underneath a running `next dev`, which then
served 404s and 500s. A second dev server had also survived a failed kill and
bound port 3001, so half the checks were hitting a stale process.

**Fix.** Kill the dev server before building; confirm a single listener on 3000
before trusting any manual check.

**Why it matters.** Twenty minutes of "the app is broken" that was never the app.
Worth knowing before it happens at 7 PM on submission day.

---

## Day 6 — states, accessibility, polish

**Built.** Contrast audit as a runnable script, styled 404, share metadata, the
unrecognised-rejection state made reachable, claim ordering, and copy fixes across
the claim list.

**Problem 13 — six colour pairs failed WCAG, including one on every primary button.**
The design doc flagged the `*-soft` backgrounds as where these palettes usually
fail, so they were measured rather than eyeballed. In light mode `--text-faint`
missed 4.5:1 on all three surfaces (3.16–3.48), `--wait` and `--stalled` sat just
under on their soft backgrounds (4.43, 4.48), and `--border-strong` was 1.66:1
against white. In dark mode `--text-faint` failed, and **white text on the dark
accent measured 2.34:1** — every primary button in the build.

**Fix.** Tokens corrected to the nearest passing values
(`--text-faint` `#707068` light / `#8B8B81` dark, `--wait` `#886B1E`,
`--stalled` `#B35209`, `--border-strong` `#8C8C87` / `#6E6E64`), and a new
`--accent-ink` token carries the text colour that sits on the accent: white in
light mode, near-black in dark, where it now measures 7.9:1. The audit itself
lives at [`scripts/contrast-audit.mjs`](../scripts/contrast-audit.mjs) and reads
`app/globals.css` directly, so it cannot drift from the tokens it checks.
`npm run contrast` — 24/24 pairs pass in both modes.

**Why it matters to a citizen.** This audience skews older and reads on phones in
daylight. A 2.34:1 button label is not a technicality.

---

**Problem 14 — the honest fallback could not be demonstrated.**
"The decoder refuses to guess at codes it does not know" is one of the strongest
things to say about this build, and no demo account could reach it. It existed
only in the source.

**Fix.** Ramesh has a third claim, rejected 14 months ago with `R-441`, a code
deliberately left out of the taxonomy. The screen says the code is not recognised,
declines to explain it, and hands over an Action Card for filing a grievance that
quotes it. The "check your records" shortcut is suppressed there — we do not know
that records are the problem.

---

**Problem 15 — a settled claim outranked a stuck one.**
The claim list rendered in seed order, so Ramesh's 14-month-old settled advance
could sit above the claim that has been stuck for 21 days. The summary line also
said "the rest are moving on their own" when the rest were finished.

**Fix.** The API sorts needs-you first, then in-flight, then settled, each by date.
The summary line counts what is actually in flight, and Priya — who has nothing
outstanding — now gets "Nothing here needs you" instead of no line at all.

---

**Also.** Styled 404 rather than the framework default. Open Graph tags so the
submission link does not unfurl as a bare URL. `robots: noindex` — a fictional
site that looks like a government portal should not be in search results. A note
under every timeline stating that stage durations are indicative ranges, not a
commitment from EPFO.

---

## Day 6b — reading the published brief, and what it cost

**Problem 16 — we had been building against notes from a video, not the brief.**
[00-brief.md](00-brief.md) was written from the organiser video. The published
brief at buildwhatmovesindia.com/brief says three materially different things:
the platform list is examples rather than fixed; the summary is *under* 250 words
rather than exactly 250; and, most importantly, **"your prototype should be built
with Codex or powered by an OpenAI model"** — a requirement absent from our notes
entirely.

It also names six judging criteria. Four we were already strong on. Two we were
not building for at all:

- **End-to-end thinking** — "does the solution address the backend,
  infrastructure and processes, not just the interface". We had explicitly cut
  all of that as scope discipline. Correct instinct, wrong target.
- **Honesty** — "are limitations, mock data and dependencies clearly disclosed".
  We had a footer. The brief treats it as something a strong build makes
  *obvious*.

**Fix.** [00-brief.md](00-brief.md) rewritten from the published text with a
table of the five corrections at the bottom, so the record shows what was wrong
rather than hiding it. Then three pieces of work, below.

---

**The model does the work a lookup table cannot.**

The decoder held five hard-coded codes. Nationally there are hundreds of remark
variants written by people across field offices, sometimes in Hinglish, often
without a code at all. That long tail is the actual problem, and it is the part a
static taxonomy will never cover.

`/decode` takes any pasted rejection wording — no login, no demo account — and
normalises it into one of the reasons we know how to fix. The safety properties
are the design, not an afterthought:

- The correction route is an **enum the model chooses from**. It cannot invent a
  route, so it cannot send a member to the wrong office.
- Below a **confidence floor of 0.6** the member is told we do not know, and
  routed to a grievance. Refusing is a designed outcome.
- Pasted text is **wrapped as data** before it reaches the model, so a remark
  engineered to read as an instruction is treated as content.
- **Every screen says who wrote what you are reading** — the `Provenance`
  component names the model, or names the rule that answered instead.
- **No key, no network, model outage: the app still works.** It falls back to
  keyword matching and says so. Verified by running the whole build with no key
  set, which is how it ships until one is added.

Two more model features, both of which were already on the Round 2 list because
they are real needs rather than demonstrations:

- **The grievance composer.** The gap is not knowledge, it is writing. Members
  know they have been wronged; what gets a grievance answered is quoting the
  rejection text and asking one specific question, in English, about a system
  nobody explained to them. Drafted from the claim's own facts, with an explicit
  instruction not to state a cause as fact when the code could not be decoded.
- **"यह हिंदी में पढ़ें"** on the explanation of why the money stopped — the part
  that has to land. Form names stay in English because that is what a member has
  to type into the portal. If the translation comes back with a different number
  of segments than it was given, English is shown rather than pairing the wrong
  Hindi with the wrong heading.

**Why it matters to a citizen.** The demo accounts are three people. The pasted-
remark decoder is for everyone else — including the rejections we have never
seen, which is most of them.

---

**`/how-it-works` — the two criteria we were losing.**

One page: a real/mocked/would-need table for every part of the system, then the
status read API this needs from EPFO, how the taxonomy stays maintained (model
first, rules after — every refusal is a wording a human should add), the safety
properties of the model layer, privacy (the decoder is sent the rejection wording
only — no UAN, no Aadhaar, no name), cost at scale (cache by normalised remark:
each new wording is paid for once nationally, not once per member), and the one
process change worth more than the entire interface: **run the record cross-check
at submission rather than at decision**. The comparison already happens. Moving
it three weeks earlier turns a rejection into a correction.

**Why it matters.** "Honesty" and "end-to-end thinking" are two of six scored
criteria. Before this page they were answered in a repo nobody reviewing will
open.

---

## Decisions that differ from the original docs

Written down because a mentor or judge may ask why the build and the docs do not
match exactly.

| Doc said | Build does | Why |
|---|---|---|
| Server components fetch data directly ([06](06-architecture.md)) | The four data screens are client components fetching `/api/*` | Server components cannot reliably fetch their own route handlers, and the 300–600ms delay only pays for itself if a real loading state renders. The shell and layout stay server-rendered. |
| Arun: 1 blocker, 2 warnings ([04](04-mock-data.md)) | 1 blocker, 3 warnings | The validator derives its checks from the member record rather than a fixed list, so "service under 5 years" and "Form 15G not filed" are counted separately. Both are true and both cost money. |
| Priya: clear, 1 warning ([04](04-mock-data.md)) | Clear, 2 warnings | Same reason. Still 0 blockers, which is the point of her account. |
| Dark mode only "if it comes free" ([05](05-design-system.md)) | Shipped, and contrast-audited | It came free from the token swap, then cost six token corrections to pass WCAG in both modes. `npm run contrast` proves it. |
| Sticky bottom bar for the primary action on long screens ([05](05-design-system.md)) | Not built | Every long screen already ends on its single primary action. A sticky duplicate would put two identical buttons on the same screen, which the same doc forbids. |

Next: [07-demo-script.md](07-demo-script.md) · [08-submission.md](08-submission.md)
