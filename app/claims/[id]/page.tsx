"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ActionCard from "@/components/ActionCard";
import AppHeader from "@/components/AppHeader";
import MismatchDiff from "@/components/MismatchDiff";
import StatusPill from "@/components/StatusPill";
import StatusTimeline from "@/components/StatusTimeline";
import { ErrorBlock, LoadingBlock } from "@/components/PageState";
import { claimRef, formatDate, inr } from "@/lib/format";
import type { Claim, ClaimEvent, Decoded, Fix } from "@/lib/types";

interface ClaimResponse {
  member: { name: string; uan: string };
  claim: Claim;
  events: ClaimEvent[];
  decoded?: Decoded;
  fix?: Fix;
}

export default function ClaimDetailPage() {
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<ClaimResponse>();
  const [error, setError] = useState<{ message: string; signedOut: boolean }>();

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/claims/${params.id}`)
      .then(async (response) => {
        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw Object.assign(new Error(body.error ?? "Could not load this claim."), {
            signedOut: response.status === 401,
          });
        }
        return response.json();
      })
      .then((body: ClaimResponse) => {
        if (!cancelled) setData(body);
      })
      .catch((caught: Error & { signedOut?: boolean }) => {
        if (!cancelled)
          setError({ message: caught.message, signedOut: !!caught.signedOut });
      });

    return () => {
      cancelled = true;
    };
  }, [params.id]);

  return (
    <>
      <AppHeader memberName={data?.member.name} />

      <main className="mx-auto max-w-3xl px-4 py-6">
        <Link href="/claims" className="text-sm font-medium text-accent hover:underline">
          ← All claims
        </Link>

        {error && (
          <div className="mt-4">
            <ErrorBlock
              title={error.signedOut ? "You are signed out" : "Claim not found"}
              detail={error.message}
              signedOut={error.signedOut}
            />
          </div>
        )}

        {!data && !error && (
          <div className="mt-4">
            <LoadingBlock label="Loading this claim…" />
          </div>
        )}

        {data && (
          <>
            <div className="mt-3 flex flex-wrap items-start justify-between gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-ink">
                {data.claim.typeLabel}
              </h1>
              <StatusPill status={data.claim.status} />
            </div>
            <p className="num mt-1 text-sm text-ink-muted">
              Filed {formatDate(data.claim.filedOn)} ·{" "}
              {inr(data.claim.amountCredited ?? data.claim.amountClaimed)}
              {data.claim.amountCredited ? " received" : " claimed"} · Reference{" "}
              {claimRef(data.claim.id)}
            </p>

            {/* The decoder sits above the timeline: the question a rejected
                member has is "why", not "where". */}
            {data.decoded && (
              <section className="mt-6 rounded-lg border border-rejected/30 bg-surface shadow-card">
                <header className="border-b border-line px-4 py-3">
                  <h2 className="text-lg font-semibold text-ink">
                    {data.decoded.plainTitle}
                  </h2>
                </header>

                <div className="space-y-4 px-4 py-4">
                  {data.decoded.mismatch && (
                    <MismatchDiff
                      label={data.decoded.mismatch.label}
                      left={data.decoded.mismatch.left}
                      right={data.decoded.mismatch.right}
                      note={data.decoded.mismatch.note}
                    />
                  )}

                  <p className="prose-measure text-ink">{data.decoded.why}</p>

                  {data.decoded.grievance && (
                    <div className="rounded-md border border-line bg-sunk p-3">
                      <h3 className="font-semibold text-ink">
                        {data.decoded.grievance.title}
                      </h3>
                      <p className="prose-measure mt-1 text-sm text-ink-muted">
                        {data.decoded.grievance.body}
                      </p>
                    </div>
                  )}

                  <details className="rounded-md border border-line bg-sunk p-3">
                    <summary className="cursor-pointer text-sm font-medium text-ink-muted">
                      What EPFO actually wrote
                    </summary>
                    <p className="num mt-2 text-sm text-ink">
                      {data.decoded.portalRemark}
                    </p>
                  </details>
                </div>
              </section>
            )}

            {data.fix && (
              <div className="mt-4">
                <ActionCard
                  fix={data.fix}
                  cta={
                    <Link
                      href="/validator"
                      className="inline-flex min-h-11 items-center rounded-md bg-accent px-4 py-2.5 font-medium text-white hover:bg-accent-hover"
                    >
                      Check every record before you refile
                    </Link>
                  }
                />
              </div>
            )}

            <section className="mt-8">
              <h2 className="text-lg font-semibold text-ink">Where it went</h2>
              <p className="prose-measure mt-1 mb-4 text-sm text-ink-muted">
                Every stage, who held it, and how long that stage normally takes.
              </p>
              <StatusTimeline
                claim={data.claim}
                events={data.events}
                memberName={data.member.name}
              />
            </section>
          </>
        )}
      </main>
    </>
  );
}
