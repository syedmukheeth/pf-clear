import type { Metadata } from "next";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import { hasModelAccess, MODEL } from "@/lib/ai/client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "How this works — PF Clear",
  description:
    "What is real, what is mocked, how this would connect to EPFO, and how it would work safely at national scale.",
};

function Row({
  what,
  status,
  detail,
}: {
  what: string;
  status: "real" | "mocked" | "would-need";
  detail: string;
}) {
  const style =
    status === "real"
      ? "bg-ok-soft text-ok border-ok/30"
      : status === "mocked"
        ? "bg-stalled-soft text-stalled border-stalled/30"
        : "bg-sunk text-ink-muted border-line";
  const label =
    status === "real" ? "Works today" : status === "mocked" ? "Mocked" : "Would need EPFO";

  return (
    <li className="border-t border-line py-3 first:border-t-0">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="font-medium text-ink">{what}</h3>
        <span
          className={`inline-flex shrink-0 items-center rounded-sm border px-2 py-0.5 text-xs font-semibold tracking-wide uppercase ${style}`}
        >
          {label}
        </span>
      </div>
      <p className="prose-measure mt-1 text-sm text-ink-muted">{detail}</p>
    </li>
  );
}

export default function HowItWorksPage() {
  const modelOn = hasModelAccess();

  return (
    <>
      <AppHeader publicPage />

      <main className="mx-auto max-w-3xl px-4 py-6">
        <h1 className="text-2xl font-bold tracking-tight text-ink">How this works</h1>
        <p className="prose-measure mt-2 text-ink-muted">
          What runs today, what is faked, what EPFO would have to provide, and how the
          idea would work safely for nine crore members rather than three demo accounts.
        </p>

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-ink">What is real and what is not</h2>
          <ul className="mt-3 rounded-lg border border-line bg-surface px-4 shadow-card">
            <Row
              what="Every screen and interaction"
              status="real"
              detail="The claim list, timeline, validator, calculator and decoder are working code, not a design. Navigation, states and errors all behave."
            />
            <Row
              what="The rejection decoder for free-text remarks"
              status="real"
              detail={
                modelOn
                  ? `Runs against ${MODEL}. Paste any wording and it maps to a known reason, or refuses and routes you to a grievance.`
                  : "Runs against an OpenAI model when one is configured. In this deployment no key is set, so it falls back to keyword matching and every screen says so."
              }
            />
            <Row
              what="TDS, Table D and pension arithmetic"
              status="real"
              detail="Computed from the scheme rules in code, not hard-coded numbers. Change the service length and the deduction changes."
            />
            <Row
              what="Member records, claims, employers, amounts"
              status="mocked"
              detail="Three invented members with invented UANs, employers and balances. No real person, no real UAN, no scraped data."
            />
            <Row
              what="Login"
              status="mocked"
              detail="A cookie holding a UAN. No OTP, no Aadhaar authentication, no password hashing — deliberately, so a reviewer gets in instantly."
            />
            <Row
              what="Stage durations (3 to 7 days, 5 to 10 days)"
              status="mocked"
              detail="Indicative ranges we chose. Real ones would come from EPFO's own settled-claim data, which is the better version of this feature."
            />
            <Row
              what="Live claim status"
              status="would-need"
              detail="A read API over the claim workflow: current stage, who holds it, when it entered that stage. EPFO has this data — the portal simply does not show it."
            />
            <Row
              what="The record cross-check"
              status="would-need"
              detail="Read access to the member's own EPFO, UIDAI, PAN and bank-seeding status. All four already exist and are already compared — at rejection time, weeks too late."
            />
            <Row
              what="Filing a grievance or a correction"
              status="would-need"
              detail="We draft the grievance and name the correction route. Submitting it would need write access to EPFiGMS and the member portal."
            />
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-ink">
            What this would need to be, not just a nicer front end
          </h2>

          <div className="mt-3 space-y-4">
            <article className="rounded-lg border border-line bg-surface p-4 shadow-card">
              <h3 className="font-semibold text-ink">
                1. A status read API over the existing workflow
              </h3>
              <p className="prose-measure mt-1 text-sm text-ink-muted">
                Nothing here asks EPFO to change a form, a rule or an approval chain.
                Form 19 stays Form 19; employer attestation still happens. What is
                missing is an endpoint that returns the state the workflow is already in:
                stage, holder, entry date. Every screen in Flow 2 is a rendering of that
                one response.
              </p>
            </article>

            <article className="rounded-lg border border-line bg-surface p-4 shadow-card">
              <h3 className="font-semibold text-ink">
                2. The rejection taxonomy has to be a maintained asset
              </h3>
              <p className="prose-measure mt-1 text-sm text-ink-muted">
                Five codes are in this build. Nationally there are hundreds of remark
                variants across field offices, written by people, sometimes in Hinglish.
                The model turns that long tail into one of a fixed set of reasons and
                declines when it cannot. The decline rate is the metric to watch: every
                refusal is a wording a human should add to the taxonomy, which then never
                needs the model again. Model first, rules after — not the other way
                round.
              </p>
            </article>

            <article className="rounded-lg border border-line bg-surface p-4 shadow-card">
              <h3 className="font-semibold text-ink">3. Safety of the model layer</h3>
              <ul className="prose-measure mt-2 space-y-1.5 text-sm text-ink-muted">
                <li>
                  <span className="text-ink">Constrained output.</span> The model picks a
                  correction route from a fixed list. It cannot invent one, so it cannot
                  send a member to a wrong office.
                </li>
                <li>
                  <span className="text-ink">A confidence floor.</span> Below it, the
                  member is told we do not know, and routed to a grievance. Refusing is a
                  designed outcome, not an error.
                </li>
                <li>
                  <span className="text-ink">Pasted text is data, not instruction.</span>{" "}
                  Remarks are wrapped before they reach the model, so text engineered to
                  look like a command is read as content.
                </li>
                <li>
                  <span className="text-ink">Disclosure on screen.</span> Anything a model
                  wrote is labelled as such, with the model named.
                </li>
                <li>
                  <span className="text-ink">Degradation, not failure.</span> No key, no
                  network, model outage — the app keeps working on fixed rules and says
                  which one answered.
                </li>
              </ul>
            </article>

            <article className="rounded-lg border border-line bg-surface p-4 shadow-card">
              <h3 className="font-semibold text-ink">4. Privacy</h3>
              <p className="prose-measure mt-1 text-sm text-ink-muted">
                A member's identifiers never need to reach a model. The decoder is sent
                the rejection wording only — no UAN, no Aadhaar, no bank details, no name.
                The record cross-check is arithmetic on the member's own values and never
                leaves the server. In a real deployment the model layer would sit inside
                the same boundary as the claim data, with the same audit trail.
              </p>
            </article>

            <article className="rounded-lg border border-line bg-surface p-4 shadow-card">
              <h3 className="font-semibold text-ink">5. Cost and load</h3>
              <p className="prose-measure mt-1 text-sm text-ink-muted">
                The model is called on the long tail only. Known codes are a lookup, and
                caching a decoded remark by its normalised text means each new wording is
                paid for once nationally, not once per member. The expensive path shrinks
                every week the taxonomy grows.
              </p>
            </article>

            <article className="rounded-lg border border-line bg-surface p-4 shadow-card">
              <h3 className="font-semibold text-ink">6. The process change worth making</h3>
              <p className="prose-measure mt-1 text-sm text-ink-muted">
                One rule change would do more than this entire interface: run the record
                cross-check when a claim is <em>submitted</em>, not when it is decided.
                The comparison already happens. Moving it three weeks earlier turns a
                rejection into a correction, and empties a large share of the grievance
                queue that field offices are currently paid to process.
              </p>
            </article>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-ink">What we are not claiming</h2>
          <ul className="prose-measure mt-2 space-y-1.5 text-sm text-ink-muted">
            <li>This is not an EPFO product and is not affiliated with or approved by EPFO.</li>
            <li>No live government system was accessed, tested or scraped to build it.</li>
            <li>No real Aadhaar, PAN, bank or member data appears anywhere in it.</li>
            <li>
              The amounts, employers and members are invented and internally consistent —
              plausible, not real.
            </li>
          </ul>
        </section>

        <Link
          href="/decode"
          className="mt-8 inline-flex min-h-11 items-center rounded-md bg-accent px-4 py-2.5 font-medium text-accent-ink hover:bg-accent-hover"
        >
          Try the decoder on your own rejection
        </Link>
      </main>
    </>
  );
}
