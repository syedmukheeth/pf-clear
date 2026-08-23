# 03 — What I Built

Three flows. Nothing else. Written as spec before the build, kept truthful as the build proceeds.

Working name: **PF Clear** — EPFO, rebuilt around the only question members actually ask.

---

## The organising pattern: the Action Card

Every screen in this build answers the same five questions. If a screen can't answer them, it doesn't ship.

1. **What you need** — documents, details, prerequisites
2. **What it costs** — fees, TDS, deductions; ₹0 stated explicitly when it's free
3. **How long it takes** — a realistic range, not a promise
4. **Your one next step** — exactly one primary action, never a menu
5. **What usually goes wrong here** — the failure mode, named before it happens

This is the whole idea in one component. A judge who sees it once on the status screen and again on the calculator understands the thesis without being told.

---

## Flow 1 — Pre-submission validator + rejection decoder ⭐

**The hero. Most of the demo minute lives here.**

### 1a. The decoder (entry point for the demo)

A rejected claim opens to a plain-language explanation, not a remark string.

The screen shows the two conflicting values side by side:

```
Your claim was rejected because two records disagree.

  Date of birth on EPFO      12-04-1994
  Date of birth on Aadhaar   12-04-1993
                                     ^^^^
  One year apart.

  Why this matters: EPFO can't release money to an
  identity it can't match against UIDAI.

  Fix this →  Online DOB correction · ~7–10 days · free
```

Then an Action Card for the fix: which form, whether the employer must co-sign, the realistic timeline, and the one next step.

**States:** rejected (decoded) · rejected (reason not in taxonomy → honest fallback that says so and routes to grievance) · approved (no decoder shown).

### 1b. The validator (the point)

Run *before* filing. Cross-checks the member's records against each other:

| Check | Compares | Severity if mismatched |
|---|---|---|
| Name | EPFO ↔ Aadhaar ↔ PAN | Blocker |
| Date of birth | EPFO ↔ Aadhaar | Blocker |
| Father's / spouse name | EPFO ↔ Aadhaar | Warning |
| Bank account + IFSC | Seeded & verified? | Blocker |
| Aadhaar seeding | Linked & verified? | Blocker |
| Date of exit | Present? | Blocker |
| Service duration | ≥ 5 years? | Warning (TDS, not a rejection) |
| Form 15G/H | Needed? Filed? | Warning |

Output: a single verdict line — *"3 things would get this rejected. Fix them first."* — then one Action Card per issue, ordered blockers first.

**Severity language:** `Blocker` (will be rejected) · `Warning` (will cost you money or time) · `Clear`.

**The demo beat:** show the rejection first, then show the validator catching the same mismatch *before* filing. The audience closes the loop themselves.

---

## Flow 2 — Claim tracker in plain language

The spine of the app. Replaces "Under Process."

A vertical timeline. Each node answers four things:

- **Who holds it now** — you / your employer / EPFO field office / bank
- **What they're waiting on** — the specific pending item
- **What you can do today** — an action, or an explicit "nothing, this one is genuinely just waiting"
- **How long this stage usually takes** — a range, with a flag when the current claim has exceeded it

```
● Claim submitted            12 Jul   ✓ done
● Employer approval          14 Jul   ⚠ 21 days — usually 3–7
  │  Held by: Meridian Tech Solutions Pvt Ltd
  │  Waiting on: digital signature from the authorised signatory
  │  You can: send them the exact request → [Copy message]
  │  Overdue. After 30 days you can escalate to EPFiGMS.
○ EPFO field officer review           not started
○ Approved & sent to bank             not started
○ Credited                            not started
```

The overdue flag is the emotional payload: the portal never tells you that something has taken too long.

**States:** in-progress · stalled (past normal duration) · rejected (links into the decoder) · approved · credited · no claims yet (empty state must still teach — shows what a claim would look like).

---

## Flow 3 — "What will I actually get"

One number, honestly derived.

**Withdrawal mode:**
- Employee share + employer share + accrued interest = corpus
- TDS applied when service < 5 years, with the rule stated in words
- Form 15G/15H effect shown as a toggle, so the member sees what filing it saves
- Realistic credit date range, not a promise

**Pension mode:**
- Pensionable service, pensionable salary, resulting monthly pension
- The formula shown in plain terms, because the number is otherwise unbelievable
- Earliest eligible date

Rendered as a fee breakdown, not a black box:

```
  Employee share            ₹ 3,42,180
  Employer share            ₹ 2,88,940
  Interest accrued          ₹   71,220
  ─────────────────────────────────────
  Corpus                    ₹ 7,02,340
  TDS (service 3y 4m)      −₹   70,234
  ─────────────────────────────────────
  You receive               ₹ 6,32,106
  Expected credit           7–15 days after approval

  Filing Form 15G would save you ₹70,234 →
```

That last line is the second-best moment in the demo.

---

## What is deliberately NOT built

Stated plainly, because restraint reads as judgment:

- **No admin or employer portal** — explicitly not reviewed by judges
- **No real EPFO integration** — this is a proof of concept; all data is mock
- **No Aadhaar/OTP authentication theatre** — a plain credential box, so a judge gets in instantly
- **No registration flow** — accounts are pre-seeded
- **No 3D, no scroll-jacking, no decorative motion** — the organisers explicitly flagged this as low-value
- **No grievance filing, no passbook, no multi-UAN merge** — real needs, deferred to Round 2 (see [10-roadmap.md](10-roadmap.md))

---

## Screen inventory

| Route | Screen | Flow |
|---|---|---|
| `/` | Login (credentials pre-filled and visible) | — |
| `/claims` | All claims, status at a glance | 2 |
| `/claims/[id]` | Timeline + decoder when rejected | 1a, 2 |
| `/validator` | Pre-submission check | 1b |
| `/calculator` | Withdrawal / pension estimate | 3 |

Five routes. That is the entire application surface.

Next: [04-mock-data.md](04-mock-data.md) · [05-design-system.md](05-design-system.md)
