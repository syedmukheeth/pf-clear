"use client";

import Link from "next/link";
import { useState } from "react";
import ActionCard from "@/components/ActionCard";
import AppHeader from "@/components/AppHeader";
import HindiToggle from "@/components/HindiToggle";
import Provenance, { type ProvenanceValue } from "@/components/Provenance";
import { ErrorBlock } from "@/components/PageState";
import type { Decoded, Fix } from "@/lib/types";

interface DecodeResponse {
  decoded: Decoded;
  provenance: ProvenanceValue;
  confidence: number;
  fix?: Fix;
}

const EXAMPLES = [
  "Claim rejected: DOB not matching with UIDAI records. Ref: R-217",
  "Rejected - Date of exit not updated by employer, member still shown as active",
  "Claim Rejected: Member not eligible as per para 68J",
];

export default function DecodePage() {
  const [remark, setRemark] = useState("");
  const [data, setData] = useState<DecodeResponse>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  async function decode(text: string) {
    setLoading(true);
    setError(undefined);
    setData(undefined);

    try {
      const response = await fetch("/api/decode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ remark: text }),
      });
      const body = await response.json();
      if (!response.ok) {
        setError(body.error ?? "Could not read that.");
        return;
      }
      setData(body);
    } catch {
      setError("Could not reach the decoder. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <AppHeader publicPage />

      <main className="mx-auto max-w-3xl px-4 py-6">
        <h1 className="text-2xl font-bold tracking-tight text-ink">
          Paste your own rejection
        </h1>
        <p className="prose-measure mt-2 text-ink-muted">
          Copy the rejection line from your EPFO claim status and paste it here. This
          works on wording from any claim, not just the demo accounts — including
          rejections written in ways we have never seen.
        </p>

        <form
          className="mt-5"
          onSubmit={(event) => {
            event.preventDefault();
            decode(remark);
          }}
        >
          <label htmlFor="remark" className="block text-sm font-medium text-ink">
            The rejection wording from the portal
          </label>
          <textarea
            id="remark"
            rows={3}
            value={remark}
            maxLength={600}
            onChange={(event) => setRemark(event.target.value)}
            placeholder="Claim rejected: DOB not matching with UIDAI records…"
            className="mt-1 w-full rounded-md border border-line-strong bg-surface px-3 py-2 text-ink"
          />
          <button
            type="submit"
            disabled={loading || remark.trim().length < 8}
            className="mt-3 inline-flex min-h-11 items-center rounded-md bg-accent px-4 py-2.5 font-medium text-accent-ink hover:bg-accent-hover disabled:opacity-60"
          >
            {loading ? "Reading it…" : "Explain this to me"}
          </button>
        </form>

        <div className="mt-4">
          <p className="text-sm text-ink-faint">Or try one of these:</p>
          <ul className="mt-2 space-y-2">
            {EXAMPLES.map((example) => (
              <li key={example}>
                <button
                  type="button"
                  onClick={() => {
                    setRemark(example);
                    decode(example);
                  }}
                  disabled={loading}
                  className="num w-full rounded-md border border-line bg-sunk px-3 py-2 text-left text-sm text-ink-muted hover:border-accent disabled:opacity-60"
                >
                  {example}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {error && (
          <div className="mt-5">
            <ErrorBlock title="Could not read that" detail={error} />
          </div>
        )}

        {data && (
          <section className="mt-8">
            <div
              className={`rounded-lg border bg-surface shadow-card ${
                data.decoded.recognised ? "border-accent/35" : "border-stalled/30"
              }`}
            >
              <header className="border-b border-line px-4 py-3">
                <h2 className="text-lg font-semibold text-ink">
                  {data.decoded.plainTitle}
                </h2>
              </header>

              <div className="px-4 py-4">
                <HindiToggle
                  segments={[data.decoded.plainTitle, data.decoded.why]}
                  render={([title, why]) => (
                    <div className="space-y-2">
                      <p className="prose-measure font-medium text-ink">{title}</p>
                      <p className="prose-measure text-ink">{why}</p>
                    </div>
                  )}
                />

                {data.decoded.grievance && (
                  <div className="mt-4 rounded-md border border-line bg-sunk p-3">
                    <h3 className="font-semibold text-ink">
                      {data.decoded.grievance.title}
                    </h3>
                    <p className="prose-measure mt-1 text-sm text-ink-muted">
                      {data.decoded.grievance.body}
                    </p>
                  </div>
                )}

                <Provenance value={data.provenance} />
              </div>
            </div>

            {data.fix && (
              <div className="mt-4">
                <ActionCard fix={data.fix} />
              </div>
            )}

            <section className="mt-6 rounded-lg border border-line bg-surface p-4">
              <h2 className="font-semibold text-ink">
                Would this have been caught before you filed?
              </h2>
              <p className="prose-measure mt-1 text-sm text-ink-muted">
                Most of these are visible in your own records weeks before a claim is
                rejected. Sign in as a demo member and run the check.
              </p>
              <Link
                href="/validator"
                className="mt-3 inline-flex min-h-11 items-center rounded-md bg-accent px-4 py-2.5 font-medium text-accent-ink hover:bg-accent-hover"
              >
                Check records
              </Link>
            </section>
          </section>
        )}
      </main>
    </>
  );
}
