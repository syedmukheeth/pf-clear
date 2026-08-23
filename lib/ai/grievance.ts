import type { Claim, Decoded, Member } from "@/lib/types";
import { claimRef, formatDate } from "@/lib/format";
import {
  MODEL,
  ModelUnavailable,
  asUntrustedData,
  callModel,
  hasModelAccess,
  type Provenance,
} from "./client";

/**
 * Compose the grievance a member would file on EPFiGMS.
 *
 * The failure mode this addresses is real: grievances written as complaints get
 * closed with a template reply. Grievances that quote the rejection text and ask
 * one specific answerable question get answered. Most members cannot write the
 * second kind on demand, in English, about a system they do not understand.
 */

export interface ComposedGrievance {
  subject: string;
  body: string;
  provenance: Provenance;
}

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["subject", "body"],
  properties: {
    subject: {
      type: "string",
      description: "Under 90 characters. States the claim type and the problem.",
    },
    body: {
      type: "string",
      description:
        "120 to 200 words. Formal, calm, first person. Quotes the rejection wording exactly once. Ends with one specific question EPFO can answer.",
    },
  },
} as const;

const SYSTEM = [
  "You draft grievances for Indian EPFO members to file on the EPFiGMS portal.",
  "",
  "A grievance that gets answered:",
  "- states the UAN, claim reference and date of filing as given to you",
  "- quotes the portal's rejection wording exactly once, in quotation marks",
  "- describes what the member has already done",
  "- ends with ONE specific question an officer can answer in one line",
  "",
  "A grievance that gets closed with a template reply is angry, vague, or asks several things at once. Do not write that one.",
  "",
  "Never invent facts, dates, amounts or documents that were not given to you.",
  "Never promise a timeline. Never threaten legal action. Plain English, no jargon.",
].join("\n");

function template(
  member: Member,
  claim: Claim,
  decoded?: Decoded,
): { subject: string; body: string } {
  const remark = decoded?.portalRemark ?? "no reason was shown on the portal";
  return {
    subject: `${claim.typeLabel} rejected — clarification requested (${claimRef(claim.id)})`,
    body: [
      `My claim ${claimRef(claim.id)} under UAN ${member.uan} was filed on ${formatDate(claim.filedOn)} and has been rejected.`,
      "",
      `The portal shows: "${remark}"`,
      "",
      "I have checked my records on the member portal and I am not able to tell from this wording what exactly I must correct, or whether the correction needs my employer's signature.",
      "",
      "Could you please state which specific field must be corrected, and whether a Joint Declaration from my employer is required for it?",
      "",
      member.name,
    ].join("\n"),
  };
}

export async function composeGrievance(
  member: Member,
  claim: Claim,
  decoded?: Decoded,
): Promise<ComposedGrievance> {
  if (!hasModelAccess()) {
    return {
      ...template(member, claim, decoded),
      provenance: {
        source: "rules",
        reason: "No model configured for this deployment. This is the standard template.",
      },
    };
  }

  const facts = [
    `UAN: ${member.uan}`,
    `Member name: ${member.name}`,
    `Claim reference: ${claimRef(claim.id)}`,
    `Claim type: ${claim.typeLabel}`,
    `Filed on: ${formatDate(claim.filedOn)}`,
    decoded ? `Our reading of the rejection: ${decoded.plainTitle}` : "",
    decoded?.recognised === false
      ? "We could not decode the rejection code, so do not state a cause as fact."
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const result = await callModel<{ subject: string; body: string }>({
      system: SYSTEM,
      user: [
        facts,
        "",
        asUntrustedData(
          "portal_rejection_text",
          decoded?.portalRemark ?? "No reason shown on the portal.",
        ),
      ].join("\n"),
      schema: SCHEMA as unknown as Record<string, unknown>,
      schemaName: "grievance_draft",
    });

    return { ...result, provenance: { source: "model", model: MODEL } };
  } catch (error) {
    return {
      ...template(member, claim, decoded),
      provenance: {
        source: "rules",
        reason:
          error instanceof ModelUnavailable
            ? "The model could not be reached, so this is the standard template."
            : "Something went wrong reaching the model, so this is the standard template.",
      },
    };
  }
}
