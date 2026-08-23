/**
 * Two records that disagree, shown side by side.
 *
 * Deliberately not a red/green code diff — this is a record disagreement, not a
 * merge conflict. Stacks at 375px because that is where most members are.
 */
function differingIndexes(a: string, b: string): Set<number> {
  const marks = new Set<number>();
  const length = Math.max(a.length, b.length);
  for (let i = 0; i < length; i++) {
    if (a[i] !== b[i]) marks.add(i);
  }
  return marks;
}

function Value({
  value,
  marks,
  delayMs,
}: {
  value: string;
  marks: Set<number>;
  delayMs: number;
}) {
  return (
    <span
      className="num settle block text-lg tracking-wide"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      {[...value].map((char, i) => (
        <span
          key={`${char}-${i}`}
          className={
            marks.has(i)
              ? "rounded-xs bg-rejected-soft font-bold text-rejected underline decoration-2 underline-offset-4"
              : undefined
          }
        >
          {char}
        </span>
      ))}
    </span>
  );
}

export default function MismatchDiff({
  label,
  left,
  right,
  note,
}: {
  label: string;
  left: { source: string; value: string };
  right: { source: string; value: string };
  note?: string;
}) {
  const marks = differingIndexes(left.value, right.value);

  return (
    <div className="rounded-md border border-line bg-sunk p-4">
      <p className="text-xs font-semibold tracking-wide text-ink-faint uppercase">
        {label}
      </p>

      <dl className="mt-3 space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <dt className="text-sm text-ink-muted">{left.source}</dt>
          <dd>
            <Value value={left.value} marks={marks} delayMs={0} />
          </dd>
        </div>
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-line pt-3">
          <dt className="text-sm text-ink-muted">{right.source}</dt>
          <dd>
            <Value value={right.value} marks={marks} delayMs={120} />
          </dd>
        </div>
      </dl>

      {note && (
        <p className="mt-3 text-sm font-semibold text-rejected">{note}</p>
      )}
    </div>
  );
}
