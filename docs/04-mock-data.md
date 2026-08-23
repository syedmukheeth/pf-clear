# 04 — Mock Data & Demo Credentials

**The demo dies on empty states.** Every account below is seeded so that no screen a judge can reach looks unfinished.

> **All data on this page is fabricated.** No real person, no real UAN, no real bank account, no real employer. The deployed app carries a persistent footer: *"Demo only — all data is fictional. Not affiliated with EPFO."*

---

## Demo credentials

These go in three places, identically: this file, the root `README.md`, and the submission form.

| Account | UAN (login) | Password | What it demonstrates |
|---|---|---|---|
| **A — Priya** | `100100100001` | `demo1234` | Happy path: approved and credited |
| **B — Ramesh** | `100100100002` | `demo1234` | Stalled 21 days at employer approval |
| **C — Arun** | `100100100003` | `demo1234` | **Rejected on DOB mismatch — the hero demo** |

Login screen shows all three, one tap each. A judge must never type a credential or hunt for one.

**Default demo entry point: Account C.** That is where the video starts.

---

## Account A — Priya Raghavan (happy path)

Exists to prove the app handles success, and to make B and C legible by contrast.

- UAN `100100100001` · DOB `03-11-1996` · Aadhaar DOB `03-11-1996` ✓
- Employer: Kestrel Analytics Pvt Ltd, Bengaluru · joined 04-2021, exited 05-2025
- Service: 4y 1m · KYC: all verified
- Claim: Form 19 (final settlement), filed 02-Jul, **credited 19-Jul**, ₹4,18,290 after TDS
- Validator verdict: **Clear** — 0 blockers, 1 warning (service < 5 years → TDS applied)

## Account B — Ramesh Iyer (stalled)

The highest-stakes user. Laid off, needs the money, has no idea who is blocking it.

- UAN `100100100002` · DOB `27-08-1985` — matches Aadhaar ✓
- Employer: **Meridian Tech Solutions Pvt Ltd**, Pune · joined 06-2018, exited 06-2025
- Service: 7y 0m · KYC: all verified
- Claim: Form 19, filed **12-Jul**, still at **employer approval — day 21** (normal: 3–7 days)
- Timeline node shows: held by employer · waiting on authorised signatory's digital signature · action available: copy a ready-written nudge message · overdue flag on · escalation to EPFiGMS unlocks at day 30
- Validator verdict: **Clear** — nothing wrong with his paperwork, which is exactly the point: the delay isn't his fault and the real portal never says so

## Account C — Arun Deshpande (rejected — hero demo) ⭐

Every value below exists to make one diff render convincingly.

- UAN `100100100003`
- **DOB on EPFO: `12-04-1994`**
- **DOB on Aadhaar: `12-04-1993`** ← the mismatch
- Name on EPFO: `ARUN DESHPANDE` · on PAN: `ARUN R DESHPANDE` (secondary warning — middle initial)
- Employer: Halcyon Retail India Pvt Ltd, Hyderabad · joined 02-2022, exited 04-2025
- Service: 3y 2m → TDS applies, Form 15G not filed
- Bank: verified ✓ · Aadhaar seeded ✓ · Date of exit present ✓
- Claim: Form 19, filed 28-Jun, **rejected 11-Jul**
- Portal-style remark (what the real site would show): `Claim rejected: DOB not matching with UIDAI records. Ref: R-217`
- Decoder output: the year diff, why it blocks payment, and the correction route — online DOB correction, ~7–10 days, free, no employer signature needed for a ≤3 year variance
- Validator verdict: **1 blocker, 2 warnings** — DOB mismatch (blocker), PAN name variance (warning), Form 15G not filed (warning, ₹70,234 at stake)
- Calculator: corpus ₹7,02,340 → TDS ₹70,234 → receives ₹6,32,106

The 15G number and the TDS number are the same figure on purpose — the calculator's closing line ("filing Form 15G would save you ₹70,234") lands harder when the judge has just seen it deducted.

---

## Entity shapes

```jsonc
// member
{
  "uan": "100100100003",
  "name": "Arun Deshpande",
  "dobEpfo": "1994-04-12",
  "dobAadhaar": "1993-04-12",
  "namePan": "ARUN R DESHPANDE",
  "mobile": "98765 43210",
  "employerId": "emp_halcyon",
  "dateOfJoining": "2022-02-14",
  "dateOfExit": "2025-04-30",
  "balance": { "employeeShare": 342180, "employerShare": 288940, "interest": 71220 }
}

// kycRecord — drives the validator
{
  "uan": "100100100003",
  "checks": [
    { "id": "dob",    "label": "Date of birth", "severity": "blocker",
      "left": { "source": "EPFO", "value": "12-04-1994" },
      "right": { "source": "Aadhaar", "value": "12-04-1993" },
      "status": "mismatch", "fixId": "fix_dob_online" },
    { "id": "name_pan", "label": "Name on PAN", "severity": "warning",
      "left": { "source": "EPFO", "value": "ARUN DESHPANDE" },
      "right": { "source": "PAN", "value": "ARUN R DESHPANDE" },
      "status": "mismatch", "fixId": "fix_name_jd" },
    { "id": "bank", "label": "Bank account", "severity": "blocker", "status": "clear" }
  ]
}

// claim
{
  "id": "clm_c1", "uan": "100100100003", "type": "FORM_19",
  "typeLabel": "Final PF settlement",
  "filedOn": "2025-06-28", "status": "REJECTED",
  "rejection": { "code": "R-217",
                 "portalRemark": "Claim rejected: DOB not matching with UIDAI records.",
                 "decodedId": "dob_mismatch" },
  "amountClaimed": 702340
}

// claimEvent — one timeline node
{
  "claimId": "clm_b1", "stage": "EMPLOYER_APPROVAL",
  "stageLabel": "Employer approval",
  "enteredOn": "2025-07-14", "status": "STALLED",
  "heldBy": "Meridian Tech Solutions Pvt Ltd",
  "waitingOn": "Digital signature from the authorised signatory",
  "youCanDo": { "label": "Send them the exact request", "action": "COPY_NUDGE" },
  "normalDurationDays": [3, 7], "actualDurationDays": 21
}

// fix — the Action Card payload
{
  "id": "fix_dob_online", "title": "Correct your date of birth",
  "whatYouNeed": ["Aadhaar", "UAN login"],
  "whatItCosts": "Free",
  "howLong": "7–10 days",
  "nextStep": "Raise a DOB correction request under Manage → Modify Basic Details",
  "whatGoesWrong": "A variance over 3 years needs employer co-signature and a Joint Declaration."
}
```

---

## Seeding rules

- Amounts are plausible for the stated salary and tenure — a judge who knows PF should not spot a wrong number.
- Dates are internally consistent: DOJ < DOE < claim filed < claim events.
- Every list has at least 2 rows; no screen renders a lonely single item.
- Artificial latency of 300–600ms on mock API calls so loading states are visible and the app feels real.
- Every empty state teaches something — the "no claims yet" screen shows what a claim would look like, rather than saying "nothing here."

Next: [05-design-system.md](05-design-system.md) · [06-architecture.md](06-architecture.md)
