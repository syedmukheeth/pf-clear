import type { Claim, ClaimEvent } from "@/lib/types";
import { daysAgo } from "./clock";

/** Claims — docs/04-mock-data.md. Every member has more than one row on purpose. */
export const CLAIMS: Claim[] = [
  // Priya — happy path
  {
    id: "clm_a1",
    uan: "100100100001",
    type: "FORM_19",
    typeLabel: "Final PF settlement (Form 19)",
    filedOn: daysAgo(52),
    status: "CREDITED",
    amountClaimed: 464767,
    amountCredited: 418290,
    settledOn: daysAgo(35),
  },
  {
    id: "clm_a2",
    uan: "100100100001",
    type: "FORM_10C",
    typeLabel: "Pension withdrawal benefit (Form 10C)",
    filedOn: daysAgo(52),
    status: "CREDITED",
    amountClaimed: 59850,
    amountCredited: 59850,
    settledOn: daysAgo(33),
  },

  // Ramesh — stalled at the employer
  {
    id: "clm_b1",
    uan: "100100100002",
    type: "FORM_19",
    typeLabel: "Final PF settlement (Form 19)",
    filedOn: daysAgo(23),
    status: "STALLED",
    amountClaimed: 1233640,
  },
  {
    id: "clm_b2",
    uan: "100100100002",
    type: "FORM_31",
    typeLabel: "Partial advance for housing (Form 31)",
    filedOn: daysAgo(300),
    status: "CREDITED",
    amountClaimed: 85000,
    amountCredited: 85000,
    settledOn: daysAgo(289),
  },
  // An earlier attempt rejected with a code the decoder does not recognise.
  // This exists so the honest fallback is reachable in the demo, not just in
  // the code: an unknown code is reported as unknown.
  {
    id: "clm_b3",
    uan: "100100100002",
    type: "FORM_31",
    typeLabel: "Partial advance for illness (Form 31)",
    filedOn: daysAgo(420),
    status: "REJECTED",
    amountClaimed: 60000,
    rejection: {
      code: "R-441",
      portalRemark:
        "Claim rejected: Member not eligible as per para 68J. Ref: R-441",
    },
  },

  // Arun — rejected, the hero demo
  {
    id: "clm_c1",
    uan: "100100100003",
    type: "FORM_19",
    typeLabel: "Final PF settlement (Form 19)",
    filedOn: daysAgo(37),
    status: "REJECTED",
    amountClaimed: 702340,
    rejection: {
      code: "R-217",
      portalRemark:
        "Claim rejected: DOB not matching with UIDAI records. Ref: R-217",
    },
  },
  {
    id: "clm_c2",
    uan: "100100100003",
    type: "FORM_10C",
    typeLabel: "Pension withdrawal benefit (Form 10C)",
    filedOn: daysAgo(37),
    status: "STALLED",
    amountClaimed: 44700,
  },
];

/**
 * Timeline nodes. Each answers four questions: who holds it, what they are
 * waiting on, what you can do today, and how long this stage usually takes.
 */
export const CLAIM_EVENTS: ClaimEvent[] = [
  // clm_a1 — Priya, settled cleanly
  {
    claimId: "clm_a1",
    stage: "SUBMITTED",
    stageLabel: "Claim submitted",
    enteredOn: daysAgo(52),
    status: "DONE",
    normalDurationDays: [0, 1],
    actualDurationDays: 0,
    nothingToDo: "Filed online through the member portal.",
  },
  {
    claimId: "clm_a1",
    stage: "EMPLOYER_APPROVAL",
    stageLabel: "Employer approval",
    enteredOn: daysAgo(52),
    status: "DONE",
    heldBy: "Kestrel Analytics Pvt Ltd",
    normalDurationDays: [3, 7],
    actualDurationDays: 3,
    nothingToDo: "Signed digitally in 3 days.",
  },
  {
    claimId: "clm_a1",
    stage: "EPFO_REVIEW",
    stageLabel: "EPFO field officer review",
    enteredOn: daysAgo(49),
    status: "DONE",
    heldBy: "EPFO Bengaluru (Peenya)",
    normalDurationDays: [5, 10],
    actualDurationDays: 7,
  },
  {
    claimId: "clm_a1",
    stage: "APPROVED",
    stageLabel: "Approved and sent to bank",
    enteredOn: daysAgo(42),
    status: "DONE",
    normalDurationDays: [2, 5],
    actualDurationDays: 7,
  },
  {
    claimId: "clm_a1",
    stage: "CREDITED",
    stageLabel: "Credited to your bank",
    enteredOn: daysAgo(35),
    status: "DONE",
    normalDurationDays: [3, 7],
    actualDurationDays: 0,
    nothingToDo: "Credited to HDFC account ending 7719.",
  },

  // clm_a2 — Priya, pension withdrawal benefit
  {
    claimId: "clm_a2",
    stage: "SUBMITTED",
    stageLabel: "Claim submitted",
    enteredOn: daysAgo(52),
    status: "DONE",
    normalDurationDays: [0, 1],
    actualDurationDays: 0,
  },
  {
    claimId: "clm_a2",
    stage: "EMPLOYER_APPROVAL",
    stageLabel: "Employer approval",
    enteredOn: daysAgo(52),
    status: "DONE",
    heldBy: "Kestrel Analytics Pvt Ltd",
    normalDurationDays: [3, 7],
    actualDurationDays: 3,
  },
  {
    claimId: "clm_a2",
    stage: "EPFO_REVIEW",
    stageLabel: "EPFO field officer review",
    enteredOn: daysAgo(49),
    status: "DONE",
    heldBy: "EPFO Bengaluru (Peenya)",
    normalDurationDays: [5, 10],
    actualDurationDays: 9,
  },
  {
    claimId: "clm_a2",
    stage: "APPROVED",
    stageLabel: "Approved and sent to bank",
    enteredOn: daysAgo(40),
    status: "DONE",
    normalDurationDays: [2, 5],
    actualDurationDays: 7,
  },
  {
    claimId: "clm_a2",
    stage: "CREDITED",
    stageLabel: "Credited to your bank",
    enteredOn: daysAgo(33),
    status: "DONE",
    normalDurationDays: [3, 7],
    actualDurationDays: 0,
    nothingToDo: "Credited to HDFC account ending 7719.",
  },

  // clm_b1 — Ramesh, stuck at the employer. The emotional core of Flow 2.
  {
    claimId: "clm_b1",
    stage: "SUBMITTED",
    stageLabel: "Claim submitted",
    enteredOn: daysAgo(23),
    status: "DONE",
    normalDurationDays: [0, 1],
    actualDurationDays: 0,
    nothingToDo: "Filed online. Nothing was wrong with your paperwork.",
  },
  {
    claimId: "clm_b1",
    stage: "EMPLOYER_APPROVAL",
    stageLabel: "Employer approval",
    enteredOn: daysAgo(21),
    status: "STALLED",
    heldBy: "Meridian Tech Solutions Pvt Ltd",
    waitingOn: "Digital signature from the authorised signatory",
    youCanDo: { label: "Send them the exact request", action: "COPY_NUDGE" },
    normalDurationDays: [3, 7],
    actualDurationDays: 21,
    escalation:
      "After 30 days at this stage you can escalate to EPFiGMS, the EPFO grievance system.",
  },
  {
    claimId: "clm_b1",
    stage: "EPFO_REVIEW",
    stageLabel: "EPFO field officer review",
    status: "NOT_STARTED",
    heldBy: "EPFO Pune (Akurdi)",
    normalDurationDays: [5, 10],
  },
  {
    claimId: "clm_b1",
    stage: "APPROVED",
    stageLabel: "Approved and sent to bank",
    status: "NOT_STARTED",
    normalDurationDays: [2, 5],
  },
  {
    claimId: "clm_b1",
    stage: "CREDITED",
    stageLabel: "Credited to your bank",
    status: "NOT_STARTED",
    normalDurationDays: [3, 7],
  },

  // clm_b2 — Ramesh, an older advance that went through
  {
    claimId: "clm_b2",
    stage: "SUBMITTED",
    stageLabel: "Claim submitted",
    enteredOn: daysAgo(300),
    status: "DONE",
    normalDurationDays: [0, 1],
    actualDurationDays: 0,
  },
  {
    claimId: "clm_b2",
    stage: "EMPLOYER_APPROVAL",
    stageLabel: "Employer approval",
    enteredOn: daysAgo(300),
    status: "DONE",
    heldBy: "Meridian Tech Solutions Pvt Ltd",
    normalDurationDays: [3, 7],
    actualDurationDays: 4,
  },
  {
    claimId: "clm_b2",
    stage: "EPFO_REVIEW",
    stageLabel: "EPFO field officer review",
    enteredOn: daysAgo(296),
    status: "DONE",
    heldBy: "EPFO Pune (Akurdi)",
    normalDurationDays: [5, 10],
    actualDurationDays: 5,
  },
  {
    claimId: "clm_b2",
    stage: "APPROVED",
    stageLabel: "Approved and sent to bank",
    enteredOn: daysAgo(291),
    status: "DONE",
    normalDurationDays: [2, 5],
    actualDurationDays: 2,
  },
  {
    claimId: "clm_b2",
    stage: "CREDITED",
    stageLabel: "Credited to your bank",
    enteredOn: daysAgo(289),
    status: "DONE",
    normalDurationDays: [3, 7],
    actualDurationDays: 0,
    nothingToDo: "Credited to ICICI account ending 3055.",
  },

  // clm_b3 — Ramesh, rejected on a code the decoder does not know
  {
    claimId: "clm_b3",
    stage: "SUBMITTED",
    stageLabel: "Claim submitted",
    enteredOn: daysAgo(420),
    status: "DONE",
    normalDurationDays: [0, 1],
    actualDurationDays: 0,
  },
  {
    claimId: "clm_b3",
    stage: "EMPLOYER_APPROVAL",
    stageLabel: "Employer approval",
    enteredOn: daysAgo(420),
    status: "DONE",
    heldBy: "Meridian Tech Solutions Pvt Ltd",
    normalDurationDays: [3, 7],
    actualDurationDays: 5,
  },
  {
    claimId: "clm_b3",
    stage: "EPFO_REVIEW",
    stageLabel: "EPFO field officer review",
    enteredOn: daysAgo(415),
    status: "REJECTED",
    heldBy: "EPFO Pune (Akurdi)",
    waitingOn: "Rejected on eligibility grounds, with a code we cannot decode",
    normalDurationDays: [5, 10],
    actualDurationDays: 8,
  },
  {
    claimId: "clm_b3",
    stage: "APPROVED",
    stageLabel: "Approved and sent to bank",
    status: "NOT_STARTED",
    normalDurationDays: [2, 5],
  },
  {
    claimId: "clm_b3",
    stage: "CREDITED",
    stageLabel: "Credited to your bank",
    status: "NOT_STARTED",
    normalDurationDays: [3, 7],
  },

  // clm_c1 — Arun, rejected at EPFO review
  {
    claimId: "clm_c1",
    stage: "SUBMITTED",
    stageLabel: "Claim submitted",
    enteredOn: daysAgo(37),
    status: "DONE",
    normalDurationDays: [0, 1],
    actualDurationDays: 0,
  },
  {
    claimId: "clm_c1",
    stage: "EMPLOYER_APPROVAL",
    stageLabel: "Employer approval",
    enteredOn: daysAgo(37),
    status: "DONE",
    heldBy: "Halcyon Retail India Pvt Ltd",
    normalDurationDays: [3, 7],
    actualDurationDays: 4,
  },
  {
    claimId: "clm_c1",
    stage: "EPFO_REVIEW",
    stageLabel: "EPFO field officer review",
    enteredOn: daysAgo(33),
    status: "REJECTED",
    heldBy: "EPFO Hyderabad (Barkatpura)",
    waitingOn: "Rejected on day 9 of review: your records did not match UIDAI",
    youCanDo: {
      label: "See what went wrong and how to fix it",
      action: "OPEN_VALIDATOR",
    },
    normalDurationDays: [5, 10],
    actualDurationDays: 9,
  },
  {
    claimId: "clm_c1",
    stage: "APPROVED",
    stageLabel: "Approved and sent to bank",
    status: "NOT_STARTED",
    normalDurationDays: [2, 5],
  },
  {
    claimId: "clm_c1",
    stage: "CREDITED",
    stageLabel: "Credited to your bank",
    status: "NOT_STARTED",
    normalDurationDays: [3, 7],
  },

  // clm_c2 — Arun, Form 10C heading for the same rejection
  {
    claimId: "clm_c2",
    stage: "SUBMITTED",
    stageLabel: "Claim submitted",
    enteredOn: daysAgo(37),
    status: "DONE",
    normalDurationDays: [0, 1],
    actualDurationDays: 0,
  },
  {
    claimId: "clm_c2",
    stage: "EMPLOYER_APPROVAL",
    stageLabel: "Employer approval",
    enteredOn: daysAgo(37),
    status: "DONE",
    heldBy: "Halcyon Retail India Pvt Ltd",
    normalDurationDays: [3, 7],
    actualDurationDays: 4,
  },
  {
    claimId: "clm_c2",
    stage: "EPFO_REVIEW",
    stageLabel: "EPFO field officer review",
    enteredOn: daysAgo(33),
    status: "STALLED",
    heldBy: "EPFO Hyderabad (Barkatpura)",
    waitingOn:
      "Officer review. This claim is checked against the same records as the rejected one",
    normalDurationDays: [5, 10],
    actualDurationDays: 33,
    escalation:
      "Fix the date-of-birth mismatch before this claim is reviewed, or it will be rejected for the same reason.",
  },
  {
    claimId: "clm_c2",
    stage: "APPROVED",
    stageLabel: "Approved and sent to bank",
    status: "NOT_STARTED",
    normalDurationDays: [2, 5],
  },
  {
    claimId: "clm_c2",
    stage: "CREDITED",
    stageLabel: "Credited to your bank",
    status: "NOT_STARTED",
    normalDurationDays: [3, 7],
  },
];

export function claimsFor(uan: string): Claim[] {
  return CLAIMS.filter((c) => c.uan === uan);
}

export function findClaim(id: string): Claim | undefined {
  return CLAIMS.find((c) => c.id === id);
}

export function eventsFor(claimId: string): ClaimEvent[] {
  return CLAIM_EVENTS.filter((e) => e.claimId === claimId);
}
