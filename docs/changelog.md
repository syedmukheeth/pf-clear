# Changelog

Round 1 → Round 2. Judges re-review in Round 2; visible responsiveness to mentor feedback is itself a signal.

Format: dated entries, newest first. Every mentor comment gets logged with a decision — **taken**, **deferred**, or **declined, with the reason**. Declining well-reasoned feedback is fine; ignoring it silently is not.

---

## Unreleased — Round 2 (1–7 Sep)

### Mentor feedback log
<!-- One row per piece of feedback. Fill during mentorship week. -->

| Date | Mentor | Feedback | Decision | Notes |
|---|---|---|---|---|
| | | | | |

### Changed
<!-- What actually shipped between R1 and R2 -->

### Deferred from R1 (pre-identified, see 10-roadmap.md)
- Grievance-filing flow (EPFiGMS) with a plain-language complaint composer
- Employer-nudge link showing an employer exactly what they're blocking
- Multi-UAN merge for members with several accounts across jobs
- Hindi toggle across the three flows
- Passbook view with contribution history and interest credit

---

## R1 — submitted 27 Aug 2026

**Live:** `https://__________.vercel.app` <!-- fill on submit -->
**Video:** `https://__________`
**Summary:** 250 words, see [08-submission.md](08-submission.md)

### Shipped
- Flow 1 — rejection decoder + pre-submission KYC validator
- Flow 2 — claim tracker with plain-language timeline, stage ownership, and overdue flagging
- Flow 3 — withdrawal / pension estimate with TDS and Form 15G effect
- ActionCard pattern applied across all five routes
- Three seeded demo accounts (clean / stalled / rejected)

### Known gaps at R1
<!-- Be honest here. This list is the R2 work queue. -->
- Rejection taxonomy covers 5 codes (`R-217`, `R-104`, `R-133`, `R-152`, `R-181`). Anything else routes to grievance by design — reachable in the demo on Ramesh's third claim — but the coverage is thin.
- The validator shows what is wrong and cannot record that a fix was filed — there is no "I have raised this" state.
- The employer nudge uses the clipboard API, which needs a secure origin. It silently does nothing on plain HTTP.
- The "no claims yet" empty state is built but unreachable: all three demo members have claims. It cannot be demonstrated without a fourth account.
- No Hindi anywhere. English with the EPFO term in parentheses only.
- Amounts are illustrative. A judge who knows EPS well may query the interest accrual, which is a flat seeded figure rather than a computed one.
- Stage durations are seeded rather than sourced from published EPFO service standards. The screen now says they are indicative, but the numbers are still ours.
- No sticky bottom action bar on long screens, which [05-design-system.md](05-design-system.md) asks for. Every long screen already ends on its single primary action, so this was left out rather than duplicating the button.

### Cut deliberately
Admin side · real EPFO integration · authentication theatre · registration flow · decorative motion. Reasoning in [03-features.md](03-features.md).
