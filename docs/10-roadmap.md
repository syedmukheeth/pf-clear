# 10 — Roadmap: 7 days, then Round 2

Deadline: **28 Aug, 8:00 PM IST**. Today: 21 Aug. Plan targets submitting on **27 Aug**, leaving 28 Aug as pure buffer. Submitting on deadline day is how entries die.

---

## Round 1 — day by day

### Day 1–2 · 21–22 Aug — Research & scaffold
- [ ] Use the real EPFO member portal until genuinely frustrated. Log in, attempt a claim, hunt for a status, try to find why something failed.
- [ ] Screenshot everything. Every dead end, every jargon string, every "Under Process".
- [ ] Fill the 5 worst moments in [01-problem.md](01-problem.md) with what actually happened, not what was assumed.
- [ ] Collect the real rejection-reason wording (forums, Reddit r/IndiaInvestments, EPFO grievance threads, YouTube comments on PF withdrawal videos).
- [ ] Scaffold Next.js + Tailwind. Deploy an empty page to Vercel on day 1 — **get the deploy pipeline working before there's anything to lose.**

**Exit criteria:** a live Vercel URL exists, and 5 concrete pain moments are written down with screenshots.

### Day 3–5 · 23–25 Aug — Build the 3 flows
Depth over breadth. Three flows, finished, beats eight flows, half-done.

- [ ] **D3:** Flow 2 — Claim tracker with plain-language timeline. This is the spine; build it first.
- [ ] **D4:** Flow 1 — Pre-submission validator + the rejection decoder screen. **This is the hero demo** — spend the most care here.
- [ ] **D5:** Flow 3 — "What will I actually get" calculator. Then wire the Action Card pattern consistently across all three.

**Exit criteria:** all 3 flows navigable end to end on the deployed URL.

### Day 6 · 26 Aug — Data, states, polish
- [ ] Seed the 3 mock accounts from [04-mock-data.md](04-mock-data.md). Real-looking names, real-looking employers, plausible salary history.
- [ ] Walk every state: empty, loading, error, success. **The demo dies on empty states** — no screen may look unfinished.
- [ ] Mobile pass at 375px. Most EPFO members are on a phone.
- [ ] Deploy. Then open the live URL **in an incognito window on a different device** and log in cold with the published credentials.

**Exit criteria:** a stranger with only the URL and the credentials can reach the rejected-claim screen in under 30 seconds.

### Day 7 · 27 Aug — Record, write, submit
- [ ] Record the video against [07-demo-script.md](07-demo-script.md). Expect 3–5 takes. Hard-stop at 2:00.
- [ ] Write the 250 words — **now, last**, when the build is real. Lead with the citizen's problem.
- [ ] Run the pre-submit checklist in [08-submission.md](08-submission.md).
- [ ] Submit from `lokeshkammara@gmail.com`. Partner field blank.

### 28 Aug — Buffer only
Nothing scheduled. This day exists for the thing that goes wrong.

---

## Round 2 · 1–7 Sep — Mentorship week

If selected into the top 250:

- Treat mentor time as scarce. Come with **one specific question**, not "please review my project."
- Log every piece of feedback in [changelog.md](changelog.md) with a date and a decision: taken / deferred / declined-and-why.
- Judges re-review in R2. Visible responsiveness to feedback is itself a scored signal.

**Pre-identified R2 improvements** (deliberately cut from R1 to protect scope):
- Grievance-filing flow (EPFiGMS) with a plain-language complaint composer
- Employer-nudge feature: a shareable link that shows an employer exactly what they're blocking
- Multi-account merge for members with several UANs across jobs
- Hindi language toggle across the 3 flows
- Passbook view with month-by-month contribution history and interest credit

---

## Cut list — what will NOT be built

Written down so it stays cut when time pressure arrives:

- Any admin / employer-side portal (explicitly not reviewed)
- Real EPFO API integration (impossible, and not asked for)
- Aadhaar/OTP authentication theatre — the demo login is a plain credential box
- Account registration flow
- Any 3D, scroll-jacking, or animation that doesn't carry information
- Dark mode, unless it comes free with the token setup
- Tests, CI, error monitoring — this is a proof of concept judged as a citizen would judge it

---

## Standing risks

| Risk | Mitigation |
|---|---|
| Building breadth instead of depth | 3 flows locked in [03-features.md](03-features.md); anything else goes in the R2 list |
| Demo login broken at judging time | Cold incognito test on D6 and again on D7 |
| Video runs long | Scripted to the second; rehearse before recording |
| 250 words written in a rush | Drafted D6, finalised D7, word count verified |
| Vercel deploy fails on the last day | Pipeline proven on D1 |
