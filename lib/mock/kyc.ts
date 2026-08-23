import type { KycCheck, Member, Severity } from "@/lib/types";
import { formatDate, formatDob, formatTenure, inr } from "@/lib/format";
import { estimateWithdrawal } from "@/lib/estimate";

export interface KycVerdict {
  headline: string;
  blockers: number;
  warnings: number;
  clear: number;
  severity: Severity;
}

/**
 * The validator: the same cross-check that explains a rejection, run before
 * filing. Derived from the member record so the decoder and the validator can
 * never disagree with each other.
 */
export function checksFor(member: Member): KycCheck[] {
  const checks: KycCheck[] = [];

  checks.push(
    member.dobEpfo === member.dobAadhaar
      ? {
          id: "dob",
          label: "Date of birth",
          kind: "records",
          compares: "EPFO against Aadhaar",
          severity: "blocker",
          status: "clear",
          clearNote: `Both records say ${formatDob(member.dobEpfo)}.`,
        }
      : {
          id: "dob",
          label: "Date of birth",
          kind: "records",
          compares: "EPFO against Aadhaar",
          severity: "blocker",
          status: "mismatch",
          left: { source: "EPFO", value: formatDob(member.dobEpfo) },
          right: { source: "Aadhaar", value: formatDob(member.dobAadhaar) },
          fixId: "fix_dob_online",
        },
  );

  checks.push(
    member.nameEpfo === member.namePan
      ? {
          id: "name_pan",
          label: "Name on PAN",
          kind: "records",
          compares: "EPFO against PAN",
          severity: "warning",
          status: "clear",
          clearNote: `Both records say ${member.nameEpfo}.`,
        }
      : {
          id: "name_pan",
          label: "Name on PAN",
          kind: "records",
          compares: "EPFO against PAN",
          severity: "warning",
          status: "mismatch",
          left: { source: "EPFO", value: member.nameEpfo },
          right: { source: "PAN", value: member.namePan },
          costsYou:
            "TDS is deducted at 20% instead of 10% when PAN cannot be matched.",
          fixId: "fix_name_jd",
        },
  );

  checks.push({
    id: "aadhaar",
    label: "Aadhaar seeding",
    kind: "presence",
    compares: "Linked and verified against your UAN",
    severity: "blocker",
    status: member.aadhaarSeeded ? "clear" : "missing",
    clearNote: member.aadhaarSeeded ? "Linked and verified." : undefined,
    fixId: member.aadhaarSeeded ? undefined : "fix_aadhaar_seed",
  });

  checks.push({
    id: "bank",
    label: "Bank account and IFSC",
    kind: "presence",
    compares: "Seeded and verified by your employer",
    severity: "blocker",
    status: member.bankVerified ? "clear" : "missing",
    clearNote: member.bankVerified
      ? `Account ending ${member.bankAccount.slice(-4)}, IFSC ${member.ifsc}.`
      : undefined,
    fixId: member.bankVerified ? undefined : "fix_bank_kyc",
  });

  checks.push({
    id: "date_of_exit",
    label: "Date of exit",
    kind: "presence",
    compares: "Marked against your last employer",
    severity: "blocker",
    status: member.dateOfExit ? "clear" : "missing",
    clearNote: member.dateOfExit
      ? `Marked as ${formatDate(member.dateOfExit)}.`
      : undefined,
    fixId: member.dateOfExit ? undefined : "fix_date_of_exit",
  });

  const fiveYears = member.serviceMonths >= 60;
  const estimate = estimateWithdrawal(member, false);

  checks.push({
    id: "service",
    label: "Service length",
    kind: "threshold",
    compares: "Five years of continuous service",
    severity: "warning",
    status: fiveYears ? "clear" : "mismatch",
    clearNote: fiveYears
      ? `${formatTenure(member.serviceMonths)} of service. Your withdrawal is tax free.`
      : undefined,
    left: fiveYears
      ? undefined
      : { source: "Your service", value: formatTenure(member.serviceMonths) },
    right: fiveYears
      ? undefined
      : { source: "Tax free after", value: "5y 0m" },
    costsYou: fiveYears
      ? undefined
      : `TDS of ${inr(estimate.tds)} will be deducted. This is not a rejection, it is a deduction.`,
  });

  if (!fiveYears) {
    checks.push({
      id: "form_15g",
      label: "Form 15G",
      kind: "presence",
      compares: "Filed before the claim, if your income is below the tax limit",
      severity: "warning",
      status: member.form15GFiled ? "clear" : "missing",
      clearNote: member.form15GFiled ? "Filed. No TDS will be deducted." : undefined,
      costsYou: member.form15GFiled
        ? undefined
        : `Filing it before you claim would keep ${inr(estimate.tds)} that you are about to lose.`,
      fixId: member.form15GFiled ? undefined : "fix_form_15g",
    });
  }

  return checks;
}

export function verdictFor(checks: KycCheck[]): KycVerdict {
  const failing = checks.filter((c) => c.status !== "clear");
  const blockers = failing.filter((c) => c.severity === "blocker").length;
  const warnings = failing.filter((c) => c.severity === "warning").length;
  const clear = checks.length - failing.length;

  let headline: string;
  if (blockers > 0) {
    headline = `${blockers} ${blockers === 1 ? "thing" : "things"} would get this claim rejected. Fix ${blockers === 1 ? "it" : "them"} first.`;
  } else if (warnings > 0) {
    headline = `Nothing here would get you rejected, but ${warnings} ${warnings === 1 ? "thing" : "things"} will cost you money or time.`;
  } else {
    headline = "Everything checks out. Nothing here would get your claim rejected.";
  }

  return {
    headline,
    blockers,
    warnings,
    clear,
    severity: blockers > 0 ? "blocker" : warnings > 0 ? "warning" : "clear",
  };
}

/** Blockers first, then warnings, then everything already clear. */
export function orderChecks(checks: KycCheck[]): KycCheck[] {
  const rank = (c: KycCheck) =>
    c.status === "clear" ? 2 : c.severity === "blocker" ? 0 : 1;
  return [...checks].sort((a, b) => rank(a) - rank(b));
}
