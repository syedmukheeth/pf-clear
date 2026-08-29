import type { Decoded } from "@/lib/types";
import { FIXES } from "@/lib/mock/fixes";
import { TAXONOMY_CODES, decodeByCode } from "@/lib/decode";
import {
  ModelUnavailable,
  asUntrustedData,
  callModel,
  hasModelAccess,
  MODEL,
  type Provenance,
} from "./client";

/**
 * Decode a free-text rejection remark.
 *
 * The static taxonomy handles five known codes. Real EPFO remarks are free text,
 * inconsistently worded, often without a code at all — which is exactly the part
 * a lookup table cannot cover at national scale. The model normalises the remark
 * into one of the reasons we already know how to fix; if it cannot, it says so
 * and the member is routed to a grievance rather than a guess.
 */

export interface RemarkDecode {
  decoded: Decoded;
  provenance: Provenance;
  /** 0 to 1. Below the floor we refuse to route the member anywhere. */
  confidence: number;
}

const CONFIDENCE_FLOOR = 0.6;

const FIX_IDS = Object.keys(FIXES);

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["recognised", "code", "plainTitle", "why", "fixId", "confidence"],
  properties: {
    recognised: {
      type: "boolean",
      description: "True only if this remark clearly matches one known reason.",
    },
    code: {
      type: "string",
      enum: [...TAXONOMY_CODES, "UNKNOWN"],
      description: "The taxonomy code this remark corresponds to, or UNKNOWN.",
    },
    plainTitle: {
      type: "string",
      description:
        "One sentence, under 12 words, saying what went wrong in plain English. No jargon, no code numbers.",
    },
    why: {
      type: "string",
      description:
        "Two or three sentences explaining why this stops a payment. Written for someone who has never used the portal before.",
    },
    fixId: {
      type: "string",
      enum: [...FIX_IDS, "NONE"],
      description: "Which correction route applies, or NONE if unclear.",
    },
    confidence: {
      type: "number",
      description: "0 to 1. Be strict: below 0.6 means you are not sure.",
    },
  },
} as const;

const SYSTEM = [
  "You explain EPFO (Indian provident fund) claim rejections to members in plain English.",
  "",
  "Rules you must follow:",
  "- Map the remark to one of the known reasons only when it clearly matches.",
  "- If it is ambiguous, mentions a rule you cannot interpret, or could mean several things, set recognised=false, code=UNKNOWN, fixId=NONE and a low confidence.",
  "- Never invent a correction route. A wrong route costs the member weeks.",
  "- Never state a document, fee or timeline that was not given to you.",
  "- Write for someone on a phone who has never used the portal. Short sentences. No jargon, no abbreviations left unexplained.",
  "- Do not address the member by name and do not apologise.",
].join("\n");

function grievanceFallback(remark: string, provenance: Provenance): RemarkDecode {
  return {
    provenance,
    confidence: 0,
    decoded: {
      recognised: false,
      code: "UNKNOWN",
      portalRemark: remark,
      plainTitle: "We cannot tell you what this one means",
      why: "This wording does not clearly match any rejection reason we know how to fix, and we are not going to guess. A wrong correction costs another three weeks and the money still does not arrive.",
      grievance: {
        title: "Ask EPFO what it means, in writing",
        body: "File a grievance quoting this exact wording and your claim reference. Grievances that quote the rejection text and ask one specific question get answered; general complaints get a template reply.",
      },
      fixId: "fix_grievance",
    },
  };
}

/** Keyword pass used when there is no model available. Deliberately narrow. */
function decodeByKeyword(remark: string): string | undefined {
  const text = remark.toLowerCase();
  if (/(dob|date of birth|birth)/.test(text) && /(mismatch|not match|differ|uidai)/.test(text))
    return "R-217";
  if (/(date of exit|doe|exit date)/.test(text)) return "R-104";
  if (/name/.test(text) && /(mismatch|not match|differ)/.test(text)) return "R-133";
  if (/(bank|ifsc|account)/.test(text)) return "R-152";
  if (/aadhaar|aadhar|uidai/.test(text) && /(seed|link|not linked)/.test(text))
    return "R-181";
  return undefined;
}

export async function decodeRemark(remark: string): Promise<RemarkDecode> {
  const trimmed = remark.trim();

  if (!hasModelAccess()) {
    const code = decodeByKeyword(trimmed);
    const decoded = code ? decodeByCode(code, trimmed) : undefined;
    const provenance: Provenance = {
      source: "rules",
      reason: "No model configured for this deployment. Matched on keywords instead.",
    };
    return decoded
      ? { decoded, provenance, confidence: 0.5 }
      : grievanceFallback(trimmed, provenance);
  }

  try {
    const result = await callModel<{
      recognised: boolean;
      code: string;
      plainTitle: string;
      why: string;
      fixId: string;
      confidence: number;
    }>({
      system: SYSTEM,
      user: asUntrustedData("rejection_remark", trimmed),
      schema: SCHEMA as unknown as Record<string, unknown>,
      schemaName: "rejection_decode",
    });

    const provenance: Provenance = { source: "model", model: MODEL };

    const usable =
      result.recognised &&
      result.confidence >= CONFIDENCE_FLOOR &&
      result.fixId !== "NONE" &&
      FIX_IDS.includes(result.fixId);

    if (!usable) return { ...grievanceFallback(trimmed, provenance), confidence: result.confidence };

    return {
      provenance,
      confidence: result.confidence,
      decoded: {
        recognised: true,
        code: result.code,
        portalRemark: trimmed,
        plainTitle: result.plainTitle,
        why: result.why,
        fixId: result.fixId,
      },
    };
  } catch (error) {
    // A model outage must not take the feature down. Fall back and say so.
    console.error("[decode] model unavailable:", error instanceof Error ? error.message : error);
    const provenance: Provenance = {
      source: "rules",
      reason:
        error instanceof ModelUnavailable
          ? "The model could not be reached, so this was matched on keywords."
          : "Something went wrong reaching the model, so this was matched on keywords.",
    };
    const code = decodeByKeyword(trimmed);
    const decoded = code ? decodeByCode(code, trimmed) : undefined;
    return decoded
      ? { decoded, provenance, confidence: 0.5 }
      : grievanceFallback(trimmed, provenance);
  }
}
