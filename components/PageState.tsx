import Link from "next/link";

/** Loading is a real state here — every mock call takes 300 to 600ms on purpose. */
export function LoadingBlock({ label }: { label: string }) {
  return (
    <div className="space-y-3" aria-live="polite" aria-busy="true">
      <p className="text-sm text-ink-muted">{label}</p>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-20 animate-pulse rounded-lg border border-line bg-sunk"
        />
      ))}
    </div>
  );
}

export function ErrorBlock({
  title,
  detail,
  signedOut,
}: {
  title: string;
  detail?: string;
  signedOut?: boolean;
}) {
  return (
    <div className="rounded-lg border border-rejected/30 bg-rejected-soft p-4">
      <h2 className="font-semibold text-rejected">{title}</h2>
      {detail && <p className="mt-1 prose-measure text-sm text-ink">{detail}</p>}
      {signedOut && (
        <Link
          href="/"
          className="mt-3 inline-flex min-h-11 items-center rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-hover"
        >
          Go to sign in
        </Link>
      )}
    </div>
  );
}
