"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ActionCard from "@/components/ActionCard";
import AppHeader from "@/components/AppHeader";
import MismatchDiff from "@/components/MismatchDiff";
import SeverityBadge from "@/components/SeverityBadge";
import { ErrorBlock, LoadingBlock } from "@/components/PageState";
import type { Fix, KycCheck, Severity } from "@/lib/types";

interface KycResponse {
  member: { name: string; uan: string };
  checks: KycCheck[];
  verdict: {
    headline: string;
    blockers: number;
    warnings: number;
    clear: number;
    severity: Severity;
  };
  fixes: { checkId: string; fix: Fix }[];
}

const VERDICT_STYLE: Record<Severity, string> = {
  blocker: "border-rejected/30 bg-rejected-soft",
  warning: "border-stalled/30 bg-stalled-soft",
  clear: "border-ok/30 bg-ok-soft",
};

export default function ValidatorPage() {
  const [data, setData] = useState<KycResponse>();
  const [error, setError] = useState<{ message: string; signedOut: boolean }>();

  useEffect(() => {
    let cancelled = false;

    fetch("/api/kyc")
      .then(async (response) => {
        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw Object.assign(new Error(body.error ?? "Could not run the check."), {
            signedOut: response.status === 401,
          });
        }
        return response.json();
      })
      .then((body: KycResponse) => {
        if (!cancelled) setData(body);
      })
      .catch((caught: Error & { signedOut?: boolean }) => {
        if (!cancelled)
          setError({ message: caught.message, signedOut: !!caught.signedOut });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <AppHeader memberName={data?.member.name} />

      <main className="mx-auto max-w-3xl px-4 py-6">
        <h1 className="text-2xl font-bold tracking-tight text-ink">
          Check my records before I file
        </h1>
        <p className="prose-measure mt-2 text-ink-muted">
          The same comparison EPFO runs when it decides your claim — your EPFO record
          against Aadhaar, PAN and your bank. Run it now instead of finding out three
          weeks later.
        </p>

        {error && (
          <div className="mt-5">
            <ErrorBlock
              title={error.signedOut ? "You are signed out" : "Could not run the check"}
              detail={error.message}
              signedOut={error.signedOut}
            />
          </div>
        )}

        {!data && !error && (
          <div className="mt-5">
            <LoadingBlock label="Comparing your records…" />
          </div>
        )}

        {data && (
          <>
            <section
              className={`mt-5 rounded-lg border p-4 ${VERDICT_STYLE[data.verdict.severity]}`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <SeverityBadge severity={data.verdict.severity} />
                <span className="num text-sm text-ink-muted">
                  {data.verdict.blockers} {data.verdict.blockers === 1 ? "blocker" : "blockers"} ·{" "}
                  {data.verdict.warnings} {data.verdict.warnings === 1 ? "warning" : "warnings"} ·{" "}
                  {data.verdict.clear} clear
                </span>
              </div>
              <p className="prose-measure mt-2 text-lg font-semibold text-ink">
                {data.verdict.headline}
              </p>
            </section>

            <section className="mt-6">
              <h2 className="text-lg font-semibold text-ink">What we compared</h2>
              <ul className="mt-3 space-y-3">
                {data.checks.map((check) => (
                  <li
                    key={check.id}
                    className="rounded-lg border border-line bg-surface p-4 shadow-card"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-ink">{check.label}</h3>
                        <p className="text-sm text-ink-faint">{check.compares}</p>
                      </div>
                      <SeverityBadge
                        severity={check.status === "clear" ? "clear" : check.severity}
                      />
                    </div>

                    {/* Only a genuine record disagreement gets the diff. A value
                        measured against a rule is not a disagreement. */}
                    {check.left && check.right && check.kind === "records" && (
                      <div className="mt-3">
                        <MismatchDiff
                          label={check.label}
                          left={check.left}
                          right={check.right}
                        />
                      </div>
                    )}

                    {check.left && check.right && check.kind !== "records" && (
                      <dl className="mt-3 flex flex-wrap gap-x-8 gap-y-1 rounded-md border border-line bg-sunk px-3 py-2 text-sm">
                        <div>
                          <dt className="text-ink-faint">{check.left.source}</dt>
                          <dd className="num font-semibold text-ink">
                            {check.left.value}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-ink-faint">{check.right.source}</dt>
                          <dd className="num font-semibold text-ink">
                            {check.right.value}
                          </dd>
                        </div>
                      </dl>
                    )}

                    {check.status === "missing" && (
                      <p className="mt-2 prose-measure text-sm text-ink">
                        {check.severity === "blocker"
                          ? "This is not on your record at all, and a claim cannot be settled without it."
                          : "Not on your record. This will not stop the claim, but it changes what you receive."}
                      </p>
                    )}

                    {check.clearNote && (
                      <p className="mt-2 text-sm text-ink-muted">{check.clearNote}</p>
                    )}

                    {check.costsYou && (
                      <p className="mt-2 prose-measure text-sm font-medium text-stalled">
                        {check.costsYou}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </section>

            {data.fixes.length > 0 && (
              <section className="mt-8">
                <h2 className="text-lg font-semibold text-ink">
                  Fix these, in this order
                </h2>
                <p className="prose-measure mt-1 mb-4 text-sm text-ink-muted">
                  Blockers first — those stop the money. Warnings cost you time or tax,
                  not the claim.
                </p>
                <div className="space-y-4">
                  {data.fixes.map(({ checkId, fix }) => (
                    <ActionCard key={checkId} fix={fix} />
                  ))}
                </div>
              </section>
            )}

            <section className="mt-8 rounded-lg border border-line bg-surface p-4">
              <h2 className="font-semibold text-ink">
                {data.verdict.blockers > 0
                  ? "When these are fixed"
                  : "Nothing is stopping you"}
              </h2>
              <p className="prose-measure mt-1 text-sm text-ink-muted">
                {data.verdict.blockers > 0
                  ? "Refile the claim after the corrections show up on your record. Filing before that gets you the same rejection again."
                  : "You can file. Check what you will actually receive first."}
              </p>
              <Link
                href="/calculator"
                className="mt-3 inline-flex min-h-11 items-center rounded-md bg-accent px-4 py-2.5 font-medium text-accent-ink hover:bg-accent-hover"
              >
                See what I will actually get
              </Link>
            </section>
          </>
        )}
      </main>
    </>
  );
}
