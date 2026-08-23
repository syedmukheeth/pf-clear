import type { Severity } from "@/lib/types";

const STYLES: Record<Severity, { label: string; glyph: string; className: string }> = {
  blocker: {
    label: "Blocker",
    glyph: "✕",
    className: "bg-rejected-soft text-rejected border-rejected/30",
  },
  warning: {
    label: "Warning",
    glyph: "!",
    className: "bg-stalled-soft text-stalled border-stalled/30",
  },
  clear: {
    label: "Clear",
    glyph: "✓",
    className: "bg-ok-soft text-ok border-ok/30",
  },
};

/**
 * Status is never carried by colour alone — every badge has a glyph and a word,
 * for colourblind readers and for screenshots.
 */
export default function SeverityBadge({
  severity,
  label,
}: {
  severity: Severity;
  label?: string;
}) {
  const style = STYLES[severity];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-sm border px-2 py-0.5 text-xs font-semibold tracking-wide uppercase ${style.className}`}
    >
      <span aria-hidden="true">{style.glyph}</span>
      {label ?? style.label}
    </span>
  );
}
