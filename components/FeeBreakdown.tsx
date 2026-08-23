import { inr } from "@/lib/format";

export interface BreakdownRow {
  label: string;
  amount: number;
  /** Deductions render with a leading minus, in the rejected colour. */
  deduction?: boolean;
  note?: string;
}

/**
 * One number, honestly derived — not a wall of contribution rows.
 * Right-aligned numeric column, a rule above the total, deductions marked.
 */
export default function FeeBreakdown({
  rows,
  subtotal,
  deductions,
  total,
  totalLabel,
  footnote,
  savings,
}: {
  rows: BreakdownRow[];
  subtotal?: { label: string; amount: number };
  /** Rows that come off the subtotal — shown after it, before the total. */
  deductions?: BreakdownRow[];
  total: { label: string; amount: number };
  totalLabel?: string;
  footnote?: string;
  savings?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-line bg-surface p-4 shadow-card">
      <dl className="space-y-2">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-ink-muted">{row.label}</dt>
              <dd
                className={`num shrink-0 ${row.deduction ? "text-rejected" : "text-ink"}`}
              >
                {row.deduction ? `− ${inr(row.amount)}` : inr(row.amount)}
              </dd>
            </div>
            {row.note && (
              <p className="prose-measure mt-0.5 text-sm text-ink-faint">{row.note}</p>
            )}
          </div>
        ))}

        {subtotal && (
          <div className="flex items-baseline justify-between gap-4 border-t border-line-strong pt-2">
            <dt className="font-medium text-ink">{subtotal.label}</dt>
            <dd className="num shrink-0 font-medium text-ink">{inr(subtotal.amount)}</dd>
          </div>
        )}

        {deductions?.map((row) => (
          <div key={row.label}>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-ink-muted">{row.label}</dt>
              <dd className="num shrink-0 text-rejected">− {inr(row.amount)}</dd>
            </div>
            {row.note && (
              <p className="prose-measure mt-0.5 text-sm text-ink-faint">{row.note}</p>
            )}
          </div>
        ))}

        <div className="flex items-baseline justify-between gap-4 border-t-2 border-line-strong pt-3">
          <dt className="text-lg font-semibold text-ink">{total.label}</dt>
          <dd className="num shrink-0 text-2xl font-bold text-ink">
            {inr(total.amount)}
          </dd>
        </div>
      </dl>

      {totalLabel && (
        <p className="mt-1 text-right text-sm text-ink-muted">{totalLabel}</p>
      )}

      {footnote && (
        <p className="prose-measure mt-3 border-t border-line pt-3 text-sm text-ink-muted">
          {footnote}
        </p>
      )}

      {savings && <div className="mt-3">{savings}</div>}
    </div>
  );
}
