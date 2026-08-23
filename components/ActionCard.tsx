import Link from "next/link";
import type { Fix } from "@/lib/types";

/**
 * The signature component, and the whole thesis in one box.
 *
 * Five slots, always in this order, none omissible: what you need, what it
 * costs, how long it takes, your one next step, and what usually goes wrong.
 * If a screen cannot fill all five, the content is not ready to ship.
 */
export default function ActionCard({
  fix,
  cta,
  tone = "accent",
}: {
  fix: Fix;
  /** An interactive primary action, when the next step is something to click. */
  cta?: React.ReactNode;
  tone?: "accent" | "quiet";
}) {
  return (
    <section
      className={`rounded-lg border bg-surface shadow-card ${
        tone === "accent" ? "border-accent/35" : "border-line"
      }`}
    >
      <header className="border-b border-line px-4 py-3">
        <h3 className="text-lg font-semibold text-ink">{fix.title}</h3>
      </header>

      <dl className="divide-y divide-line">
        <div className="px-4 py-3">
          <dt className="text-xs font-semibold tracking-wide text-ink-faint uppercase">
            What you need
          </dt>
          <dd className="mt-1.5">
            <ul className="space-y-1 text-ink">
              {fix.whatYouNeed.map((item) => (
                <li key={item} className="flex gap-2 prose-measure">
                  <span aria-hidden="true" className="text-ink-faint">
                    •
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </dd>
        </div>

        <div className="grid grid-cols-2 divide-x divide-line">
          <div className="px-4 py-3">
            <dt className="text-xs font-semibold tracking-wide text-ink-faint uppercase">
              What it costs
            </dt>
            <dd className="mt-1.5 font-medium text-ink">{fix.whatItCosts}</dd>
          </div>
          <div className="px-4 py-3">
            <dt className="text-xs font-semibold tracking-wide text-ink-faint uppercase">
              How long it takes
            </dt>
            <dd className="mt-1.5 font-medium text-ink">{fix.howLong}</dd>
          </div>
        </div>

        <div className="px-4 py-3">
          <dt className="text-xs font-semibold tracking-wide text-ink-faint uppercase">
            Your next step
          </dt>
          <dd className="mt-1.5 prose-measure text-ink">{fix.nextStep}</dd>
          {(cta ?? fix.nextStepHref) && (
            <dd className="mt-3">
              {cta ?? (
                <Link
                  href={fix.nextStepHref!}
                  className="inline-flex min-h-11 items-center rounded-md bg-accent px-4 py-2.5 font-medium text-accent-ink hover:bg-accent-hover"
                >
                  {fix.title}
                </Link>
              )}
            </dd>
          )}
        </div>
      </dl>

      <footer className="rounded-b-lg border-t border-line bg-sunk px-4 py-3">
        <p className="prose-measure text-sm text-ink-muted">
          <span className="font-semibold text-ink">Usually goes wrong: </span>
          {fix.whatGoesWrong}
        </p>
      </footer>
    </section>
  );
}
