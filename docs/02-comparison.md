# 02 — Current EPFO vs This Build

The highest-leverage document. It feeds the 250-word summary, minute 2 of the video, and the Bangalore pitch.

> **Rule for this file: every claim must be traceable to something observable on the real portal.** No invented statistics. Where a number is an estimate, it is labelled as one. A judge who has used EPFO will spot an exaggeration instantly, and it costs more credibility than the claim buys.

<!-- TODO: from real portal — measure the "EPFO today" column during the Day 1–2 walkthrough. Do not fill from memory. -->

---

## Master comparison

| Task | EPFO today | PF Clear | Why it's better for the citizen |
|---|---|---|---|
| **Check claim status** | Login → Online Services → Track Claim Status → status shows a single phrase, e.g. "Under Process" | Claim list on landing; a timeline showing the current stage, its owner, and its duration | The member learns *where* it is, not merely *that* it exists |
| **Understand a rejection** | An internal remark string with a reference code, written for a field officer | Plain-language decode: the two conflicting values, why it blocks payment, the exact fix | Turns a dead end into a next step |
| **Fix a KYC mismatch** | Discovered only after rejection, weeks later; correction route must be researched separately | Validator flags it **before** filing, with the correction form, cost, and timeline attached | Prevents the rejection instead of explaining it afterwards |
| **Know the payout amount** | Passbook of contribution rows; TDS and eligibility not applied | One number with the full deduction breakdown and a realistic credit window | Answers the only question the member came to ask |
| **Know what's blocking the claim** | No indication that the employer holds it | Named owner, what they're waiting on, an overdue flag, a ready-written nudge message | The most common stall becomes visible and actionable |
| **Find the right form** | Form numbers with no plain-language mapping | Forms surfaced by situation, official name kept in parentheses | Members search by problem, not by form number |
| **Mobile experience** | Desktop-era layout, dense tables, small tap targets | Designed at 375px first, single column, one primary action per screen | Most members are on a phone |

---

## Screen by screen

Each pair: the real portal on the left, this build on the right, with the specific change annotated.

### Claim status
| Real EPFO | PF Clear |
|---|---|
| `assets/real/status-under-process.png` | `assets/ours/claim-timeline.png` |

**Changed:** one opaque phrase becomes a five-stage timeline. The active stage names who is holding it and what they are waiting on. Stages past their normal duration are flagged.
**Kept:** the official claim type and form number, so the member can still match it against EPFO correspondence.

### Rejection
| Real EPFO | PF Clear |
|---|---|
| `assets/real/rejection-remark.png` | `assets/ours/decoder.png` |

**Changed:** the remark string is decoded — the two conflicting values shown side by side, the reason stated in one sentence, the fix presented as an Action Card.
**Kept:** the original portal remark and reference code, shown verbatim underneath. The member will need to quote it in a grievance.

### KYC
| Real EPFO | PF Clear |
|---|---|
| `assets/real/kyc-fields.png` | `assets/ours/validator.png` |

**Changed:** a passive list of stored fields becomes an active cross-check with a verdict and severity ordering.

### Passbook / payout
| Real EPFO | PF Clear |
|---|---|
| `assets/real/passbook.png` | `assets/ours/calculator.png` |

**Changed:** contribution rows become a single answer, with TDS applied and Form 15G's effect made visible.
**Kept:** the underlying contribution figures, available beneath the summary.

---

## Measured differences

<!-- TODO: measure on the real portal, then fill. Estimates must be labelled. -->

| Measure | EPFO today | PF Clear | Method |
|---|---|---|---|
| Clicks from login to claim status | _tbd_ | 2 | Counted on both |
| Clicks from login to knowing *why* a claim failed | _tbd_ | 2 | Counted on both |
| Clicks to know what you'll actually receive | not available | 2 | — |
| Unexplained jargon terms on the status screen | _tbd_ | 0 | Count of terms with no plain-language gloss |
| Dead ends (a screen with no available next action) | _tbd_ | 0 | Screens offering no forward action |
| Renders usably at 375px | _tbd_ | yes | Visual check |

Counting method stated so the numbers are checkable rather than asserted.

---

## What was deliberately NOT changed

Restraint is part of the argument. A proof of concept that rewrites everything is easy to dismiss as naive about the real constraints.

- **Form numbers and official terminology stay.** Form 19, Form 10C, Form 31 appear as-is, with plain-language labels alongside. Members receive EPFO letters and SMS quoting these; renaming them would break continuity.
- **The claim workflow itself is untouched.** Employer attestation and field-officer review remain in the sequence. They are statutory. This build makes them *visible*, not shorter.
- **Original portal remarks are preserved verbatim.** The decode sits above them; it does not replace them.
- **Stated timelines are ranges, never promises.** EPFO cannot guarantee a date, so neither does this.
- **No claim to have fixed EPFO's data quality.** The mismatches this build surfaces still have to be corrected through official channels; the contribution is making them visible early.

---

## The argument in one paragraph

> EPFO's member portal is not primarily a design problem — it is an information problem. It knows where a claim is, who is holding it, why it failed, and what a member will receive, and it discloses almost none of it. This build changes no rule and no form. It takes the information EPFO already holds and answers the three questions members actually have: where is my money, who is blocking it, and what do I do next.

That paragraph is the seed for [08-submission.md](08-submission.md).

Next: [03-features.md](03-features.md) · [08-submission.md](08-submission.md)
