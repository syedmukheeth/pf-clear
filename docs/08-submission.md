# 08 — Submission

Everything the form asks for, ready to paste. Finalise on **27 Aug**, not on the 28th.

---

## Form fields

| Field | Value |
|---|---|
| Submitted from | `lokeshkammara@gmail.com` — **the registered email. No other.** |
| Live link | `https://__________.vercel.app` <!-- fill after deploy --> |
| Video link | `https://__________` <!-- fill after upload; test in incognito --> |
| Demo credentials | UAN `100100100003` / `demo1234` (also `...001` and `...002`, same password) |
| Partner email | *blank — solo entry* |
| Summary | below, exactly 250 words |

Put the credentials in the summary or wherever else the form allows, and on the login screen itself. A judge who can't get in scores nothing.

---

## The 250-word summary

> Draft below. **Rewrite on 27 Aug once the build is real** — specifics from the finished app beat anything written in advance. Lead with the citizen's problem, not the feature list. Verify the count with `wc -w`, not by eye.

---

Ask anyone in India who has claimed their PF and you'll hear the same sentence: "It says Under Process." That is the entire message EPFO gives you about your own money. Not who is holding your claim. Not why it stopped. Not what to do next.

PF Clear rebuilds the EPFO member portal around the three questions members actually have.

First, it decodes rejections. EPFO writes "DOB not matching with UIDAI records." We show that EPFO has your birth year as 1994 while Aadhaar says 1993, explain why that stops a payment, and give you the correction route — which form, how long, what it costs.

Second, it catches those mismatches before you file. The same check that explains a rejection runs beforehand, comparing your EPFO, Aadhaar, PAN and bank records and telling you what would be rejected. Members currently discover this only by failing, three weeks later, after the money never arrives.

Third, it answers "how much will I get." Not contribution rows — one number, with TDS applied and the credit window shown.

Every screen answers five questions: what you need, what it costs, how long it takes, your single next step, and what usually goes wrong here. That last one is what government sites never tell you.

We changed no forms and no rules. Form 19 is still Form 19, employer attestation still happens. EPFO already knows where your claim is, who is holding it, and why it failed. It simply doesn't say. This makes it say.

---

## Pre-submit checklist

Run this in order, on 27 Aug.

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
- [ ] Submitted **27 Aug**, not 28 Aug 7:58 PM

---

## After submitting

- Screenshot the confirmation. Save it here as `assets/submission-confirmation.png`.
- Don't touch the deployed URL until results are out. A broken deploy during the review window is unrecoverable.
- Round 2 uses **the same email**. Anything else reads as a new, unadmitted entrant.

Next: [09-presentation.md](09-presentation.md) · [changelog.md](changelog.md)
