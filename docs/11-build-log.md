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

## Decisions that differ from the original docs

Written down because a mentor or judge may ask why the build and the docs do not
match exactly.

| Doc said | Build does | Why |
|---|---|---|
| Server components fetch data directly ([06](06-architecture.md)) | The four data screens are client components fetching `/api/*` | Server components cannot reliably fetch their own route handlers, and the 300–600ms delay only pays for itself if a real loading state renders. The shell and layout stay server-rendered. |
| Arun: 1 blocker, 2 warnings ([04](04-mock-data.md)) | 1 blocker, 3 warnings | The validator derives its checks from the member record rather than a fixed list, so "service under 5 years" and "Form 15G not filed" are counted separately. Both are true and both cost money. |
| Priya: clear, 1 warning ([04](04-mock-data.md)) | Clear, 2 warnings | Same reason. Still 0 blockers, which is the point of her account. |
| Dark mode only "if it comes free" ([05](05-design-system.md)) | Shipped | It did come free from the token swap. Not contrast-audited pair by pair — see the gaps list in [changelog.md](changelog.md). |

Next: [07-demo-script.md](07-demo-script.md) · [08-submission.md](08-submission.md)
