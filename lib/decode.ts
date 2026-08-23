import type { Claim, Decoded, Member } from "@/lib/types";
import { formatDob } from "@/lib/format";

type Entry = {
  plainTitle: string;
  why: string;
  fixId: string;
  mismatch?: (m: Member) => Decoded["mismatch"];
};

/**
 * The rejection taxonomy: portal code to plain language.
 *
 * The important property of this map is what happens when a code is *not* in
 * it. See decode() — an unrecognised code is reported as unrecognised. A
 * decoder that confidently invents an explanation would be worse than the
 * portal it replaces.
 */
const TAXONOMY: Record<string, Entry> = {
  "R-217": {
    plainTitle: "Two records disagree about your date of birth",
    why: "EPFO cannot release money to an identity it cannot match against UIDAI. Until the two dates are the same, every claim on this UAN will be rejected the same way.",
    fixId: "fix_dob_online",
    mismatch: (m) => ({
      label: "Date of birth",
      left: { source: "On your EPFO record", value: formatDob(m.dobEpfo) },
      right: { source: "On your Aadhaar", value: formatDob(m.dobAadhaar) },
      note: "One year apart.",
    }),
  },
  "R-104": {
    plainTitle: "Your date of exit was never marked",
    why: "EPFO reads a missing exit date as you still being employed, and a final settlement cannot be paid to someone who has not left. Your employer stopped contributing, but nobody closed the record.",
    fixId: "fix_date_of_exit",
  },
  "R-133": {
    plainTitle: "The name on your claim does not match your Aadhaar",
    why: "The payment is matched against UIDAI on name as well as date of birth. An extra initial or a spelling difference is enough to stop it.",
    fixId: "fix_name_jd",
    mismatch: (m) => ({
      label: "Name",
      left: { source: "On your EPFO record", value: m.nameEpfo },
      right: { source: "On your PAN", value: m.namePan },
      note: "The records are not identical.",
    }),
  },
  "R-152": {
    plainTitle: "Your bank account could not be verified",
    why: "EPFO transfers only to an account it has verified in your own name. An unverified, joint or dormant account fails at the last step, after everything else has been approved.",
    fixId: "fix_bank_kyc",
  },
  "R-181": {
    plainTitle: "Aadhaar is not seeded against your UAN",
    why: "Since 2021 every online claim is matched to Aadhaar first. Without seeding there is nothing to match against, so the claim never reaches an officer.",
    fixId: "fix_aadhaar_seed",
  },
};

export function decode(claim: Claim, member: Member): Decoded | undefined {
  if (claim.status !== "REJECTED" || !claim.rejection) return undefined;

  const { code, portalRemark } = claim.rejection;
  const entry = TAXONOMY[code];

  // Unmapped code: say so, and route to a grievance. Never guess.
  if (!entry) {
    return {
      recognised: false,
      code,
      portalRemark,
      plainTitle: "We do not recognise this rejection code",
      why: "This code is not in our list, and we are not going to guess at what it means. Guessing would send you to the wrong correction and cost you another three weeks.",
      grievance: {
        title: "Ask EPFO what it means, in writing",
        body: "File a grievance quoting this exact code and claim reference. Grievances that quote the code and ask one specific question get answered; general complaints get a template reply.",
      },
      fixId: "fix_grievance",
    };
  }

  return {
    recognised: true,
    code,
    portalRemark,
    plainTitle: entry.plainTitle,
    why: entry.why,
    mismatch: entry.mismatch?.(member),
    fixId: entry.fixId,
  };
}

export function isCodeKnown(code: string): boolean {
  return code in TAXONOMY;
}

/** The codes the model is allowed to choose from. It cannot invent one. */
export const TAXONOMY_CODES = Object.keys(TAXONOMY);

/**
 * Decode a code without a claim attached — used when a member pastes their own
 * rejection wording and there is no seeded claim behind it. No member record, so
 * no side-by-side values: the explanation only.
 */
export function decodeByCode(code: string, portalRemark: string): Decoded | undefined {
  const entry = TAXONOMY[code];
  if (!entry) return undefined;

  return {
    recognised: true,
    code,
    portalRemark,
    plainTitle: entry.plainTitle,
    why: entry.why,
    fixId: entry.fixId,
  };
}
