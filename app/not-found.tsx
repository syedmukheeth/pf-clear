import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-4 py-12">
      <p className="text-sm font-semibold tracking-wide text-accent uppercase">
        PF Clear
      </p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink">
        There is nothing at this address
      </h1>
      <p className="prose-measure mt-2 text-ink-muted">
        The page you asked for does not exist. Your claims are still where you left
        them.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/claims"
          className="inline-flex min-h-11 items-center rounded-md bg-accent px-4 py-2.5 font-medium text-accent-ink hover:bg-accent-hover"
        >
          Go to my claims
        </Link>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-md border border-line-strong px-4 py-2.5 font-medium text-ink hover:border-accent"
        >
          Sign in
        </Link>
      </div>
    </main>
  );
}
