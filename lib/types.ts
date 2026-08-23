export type Severity = "blocker" | "warning" | "clear";

export type ClaimStatus =
  | "IN_PROGRESS"
  | "STALLED"
  | "REJECTED"
  | "APPROVED"
  | "CREDITED";

export type StageStatus =
  | "DONE"
  | "ACTIVE"
  | "STALLED"
  | "REJECTED"
  | "NOT_STARTED";

export interface Member {
  uan: string;
  password: string;
  name: string;
  /** The two values the decoder puts side by side. */
  dobEpfo: string;
  dobAadhaar: string;
  nameEpfo: string;
  namePan: string;
  mobile: string;
  employer: { name: string; city: string };
  dateOfJoining: string;
  dateOfExit: string;
  serviceMonths: number;
  aadhaarSeeded: boolean;
  bankVerified: boolean;
  bankAccount: string;
  ifsc: string;
  form15GFiled: boolean;
  balance: { employeeShare: number; employerShare: number; interest: number };
  /** EPS wage is capped at ₹15,000 by statute. */
  pensionableSalary: number;
}

export interface Claim {
  id: string;
  uan: string;
  type: "FORM_19" | "FORM_10C" | "FORM_31";
  typeLabel: string;
  filedOn: string;
  status: ClaimStatus;
  amountClaimed: number;
  amountCredited?: number;
  settledOn?: string;
  rejection?: { code: string; portalRemark: string };
}

export interface ClaimEvent {
  claimId: string;
  stage: string;
  stageLabel: string;
  enteredOn?: string;
  status: StageStatus;
  heldBy?: string;
  waitingOn?: string;
  youCanDo?: { label: string; action: "COPY_NUDGE" | "OPEN_VALIDATOR" | "NONE" };
  nothingToDo?: string;
  normalDurationDays: [number, number];
  actualDurationDays?: number;
  escalation?: string;
}

export interface KycCheck {
  id: string;
  label: string;
  severity: Severity;
  status: "mismatch" | "missing" | "clear";
  /**
   * "records" is a genuine disagreement between two records and gets the diff
   * treatment. "threshold" is a value measured against a rule, and "presence"
   * is something that is simply there or not — neither is a disagreement, so
   * neither gets rendered as one.
   */
  kind: "records" | "threshold" | "presence";
  compares: string;
  left?: { source: string; value: string };
  right?: { source: string; value: string };
  clearNote?: string;
  costsYou?: string;
  fixId?: string;
}

/** The Action Card payload. Five slots, none omissible. */
export interface Fix {
  id: string;
  title: string;
  whatYouNeed: string[];
  whatItCosts: string;
  howLong: string;
  nextStep: string;
  nextStepHref?: string;
  whatGoesWrong: string;
}

export interface Decoded {
  recognised: boolean;
  code: string;
  portalRemark: string;
  plainTitle: string;
  why: string;
  mismatch?: { label: string; left: { source: string; value: string }; right: { source: string; value: string }; note: string };
  fixId?: string;
  /** Used only when the code is not in the taxonomy. */
  grievance?: { title: string; body: string; href: string };
}
