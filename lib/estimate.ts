import type { Member } from "@/lib/types";

export interface WithdrawalEstimate {
  employeeShare: number;
  employerShare: number;
  interest: number;
  corpus: number;
  tdsApplies: boolean;
  tdsRate: number;
  tds: number;
  receives: number;
  serviceMonths: number;
  form15GFiled: boolean;
  /** What filing Form 15G would save, in rupees. Zero when it is already filed. */
  savingFrom15G: number;
  ruleText: string;
  creditWindow: string;
}

const TDS_RATE = 0.1;
/** TDS is only cut when the taxable amount is ₹50,000 or more. */
const TDS_THRESHOLD = 50000;

export function estimateWithdrawal(
  member: Member,
  form15GFiled = member.form15GFiled,
): WithdrawalEstimate {
  const { employeeShare, employerShare, interest } = member.balance;
  const corpus = employeeShare + employerShare + interest;
  const fiveYears = member.serviceMonths >= 60;

  const wouldBeTaxed = !fiveYears && corpus >= TDS_THRESHOLD;
  const tdsApplies = wouldBeTaxed && !form15GFiled;
  const tds = tdsApplies ? Math.round(corpus * TDS_RATE) : 0;

  let ruleText: string;
  if (fiveYears) {
    ruleText =
      "You have more than 5 years of service, so this withdrawal is tax free. Nothing is deducted.";
  } else if (!wouldBeTaxed) {
    ruleText =
      "Your service is under 5 years, but the amount is below ₹50,000, so no TDS is deducted.";
  } else if (form15GFiled) {
    ruleText =
      "Your service is under 5 years, so 10% TDS would normally be deducted. Form 15G is filed, so it is not.";
  } else {
    ruleText =
      "Your service is under 5 years, so 10% TDS is deducted at settlement. Form 15G stops it, but only if you file it before the claim.";
  }

  return {
    employeeShare,
    employerShare,
    interest,
    corpus,
    tdsApplies,
    tdsRate: TDS_RATE,
    tds,
    receives: corpus - tds,
    serviceMonths: member.serviceMonths,
    form15GFiled,
    savingFrom15G: wouldBeTaxed && !form15GFiled ? Math.round(corpus * TDS_RATE) : 0,
    ruleText,
    creditWindow: "7 to 15 days after EPFO approves the claim",
  };
}

/**
 * Table D of the EPS scheme: the withdrawal benefit for members who leave with
 * under 10 years of service, expressed as a multiple of monthly wages.
 */
const TABLE_D: Record<number, number> = {
  1: 1.02,
  2: 1.99,
  3: 2.98,
  4: 3.99,
  5: 5.02,
  6: 6.07,
  7: 7.13,
  8: 8.22,
  9: 9.33,
};

export interface PensionEstimate {
  /** Monthly pension needs 10 years of pensionable service. */
  eligibleForMonthlyPension: boolean;
  serviceMonths: number;
  serviceYears: number;
  pensionableSalary: number;
  /** Set when the member has 10 years or more. */
  monthlyPension?: number;
  earliestPensionAge?: number;
  /** Set when the member has under 10 years — this is what actually applies. */
  withdrawalBenefit?: number;
  tableDFactor?: number;
  /** What the monthly pension would become if they reach 10 years. */
  pensionAtTenYears: number;
  monthsShortOfTenYears: number;
  formulaText: string;
  ruleText: string;
}

export function estimatePension(member: Member): PensionEstimate {
  const serviceYears = Math.floor(member.serviceMonths / 12);
  const salary = member.pensionableSalary;
  const eligible = member.serviceMonths >= 120;
  const pensionAtTenYears = Math.round((salary * 10) / 70);

  if (eligible) {
    const monthlyPension = Math.max(1000, Math.round((salary * serviceYears) / 70));
    return {
      eligibleForMonthlyPension: true,
      serviceMonths: member.serviceMonths,
      serviceYears,
      pensionableSalary: salary,
      monthlyPension,
      earliestPensionAge: 58,
      pensionAtTenYears,
      monthsShortOfTenYears: 0,
      formulaText: `Pensionable salary ₹${salary.toLocaleString("en-IN")} × ${serviceYears} years of service ÷ 70`,
      ruleText:
        "You have crossed 10 years of pensionable service, so this is paid monthly from age 58 for life. It cannot be withdrawn as a lump sum.",
    };
  }

  const factor = TABLE_D[Math.max(1, Math.min(9, serviceYears))];
  return {
    eligibleForMonthlyPension: false,
    serviceMonths: member.serviceMonths,
    serviceYears,
    pensionableSalary: salary,
    withdrawalBenefit: Math.round(salary * factor),
    tableDFactor: factor,
    pensionAtTenYears,
    monthsShortOfTenYears: 120 - member.serviceMonths,
    formulaText: `Pensionable salary ₹${salary.toLocaleString("en-IN")} × ${factor} (Table D, ${serviceYears} completed years)`,
    ruleText:
      "A monthly pension needs 10 years of pensionable service. Under 10 years you get a one-time withdrawal benefit instead, calculated from Table D of the pension scheme. EPFO never states this, which is why most members expect a pension they are not yet entitled to.",
  };
}
