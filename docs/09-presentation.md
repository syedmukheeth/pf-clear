# 09 — Bangalore Pitch (top-10 contingency)

Written now, while the thinking is fresh. Costs an hour today; prevents a panic on 12 Sept.

**Context:** recorded, not live-streamed. Audience is founders, creators, mentors, and government officials. Winners announced the same day.

---

## The frame

Officials in the room have heard "your website is bad" many times. That pitch loses.

The pitch that lands: *EPFO already has this information. It just doesn't say it. Here's what saying it looks like.* No new rule, no new form, no new statutory step. That framing turns the audience from defensive to curious.

---

## Slide outline

**1 · The sentence**
"It says Under Process."
Nothing else on the slide. Let the room recognise it.

**2 · One real story**
Ramesh. Laid off, rent due, claim filed 12 July. Status: Under Process. It is sitting with the employer that laid him off, and nobody told him.
One person, one problem. Not a statistics slide.

**3 · Where it actually breaks**
The five moments from [01-problem.md](01-problem.md), as five lines. Every one is an information gap, not a design gap.

**4 · Three flows**
Decode the rejection · catch it before filing · tell them what they'll receive.

**5 · Live demo — 3 minutes**
The decoder beat, then the validator closing the loop. Same shape as the video, slower.

**6 · The Action Card**
Five questions, every screen. The transferable idea — it works for Parivahan, Passport Seva, eCourts too. Officials in the room may not run EPFO; this is what they can take home.

**7 · What it would take to ship this for real**
The honest slide, and the one that separates a demo from a proposal. See below.

**8 · The ask**
Not a prize. A conversation with whoever owns the member portal.

---

## The "ship it for real" slide

Ordered by what could ship soonest:

| Change | Depends on | Difficulty |
|---|---|---|
| Plain-language rejection text | A mapping table from existing reason codes. No system change. | **Low** — could ship first |
| Show who holds the claim | Data already in the workflow engine; needs surfacing to the member view | Low–medium |
| Stage duration + overdue flag | Historical stage timings, already logged | Medium |
| Pre-filing KYC cross-check | Read access to Aadhaar/PAN/bank verification status | Medium |
| Payout estimate | TDS and pension rules encoded once, applied to existing balances | Medium |

The first row is the wedge. A rejection-code mapping table is a spreadsheet and a string replacement — it changes nothing structural and removes the single most common cause of member confusion.

---

## Anticipated questions

**"How does this integrate with our legacy systems?"**
It doesn't replace them. Every screen is a read-view over data EPFO already holds. The rejection decoder is a mapping table over existing reason codes.

**"What about data privacy?"**
Nothing new is collected. The validator compares records EPFO already stores against each other. No third-party calls; the demo has no backend at all.

**"You've oversimplified the process."**
Deliberately not — the statutory steps are all still in the timeline, employer attestation included. The build makes them visible; it doesn't remove them. Nothing here shortens a legal step.

**"What's the smallest version we could actually ship?"**
The rejection-code mapping. One table, no architecture change, and it addresses the most common source of member confusion.

**"Where did the data come from?"**
All fabricated. Three demo accounts, no real UAN, no real person. Labelled as demo data on every screen.

**"Why should we listen to a solo entrant?"**
Not the pitch. The pitch is: here is what your own data looks like when it's shown to the person it belongs to.

---

## Delivery notes

- Open on the story, not on the stack. Never on the stack.
- 3 minutes of live demo beats 10 slides.
- **Recorded fallback ready on a local file** — venue wifi is the classic failure. Also have the deployed URL open in a background tab, already logged in.
- Say "members," not "users." In this room the word matters.
- Concede the limits early — a demo that admits what it hasn't solved is trusted on what it has.

---

## Pre-event checklist

- [ ] Deck exported to PDF, on the laptop, not only in the cloud
- [ ] Demo video file downloaded locally as the wifi fallback
- [ ] Deployed URL open and logged in, in a background tab
- [ ] Laptop display scaling raised — a projected 14" screen is unreadable at default
- [ ] Dongle / HDMI adapter
- [ ] Under time. Every pitch that overruns loses its last slide, which is the ask.
