"use client";

import Link from "next/link";
import { useState } from "react";
import type { Claim, ClaimEvent, StageStatus } from "@/lib/types";
import { claimRef, formatDayMonth } from "@/lib/format";

const NODE: Record<StageStatus, { glyph: string; color: string; word: string }> = {
  DONE: { glyph: "●", color: "text-ok", word: "Done" },
  ACTIVE: { glyph: "◉", color: "text-wait", word: "In progress" },
  STALLED: { glyph: "◉", color: "text-stalled", word: "Taking too long" },
  REJECTED: { glyph: "✕", color: "text-rejected", word: "Rejected here" },
  NOT_STARTED: { glyph: "○", color: "text-ink-faint", word: "Not started" },
};

function nudgeMessage(claim: Claim, event: ClaimEvent, memberName: string) {
  return [
    `Subject: PF claim pending your approval — ${memberName}`,
    "",
    `Hello,`,
    "",
    `My EPF claim (${claim.typeLabel}, reference ${claimRef(claim.id)}) has been waiting for employer approval for ${event.actualDurationDays} days. Employers normally complete this stage in ${event.normalDurationDays[0]} to ${event.normalDurationDays[1]} days.`,
    "",
    `The pending action is a digital signature from the authorised signatory on the EPFO employer portal. Nothing else is needed from me, and no document is missing.`,
    "",
    `Could you confirm when this will be signed?`,
    "",
    `Thank you,`,
    memberName,
  ].join("\n");
}

function CopyNudge({
  claim,
  event,
  memberName,
}: {
  claim: Claim;
  event: ClaimEvent;
  memberName: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(nudgeMessage(claim, event, memberName));
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={copy}
        className="inline-flex min-h-11 items-center rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-accent-ink hover:bg-accent-hover"
      >
        {copied ? "Copied — paste it to your HR contact" : "Copy the exact request"}
      </button>
      <p aria-live="polite" className="sr-only">
        {copied ? "Message copied to clipboard" : ""}
      </p>
    </div>
  );
}

export default function StatusTimeline({
  claim,
  events,
  memberName,
}: {
  claim: Claim;
  events: ClaimEvent[];
  memberName: string;
}) {
  return (
    <ol className="relative">
      {events.map((event, index) => {
        const node = NODE[event.status];
        const isLast = index === events.length - 1;
        const overdue = event.status === "STALLED";
        const daysToEscalation =
          overdue && event.actualDurationDays !== undefined
            ? 30 - event.actualDurationDays
            : undefined;

        return (
          <li key={event.stage} className="relative flex gap-3 pb-6">
            {!isLast && (
              <span
                aria-hidden="true"
                className="absolute top-6 bottom-0 left-[11px] w-px bg-line"
              />
            )}

            <span
              aria-hidden="true"
              className={`relative z-10 w-6 shrink-0 text-center text-xl leading-6 ${node.color}`}
            >
              {node.glyph}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <h3 className="font-semibold text-ink">
                  {event.stageLabel}
                  <span className="sr-only"> — {node.word}</span>
                </h3>
                {event.enteredOn && (
                  <span className="num text-sm text-ink-muted">
                    {formatDayMonth(event.enteredOn)}
                  </span>
                )}
              </div>

              {event.status === "NOT_STARTED" ? (
                <p className="mt-1 text-sm text-ink-faint">
                  Not started. Usually takes {event.normalDurationDays[0]} to{" "}
                  {event.normalDurationDays[1]} days once it begins.
                </p>
              ) : (
                <div className="mt-1 space-y-1 text-sm">
                  {event.heldBy && (
                    <p className="text-ink-muted">
                      <span className="text-ink-faint">Held by: </span>
                      <span className="text-ink">{event.heldBy}</span>
                    </p>
                  )}
                  {event.waitingOn && (
                    <p className="text-ink-muted">
                      <span className="text-ink-faint">Waiting on: </span>
                      <span className="text-ink">{event.waitingOn}</span>
                    </p>
                  )}
                  {event.nothingToDo && (
                    <p className="text-ink-muted">{event.nothingToDo}</p>
                  )}
                  {!event.youCanDo && !event.nothingToDo && event.status === "ACTIVE" && (
                    <p className="text-ink-muted">
                      Nothing for you to do here. This one is genuinely just waiting.
                    </p>
                  )}
                </div>
              )}

              {overdue && (
                <p className="mt-2 rounded-sm border border-stalled/30 bg-stalled-soft px-3 py-2 text-sm font-semibold text-stalled">
                  <span className="num">{event.actualDurationDays} days</span> at this
                  stage — usually{" "}
                  <span className="num">
                    {event.normalDurationDays[0]}–{event.normalDurationDays[1]}
                  </span>
                  .
                </p>
              )}

              {event.status === "ACTIVE" &&
                event.actualDurationDays !== undefined &&
                event.actualDurationDays > event.normalDurationDays[1] && (
                  <p className="mt-2 rounded-sm border border-wait/30 bg-wait-soft px-3 py-2 text-sm text-wait">
                    <span className="num">{event.actualDurationDays} days</span> at this
                    stage — usually{" "}
                    <span className="num">
                      {event.normalDurationDays[0]}–{event.normalDurationDays[1]}
                    </span>
                    .
                  </p>
                )}

              {event.youCanDo?.action === "COPY_NUDGE" && (
                <>
                  <p className="mt-2 text-sm text-ink">
                    <span className="text-ink-faint">You can: </span>
                    {event.youCanDo.label}
                  </p>
                  <CopyNudge claim={claim} event={event} memberName={memberName} />
                </>
              )}

              {event.youCanDo?.action === "OPEN_VALIDATOR" && (
                <Link
                  href="/validator"
                  className="mt-2 inline-flex min-h-11 items-center rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-accent-ink hover:bg-accent-hover"
                >
                  {event.youCanDo.label}
                </Link>
              )}

              {event.escalation && (
                <p className="mt-2 prose-measure text-sm text-ink-muted">
                  {event.escalation}
                  {daysToEscalation !== undefined && daysToEscalation > 0 && (
                    <>
                      {" "}
                      <span className="num font-semibold text-ink">
                        {daysToEscalation} days
                      </span>{" "}
                      to go.
                    </>
                  )}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
