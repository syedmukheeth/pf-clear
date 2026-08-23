import type { Fix } from "@/lib/types";

/**
 * Action Card payloads, keyed by fixId.
 *
 * Five slots, none omissible: what you need, what it costs, how long it takes,
 * your one next step, and what usually goes wrong. If a fix cannot fill all
 * five, it is not ready to show a member.
 */
export const FIXES: Record<string, Fix> = {
  fix_dob_online: {
    id: "fix_dob_online",
    title: "Correct your date of birth with EPFO",
    whatYouNeed: [
      "Your Aadhaar (the date of birth on it is the one EPFO will accept)",
      "UAN login",
      "No employer signature, as long as the difference is 3 years or less",
    ],
    whatItCosts: "Free",
    howLong: "7 to 10 days once EPFO picks it up",
    nextStep:
      "Raise a date of birth correction under Manage, then Modify Basic Details",
    whatGoesWrong:
      "A difference of more than 3 years needs your employer to co-sign a Joint Declaration, which is where most corrections stall. Yours is 1 year, so you can do this alone.",
  },
  fix_name_jd: {
    id: "fix_name_jd",
    title: "Make the name on PAN and EPFO match",
    whatYouNeed: [
      "PAN card",
      "Aadhaar",
      "Joint Declaration form signed by your employer",
    ],
    whatItCosts: "Free",
    howLong: "15 to 30 days, because it goes through your employer",
    nextStep: "Ask your employer's HR to file a Joint Declaration for the name",
    whatGoesWrong:
      "A middle initial that exists on PAN but not on EPFO will not stop this claim, but it will hold up your TDS credit later. Employers often sit on the Joint Declaration, so ask before you file, not after.",
  },
  fix_form_15g: {
    id: "fix_form_15g",
    title: "File Form 15G before you withdraw",
    whatYouNeed: [
      "PAN linked to your UAN",
      "Total income for the year below the taxable limit",
      "Form 15G, filled online in the member portal",
    ],
    whatItCosts: "Free, and it stops 10% being deducted",
    howLong: "Takes 5 minutes, applies to claims filed after it",
    nextStep: "File Form 15G under Online Services before filing the claim",
    whatGoesWrong:
      "Filing it after the claim is submitted does nothing. The deduction is taken at settlement, and the only way back is a refund at the end of the financial year.",
  },
  fix_bank_kyc: {
    id: "fix_bank_kyc",
    title: "Get your bank account verified",
    whatYouNeed: [
      "Bank account in your own name",
      "IFSC code",
      "Cancelled cheque or a passbook page with your name printed on it",
    ],
    whatItCosts: "Free",
    howLong: "3 to 7 days, your employer approves it",
    nextStep: "Add the account under Manage, then KYC, then wait for approval",
    whatGoesWrong:
      "A joint account where you are the second holder is rejected. So is an account the bank has marked dormant.",
  },
  fix_aadhaar_seed: {
    id: "fix_aadhaar_seed",
    title: "Link and verify Aadhaar against your UAN",
    whatYouNeed: ["Aadhaar number", "Mobile number registered with Aadhaar"],
    whatItCosts: "Free",
    howLong: "Same day if the OTP goes through",
    nextStep: "Seed Aadhaar under Manage, then KYC, and verify with the OTP",
    whatGoesWrong:
      "If your mobile number is not registered with Aadhaar there is no OTP, and the only route left is a visit to an Aadhaar centre first.",
  },
  fix_date_of_exit: {
    id: "fix_date_of_exit",
    title: "Get your date of exit marked",
    whatYouNeed: ["Your last working day", "UAN login"],
    whatItCosts: "Free",
    howLong: "Immediate if you mark it yourself, 2 to 3 weeks via the employer",
    nextStep:
      "Mark the exit date yourself under Manage, then Mark Exit, two months after you left",
    whatGoesWrong:
      "You cannot mark it until two months have passed since your last contribution. Before that, only the employer can, and this is the single most common reason a final settlement is rejected.",
  },
  fix_grievance: {
    id: "fix_grievance",
    title: "Raise a grievance with EPFO",
    whatYouNeed: [
      "UAN",
      "Claim reference number",
      "The exact rejection text from the portal",
    ],
    whatItCosts: "Free",
    howLong: "15 to 30 days for a first response",
    nextStep: "File the grievance on EPFiGMS with your claim reference",
    whatGoesWrong:
      "Grievances written as complaints get closed with a template reply. Grievances that quote the rejection code and ask one specific question get answered.",
  },
  fix_employer_nudge: {
    id: "fix_employer_nudge",
    title: "Push your employer to sign",
    whatYouNeed: [
      "Your employer's HR or payroll contact",
      "Your UAN and the claim reference",
    ],
    whatItCosts: "Free",
    howLong: "Most employers sign within 3 days of being asked directly",
    nextStep: "Send the ready-written request below to your HR contact",
    whatGoesWrong:
      "A general follow-up gets forwarded and forgotten. Naming the exact action, the digital signature by the authorised signatory, is what moves it.",
  },
};

export function findFix(id?: string): Fix | undefined {
  return id ? FIXES[id] : undefined;
}
