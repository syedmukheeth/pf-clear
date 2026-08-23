import {
  MODEL,
  ModelUnavailable,
  asUntrustedData,
  callModel,
  hasModelAccess,
  type Provenance,
} from "./client";

/**
 * Read this screen in Hindi.
 *
 * Not a site-wide localisation — the explanation of *why your money stopped* is
 * the part that has to land, and it is the part currently written only in
 * English on a portal used across the country. Official form names stay in
 * English because that is what the member has to search for and quote.
 */

export interface Translation {
  segments: string[];
  provenance: Provenance;
}

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["segments"],
  properties: {
    segments: {
      type: "array",
      description: "The translated segments, in the same order as the input.",
      items: { type: "string" },
    },
  },
} as const;

const SYSTEM = [
  "You translate plain-English explanations of Indian EPFO (provident fund) processes into Hindi.",
  "",
  "- Use everyday spoken Hindi in Devanagari, the way a bank clerk would explain something to a customer. Not literary Hindi.",
  "- Keep official names, form numbers and portal labels in English: Form 19, Form 10C, Form 15G, UAN, Aadhaar, PAN, IFSC, EPFO, EPFiGMS, Joint Declaration.",
  "- Keep numbers, amounts and dates exactly as given.",
  "- Translate meaning, not word for word. Never add advice that was not in the original.",
  "- Return exactly as many segments as you were given, in the same order.",
].join("\n");

export async function translateToHindi(segments: string[]): Promise<Translation> {
  const usable = segments.filter((s) => s.trim().length > 0);

  if (!hasModelAccess() || usable.length === 0) {
    return {
      segments,
      provenance: {
        source: "rules",
        reason:
          "Hindi needs a model, and none is configured for this deployment. Showing English.",
      },
    };
  }

  try {
    const result = await callModel<{ segments: string[] }>({
      system: SYSTEM,
      user: asUntrustedData(
        "segments_to_translate",
        segments.map((s, i) => `${i + 1}. ${s}`).join("\n\n"),
      ),
      schema: SCHEMA as unknown as Record<string, unknown>,
      schemaName: "hindi_translation",
      maxTokens: 1200,
    });

    // Length mismatch means the mapping is unreliable — show English rather than
    // pair the wrong Hindi with the wrong heading.
    if (result.segments.length !== segments.length) {
      return {
        segments,
        provenance: {
          source: "rules",
          reason: "The translation did not line up with the screen, so English is shown.",
        },
      };
    }

    return { segments: result.segments, provenance: { source: "model", model: MODEL } };
  } catch (error) {
    return {
      segments,
      provenance: {
        source: "rules",
        reason:
          error instanceof ModelUnavailable
            ? "The model could not be reached, so English is shown."
            : "Something went wrong reaching the model, so English is shown.",
      },
    };
  }
}
