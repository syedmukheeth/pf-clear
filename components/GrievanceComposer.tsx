"use client";

import { useState } from "react";
import Provenance, { type ProvenanceValue } from "./Provenance";

interface Composed {
  subject: string;
  body: string;
  provenance: ProvenanceValue;
}

/**
 * Drafts the grievance the member would file on EPFiGMS.
 *
 * The gap this closes is not knowledge, it is writing. Members know they have
 * been wronged; what gets a grievance answered is quoting the rejection text and
 * asking one specific question, in English, about a system nobody explained to
 * them.
 */
export default function GrievanceComposer({ claimId }: { claimId: string }) {
  const [draft, setDraft] = useState<Composed>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [copied, setCopied] = useState(false);

  async function compose() {
    setLoading(true);
    setError(undefined);
    try {
      const response = await fetch("/api/grievance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claimId }),
      });
      const body = await response.json();
      if (!response.ok) {
        setError(body.error ?? "Could not draft the grievance.");
        return;
      }
      setDraft(body);
    } catch {
      setError("Could not reach the drafter. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    if (!draft) return;
    try {
      await navigator.clipboard.writeText(`${draft.subject}\n\n${draft.body}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="rounded-lg border border-line bg-surface p-4 shadow-card">
      <h3 className="font-semibold text-ink">Write the grievance for me</h3>
      <p className="prose-measure mt-1 text-sm text-ink-muted">
        Grievances written as complaints get a template reply. Ones that quote the
        rejection wording and ask a single specific question get answered. This drafts
        the second kind, using only what is on your claim.
      </p>

      {!draft && (
        <button
          type="button"
          onClick={compose}
          disabled={loading}
          className="mt-3 inline-flex min-h-11 items-center rounded-md bg-accent px-4 py-2.5 font-medium text-accent-ink hover:bg-accent-hover disabled:opacity-60"
        >
          {loading ? "Drafting…" : "Draft my grievance"}
        </button>
      )}

      {error && (
        <p
          role="alert"
          className="mt-3 rounded-md border border-rejected/30 bg-rejected-soft px-3 py-2 text-sm text-rejected"
        >
          {error}
        </p>
      )}

      {draft && (
        <div className="mt-3">
          <p className="text-xs font-semibold tracking-wide text-ink-faint uppercase">
            Subject
          </p>
          <p className="mt-1 font-medium text-ink">{draft.subject}</p>

          <p className="mt-3 text-xs font-semibold tracking-wide text-ink-faint uppercase">
            Grievance
          </p>
          <p className="prose-measure mt-1 whitespace-pre-line text-ink">{draft.body}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={copy}
              className="inline-flex min-h-11 items-center rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-accent-ink hover:bg-accent-hover"
            >
              {copied ? "Copied — paste it into EPFiGMS" : "Copy this grievance"}
            </button>
            <button
              type="button"
              onClick={compose}
              disabled={loading}
              className="inline-flex min-h-11 items-center rounded-md border border-line-strong px-4 py-2.5 text-sm font-medium text-ink hover:border-accent disabled:opacity-60"
            >
              {loading ? "Drafting…" : "Draft it again"}
            </button>
          </div>

          <p className="prose-measure mt-3 text-sm text-ink-muted">
            Read it before you send it. It is your grievance, in your name.
          </p>

          <Provenance value={draft.provenance} />
        </div>
      )}
    </section>
  );
}
