import type { ClaimStatus } from "@/lib/types";

const STATUS: Record<
  ClaimStatus,
  { glyph: string; label: string; className: string }
> = {
  IN_PROGRESS: {
    glyph: "◉",
    label: "Moving normally",
    className: "bg-wait-soft text-wait border-wait/30",
  },
  STALLED: {
    glyph: "◉",
    label: "Stuck",
    className: "bg-stalled-soft text-stalled border-stalled/30",
  },
  REJECTED: {
    glyph: "✕",
    label: "Rejected",
    className: "bg-rejected-soft text-rejected border-rejected/30",
  },
  APPROVED: {
    glyph: "●",
    label: "Approved",
    className: "bg-ok-soft text-ok border-ok/30",
  },
  CREDITED: {
    glyph: "●",
    label: "Credited",
    className: "bg-ok-soft text-ok border-ok/30",
  },
};

/** Colour, glyph and word together. Never colour alone. */
export default function StatusPill({ status }: { status: ClaimStatus }) {
  const style = STATUS[status];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-sm border px-2 py-0.5 text-xs font-semibold tracking-wide uppercase ${style.className}`}
    >
      <span aria-hidden="true">{style.glyph}</span>
      {style.label}
    </span>
  );
}
