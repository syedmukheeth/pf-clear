# 08 — Submission

Everything the form asks for, ready to paste. Form closes **29 Aug 2026, 10:00 PM IST** — no grace period.

---

## Form fields

| Field | Value |
|---|---|
| Submitted from | `lokeshkammara@gmail.com` — **the registered email. No other.** |
| Live link | `https://pf-clear-omega.vercel.app` — public, no login wall, verified 29 Aug |
| Video link | `https://__________` <!-- fill after upload; test in incognito --> |
| Demo credentials | UAN `100100100003` / `demo1234` (also `...001` and `...002`, same password) |
| Partner email | *blank — solo entry.* If a partner is added, both must already be registered and each must enter the other's email. |
| Summary | below — 238 words, under the 250 cap |

Put the credentials in the summary or wherever else the form allows, and on the login screen itself. A judge who can't get in scores nothing.

---

## The summary — 238 words

> Verified at 238 words on 29 Aug with `wc -w`, under the 250-word cap. Leads with the citizen's problem, not the feature list.

---

Ask anyone in India who has claimed their PF: "It says Under Process." That is the entire message EPFO gives about your own money. Not who is holding your claim. Not why it stopped. Not what to do next.

PF Clear rebuilds the EPFO member portal around the three questions members actually have.

First, it decodes rejections. EPFO writes "DOB not matching with UIDAI records." We show that EPFO has your birth year as 1994 while Aadhaar says 1993, explain why that stops a payment, and give you the correction route — which form, how long, what it costs.

Second, it catches those mismatches before you file. The same check that explains a rejection runs beforehand, comparing your EPFO, Aadhaar, PAN and bank records and telling you what would be rejected. Members currently discover this only by failing, three weeks later.

Third, it answers "how much will I get." Not contribution rows — one number, with TDS applied and the credit window shown.

Every screen answers five questions: what you need, what it costs, how long it takes, your single next step, and what usually goes wrong here. That last one is what government sites never tell you.

We changed no forms and no rules. Form 19 is still Form 19, employer attestation still happens. EPFO already knows where your claim is, who is holding it, and why it failed. It simply doesn't say. This makes it say.

---

## Pre-submit checklist

Run this in order, before 10:00 PM IST on 29 Aug.

**The link**
- [ ] Opens in an **incognito window**, on a **different device**, on **mobile data**
- [ ] All three demo logins work from cold
- [ ] Rejected-claim decoder reachable in under 30 seconds from a standing start
- [ ] No console errors on any of the five routes
- [ ] Renders at 375px without horizontal scroll
- [ ] Demo-data footer visible

**The video**
- [ ] Duration **≤ 2:00** — checked, not assumed
- [ ] Link plays in incognito (permissions are the usual failure)
- [ ] Minute one contains zero stack talk

**The summary**
- [ ] Exactly 250 words — `wc -w` verified
- [ ] Opens with the citizen's problem
- [ ] Contains the demo credentials

**The form**
- [ ] Submitting from `lokeshkammara@gmail.com`
- [ ] Partner field blank (solo)
- [ ] Submitted well before **29 Aug, 10:00 PM IST**, not at 9:58 PM

---

## After submitting

- Screenshot the confirmation. Save it here as `assets/submission-confirmation.png`.
- Don't touch the deployed URL until results are out. A broken deploy during the review window is unrecoverable.
- Round 2 uses **the same email**. Anything else reads as a new, unadmitted entrant.

Next: [09-presentation.md](09-presentation.md) · [changelog.md](changelog.md)
