"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AppHeader from "@/components/AppHeader";
import StatusPill from "@/components/StatusPill";
import { ErrorBlock, LoadingBlock } from "@/components/PageState";
import { formatDate, inr } from "@/lib/format";
import type { Claim } from "@/lib/types";

type ClaimRow = Claim & {
  currentStage: string;
  heldBy?: string;
  daysAtStage?: number;
  normalDurationDays?: [number, number];
};

interface ClaimsResponse {
  member: { name: string; uan: string; employer: { name: string } };
  claims: ClaimRow[];
}

export default function ClaimsPage() {
  const [data, setData] = useState<ClaimsResponse>();
  const [error, setError] = useState<{ message: string; signedOut: boolean }>();

  useEffect(() => {
    let cancelled = false;

    fetch("/api/claims")
      .then(async (response) => {
        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw Object.assign(new Error(body.error ?? "Could not load claims."), {
            signedOut: response.status === 401,
          });
        }
        return response.json();
      })
      .then((body: ClaimsResponse) => {
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

  const claims = data?.claims ?? [];
  const needsYou = claims.filter(
    (claim) => claim.status === "REJECTED" || claim.status === "STALLED",
  );
  const inFlight = claims.filter(
    (claim) => claim.status === "IN_PROGRESS" || claim.status === "APPROVED",
  );

  return (
    <>
      <AppHeader memberName={data?.member.name} />

      <main className="mx-auto max-w-3xl px-4 py-6">
        <h1 className="text-2xl font-bold tracking-tight text-ink">Your claims</h1>

        {error && (
          <div className="mt-4">
            <ErrorBlock
              title={error.signedOut ? "You are signed out" : "Something went wrong"}
              detail={error.message}
              signedOut={error.signedOut}
            />
          </div>
        )}

        {!data && !error && (
          <div className="mt-4">
            <LoadingBlock label="Loading your claims…" />
          </div>
        )}

        {data && (
          <>
            {data.claims.length > 0 && (
              <p className="mt-2 prose-measure text-ink-muted">
                {needsYou.length === 0
                  ? "Nothing here needs you. Every claim is moving or already settled."
                  : `${
                      needsYou.length === 1
                        ? "One claim needs"
                        : `${needsYou.length} claims need`
                    } something from you.${
                      inFlight.length > 0
                        ? " The rest are moving on their own."
                        : " The rest are settled."
                    }`}
              </p>
            )}

            {data.claims.length === 0 ? (
              <section className="mt-6 rounded-lg border border-dashed border-line-strong bg-surface p-4">
                <h2 className="font-semibold text-ink">You have no claims yet</h2>
                <p className="prose-measure mt-1 text-sm text-ink-muted">
                  When you file one, it appears here with the stage it is at, who is
                  holding it, and how long that stage usually takes — like this:
                </p>
                <div className="mt-3 rounded-md border border-line bg-sunk p-3 text-sm">
                  <p className="font-medium text-ink">Final PF settlement (Form 19)</p>
                  <p className="mt-1 text-ink-muted">
                    Employer approval · held by your employer · day 4 of the usual 3 to 7
                  </p>
                </div>
                <Link
                  href="/validator"
                  className="mt-4 inline-flex min-h-11 items-center rounded-md bg-accent px-4 py-2.5 font-medium text-accent-ink hover:bg-accent-hover"
                >
                  Check your records before you file
                </Link>
              </section>
            ) : (
              <ul className="mt-5 space-y-3">
                {data.claims.map((claim) => {
                  const overdue =
                    claim.daysAtStage !== undefined &&
                    claim.normalDurationDays !== undefined &&
                    claim.daysAtStage > claim.normalDurationDays[1];

                  return (
                    <li key={claim.id}>
                      <Link
                        href={`/claims/${claim.id}`}
                        className="block rounded-lg border border-line bg-surface p-4 shadow-card hover:border-accent"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <h2 className="font-semibold text-ink">{claim.typeLabel}</h2>
                          <StatusPill status={claim.status} />
                        </div>

                        <p className="num mt-1 text-sm text-ink-muted">
                          Filed {formatDate(claim.filedOn)} ·{" "}
                          {inr(claim.amountCredited ?? claim.amountClaimed)}
                          {claim.amountCredited ? " received" : " claimed"}
                        </p>

                        <p className="mt-3 text-sm text-ink">
                          {claim.status === "REJECTED"
                            ? "Rejected at EPFO review. Tap to see exactly why, in plain words."
                            : claim.status === "CREDITED"
                              ? `Settled. Money reached your bank${
                                  claim.settledOn ? ` on ${formatDate(claim.settledOn)}` : ""
                                }.`
                              : `${claim.currentStage}${
                                  claim.heldBy ? ` · held by ${claim.heldBy}` : ""
                                }`}
                        </p>

                        {overdue && claim.status !== "REJECTED" && (
                          <p className="mt-2 inline-block rounded-sm border border-stalled/30 bg-stalled-soft px-2 py-1 text-sm font-semibold text-stalled">
                            <span className="num">{claim.daysAtStage} days</span> here —
                            usually{" "}
                            <span className="num">
                              {claim.normalDurationDays![0]}–{claim.normalDurationDays![1]}
                            </span>
                          </p>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}

            <section className="mt-8 rounded-lg border border-line bg-surface p-4">
              <h2 className="font-semibold text-ink">Before you file anything else</h2>
              <p className="prose-measure mt-1 text-sm text-ink-muted">
                Most rejections are caused by records that disagree with each other. The
                check takes ten seconds and runs against your EPFO, Aadhaar, PAN and bank
                details.
              </p>
              <Link
                href="/validator"
                className="mt-3 inline-flex min-h-11 items-center rounded-md bg-accent px-4 py-2.5 font-medium text-accent-ink hover:bg-accent-hover"
              >
                Check my records
              </Link>
            </section>
          </>
        )}
      </main>
    </>
  );
}
