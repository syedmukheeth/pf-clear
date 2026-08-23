"use client";

import { useState } from "react";
import Provenance, { type ProvenanceValue } from "./Provenance";

/**
 * "Read this in Hindi" for the part that matters most: the explanation of why
 * the money stopped and what to do about it.
 *
 * Not site-wide localisation. The strings that must be translated are the ones a
 * model writes anyway; the official form names stay in English because that is
 * what the member has to type into the portal.
 */
export default function HindiToggle({
  segments,
  render,
}: {
  segments: string[];
  render: (segments: string[]) => React.ReactNode;
}) {
  const [hindi, setHindi] = useState<string[]>();
  const [provenance, setProvenance] = useState<ProvenanceValue>();
  const [loading, setLoading] = useState(false);
  const showing = hindi !== undefined;

  async function toggle() {
    if (showing) {
      setHindi(undefined);
      setProvenance(undefined);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ segments }),
      });
      const body = await response.json();
      setHindi(body.segments ?? segments);
      setProvenance(body.provenance);
    } catch {
      setHindi(segments);
      setProvenance({
        source: "rules",
        reason: "The translation could not be fetched, so English is shown.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {render(hindi ?? segments)}

      <button
        type="button"
        onClick={toggle}
        disabled={loading}
        lang={showing ? "en" : "hi"}
        className="mt-3 inline-flex min-h-11 items-center rounded-md border border-line-strong px-3 py-2 text-sm font-medium text-ink hover:border-accent disabled:opacity-60"
      >
        {loading
          ? "Translating…"
          : showing
            ? "Read this in English"
            : "यह हिंदी में पढ़ें"}
      </button>

      {provenance && <Provenance value={provenance} />}
    </div>
  );
}
