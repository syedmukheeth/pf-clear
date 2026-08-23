# 01 — The Problem: Why EPFO

The evidence base. Every design decision downstream traces back to something here.

---

## Why EPFO and not IRCTC / Income Tax

**Crowding.** Expect roughly a third of ~5,000 submissions to land on IRCTC and the Income Tax portal — they are the famous ones. A good IRCTC build gets compared against several hundred other IRCTC builds. A good EPFO build gets compared against a few dozen. Grading is explicitly relative.

**Judge empathy.** Every salaried person in India has a PF story — a withdrawal that took months, a claim rejected for a reason nobody explained, an employer who never approved anything. The reviewers have this experience personally. They do not need the problem explained to them, which buys back seconds in a 60-second window.

**Design vacuum.** EPFO's member portal has had almost no design attention. The gap between "what exists" and "what's obviously possible" is enormous, so an improvement reads instantly.

**The real problem is not ugly UI — it's status opacity.** *"I submitted something. I don't know where it is, why it's stuck, or what to do next."* Almost nobody designs for that. That is the opening.

---

## The 5 worst moments

<!-- TODO: from real portal — replace each "What happens" line with the actual observed behaviour + screenshot filename after the Day 1–2 walkthrough -->

### 1. "Under Process" and nothing else
**What happens:** claim status shows a single opaque phrase with no owner, no date, no estimate.
**What the member needs to know:** who is holding it right now, what they are waiting for, how long this stage normally takes.
**Screenshot:** `assets/real/status-under-process.png`

### 2. The rejection arrives as a code
**What happens:** a claim is rejected with an internal remark string — abbreviations, field names, sometimes a bare reason code — written for a field officer, not for a member.
**What the member needs to know:** in plain language, what mismatched, what the two conflicting values are, and the exact next step.
**Screenshot:** `assets/real/rejection-remark.png`

### 3. KYC mismatch discovered only after failure
**What happens:** DOB / name / father's name mismatches between EPFO records and Aadhaar or PAN are not surfaced until after a claim has been filed and rejected — weeks later.
**What the member needs to know:** before filing, that these fields disagree, and which correction route fixes each.
**Screenshot:** `assets/real/kyc-fields.png`

### 4. The employer is invisible
**What happens:** the single most common stall is the employer's digital attestation. The member sees no indication that the ball is in the employer's court, and no way to act on it.
**What the member needs to know:** that it's stuck at the employer, for how long, and what to send them.
**Screenshot:** `assets/real/employer-pending.png`

### 5. No honest answer to "how much, and when"
**What happens:** the passbook shows contribution rows. It does not show what a withdrawal would actually pay out — after TDS, after pension-share rules, after eligibility.
**What the member needs to know:** one number, with the deductions shown, and a realistic credit date.
**Screenshot:** `assets/real/passbook.png`

---

## Rejection-reason taxonomy

The decoder in Flow 1 needs real coverage. These are the recurring causes:

| Cause | Typical portal wording | Plain-language version | Fix path |
|---|---|---|---|
| Name mismatch | "Name differs from Aadhaar / not as per records" | Your name on EPFO doesn't match Aadhaar | Joint Declaration via employer + UAN portal correction |
| DOB mismatch | "DOB not matching with UIDAI" | EPFO has a different date of birth from Aadhaar | Online DOB correction (within tolerance) or Joint Declaration |
| Wrong DOJ / DOE | "Date of exit not updated / DOJ incorrect" | Your employer never marked when you left | Employer must update exit date; member can raise it |
| Bank / IFSC mismatch | "Bank account not seeded / IFSC invalid" | The bank account on file isn't verified or the branch code is stale | Re-seed KYC bank details, re-verify |
| Missing Form 15G/H | "15G not submitted" | TDS will be deducted unless you file this declaration | Submit 15G/15H with the claim |
| Service under 5 years | "TDS applicable" | Withdrawal before 5 years of service is taxed | Nothing to fix — but the amount must be shown honestly upfront |
| Employer attestation pending | "Pending at employer" | Your ex-employer hasn't approved it yet | Nudge employer; escalate to EPFiGMS after N days |
| Aadhaar not linked/verified | "Aadhaar not seeded against UAN" | Aadhaar isn't attached to your UAN | Seed and verify Aadhaar in KYC |

<!-- TODO: verify exact portal wording during the Day 1–2 walkthrough; the left column must quote what the portal really says -->

---

## Who this is for

**Priya, 27 — the job-switcher.**
Changed jobs twice, has three UANs floating around, wants to consolidate and withdraw. Comfortable with apps, completely lost in EPFO's vocabulary. Fails at Flow 1's validator on a name mismatch from her marriage certificate.

**Ramesh, 41 — laid off, needs the money in 10 days.**
Rent is due. Filed a claim two weeks ago. Status says "Under Process." He has no idea it is sitting with an employer that laid him off and has no incentive to hurry. He needs to know *who to chase* — this is the highest-stakes user, and the one Flow 2 exists for.

**Sudha, 58 — approaching pension.**
Wants one number: what will arrive monthly, and from when. Currently has to reverse-engineer it from a passbook. Flow 3 exists for her.

All three are on phones. All three are short on time. None of them will read a help page.

---

## The one-line thesis

> EPFO doesn't need a prettier portal. It needs to answer three questions it currently refuses to answer: **where is my money, who is blocking it, and what do I do about it.**

Next: [02-comparison.md](02-comparison.md) · [03-features.md](03-features.md)
