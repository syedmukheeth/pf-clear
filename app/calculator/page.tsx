"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import ActionCard from "@/components/ActionCard";
import AppHeader from "@/components/AppHeader";
import FeeBreakdown from "@/components/FeeBreakdown";
import { ErrorBlock, LoadingBlock } from "@/components/PageState";
import { formatTenure, inr } from "@/lib/format";
import type { PensionEstimate, WithdrawalEstimate } from "@/lib/estimate";
import type { Fix } from "@/lib/types";

type Mode = "withdrawal" | "pension";

interface EstimateResponse {
  mode: Mode;
  member: { name: string; serviceMonths: number };
  withdrawal?: WithdrawalEstimate;
  pension?: PensionEstimate;
  fix?: Fix;
}

export default function CalculatorPage() {
  const [mode, setMode] = useState<Mode>("withdrawal");
  const [form15G, setForm15G] = useState(false);
  const [data, setData] = useState<EstimateResponse>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ message: string; signedOut: boolean }>();

  const load = useCallback(async () => {
    setLoading(true);
    setError(undefined);

    const response = await fetch("/api/estimate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode, form15G }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError({
        message: body.error ?? "Could not work out your estimate.",
        signedOut: response.status === 401,
      });
      setLoading(false);
      return;
    }

    setData(await response.json());
    setLoading(false);
  }, [mode, form15G]);

  useEffect(() => {
    load();
  }, [load]);

  const withdrawal = data?.withdrawal;
  const pension = data?.pension;

  return (
    <>
      <AppHeader memberName={data?.member.name} />

      <main className="mx-auto max-w-3xl px-4 py-6">
        <h1 className="text-2xl font-bold tracking-tight text-ink">
          What will I actually get?
        </h1>
        <p className="prose-measure mt-2 text-ink-muted">
          One number, with the deductions shown — not a passbook full of contribution
          rows.
        </p>

        <div
          role="group"
          aria-label="Estimate type"
          className="mt-5 inline-flex rounded-md border border-line-strong bg-surface p-1"
        >
          {(["withdrawal", "pension"] as Mode[]).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={mode === option}
              onClick={() => setMode(option)}
              className={`min-h-11 rounded-sm px-4 text-sm font-medium ${
                mode === option
                  ? "bg-accent text-accent-ink"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              {option === "withdrawal" ? "PF withdrawal" : "Pension"}
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-5">
            <ErrorBlock
              title={error.signedOut ? "You are signed out" : "Could not calculate"}
              detail={error.message}
              signedOut={error.signedOut}
            />
          </div>
        )}

        {loading && !error && (
          <div className="mt-5">
            <LoadingBlock label="Working out your number…" />
          </div>
        )}

        {!loading && !error && mode === "withdrawal" && withdrawal && (
          <section className="mt-5 space-y-4">
            <FeeBreakdown
              rows={[
                { label: "Your contribution", amount: withdrawal.employeeShare },
                { label: "Employer contribution", amount: withdrawal.employerShare },
                { label: "Interest earned", amount: withdrawal.interest },
              ]}
              subtotal={{ label: "Total in your account", amount: withdrawal.corpus }}
              deductions={
                withdrawal.tds > 0
                  ? [
                      {
                        label: `TDS at 10% (service ${formatTenure(withdrawal.serviceMonths)})`,
                        amount: withdrawal.tds,
                      },
                    ]
                  : []
              }
              total={{ label: "You receive", amount: withdrawal.receives }}
              totalLabel={withdrawal.creditWindow}
              footnote={withdrawal.ruleText}
            />

            <div className="rounded-lg border border-line bg-surface p-4 shadow-card">
              {/* The input is a sibling of the label, not nested inside it:
                  a nested input double-fires when the box itself is tapped. */}
              <div className="flex min-h-11 items-center gap-3">
                <input
                  id="form-15g"
                  type="checkbox"
                  checked={form15G}
                  onChange={(event) => setForm15G(event.target.checked)}
                  className="size-5 shrink-0 accent-[var(--accent)]"
                />
                <label htmlFor="form-15g" className="flex min-h-11 flex-1 items-center font-medium text-ink">
                  Show what happens if I file Form 15G first
                </label>
              </div>

              <p className="prose-measure mt-2 text-sm text-ink-muted">
                {form15G
                  ? withdrawal.tds === 0 && withdrawal.serviceMonths < 60
                    ? "With Form 15G filed before the claim, nothing is deducted. That is the whole difference."
                    : "Form 15G makes no difference here — nothing was being deducted."
                  : withdrawal.savingFrom15G > 0
                    ? `Filing Form 15G before you claim would keep ${inr(withdrawal.savingFrom15G)} that is about to be deducted.`
                    : "Nothing is being deducted, so Form 15G would change nothing."}
              </p>
            </div>

            {data?.fix && <ActionCard fix={data.fix} />}
          </section>
        )}

        {!loading && !error && mode === "pension" && pension && (
          <section className="mt-5 space-y-4">
            {pension.eligibleForMonthlyPension ? (
              <FeeBreakdown
                rows={[
                  {
                    label: "Pensionable salary (capped by law)",
                    amount: pension.pensionableSalary,
                  },
                ]}
                total={{
                  label: "Monthly pension",
                  amount: pension.monthlyPension ?? 0,
                }}
                totalLabel={`From age ${pension.earliestPensionAge}, for life`}
                footnote={`${pension.formulaText}. ${pension.ruleText}`}
              />
            ) : (
              <>
                <div className="rounded-lg border border-stalled/30 bg-stalled-soft p-4">
                  <h2 className="font-semibold text-ink">
                    You do not have a monthly pension yet
                  </h2>
                  <p className="prose-measure mt-1 text-ink">
                    A monthly pension needs 10 years of pensionable service. You have{" "}
                    <span className="num font-semibold">
                      {formatTenure(pension.serviceMonths)}
                    </span>
                    , which is{" "}
                    <span className="num font-semibold">
                      {formatTenure(pension.monthsShortOfTenYears)}
                    </span>{" "}
                    short.
                  </p>
                </div>

                <FeeBreakdown
                  rows={[
                    {
                      label: "Pensionable salary (capped by law)",
                      amount: pension.pensionableSalary,
                      note: `Multiplied by ${pension.tableDFactor} — the Table D factor for ${pension.serviceYears} completed years.`,
                    },
                  ]}
                  total={{
                    label: "One-time withdrawal benefit",
                    amount: pension.withdrawalBenefit ?? 0,
                  }}
                  totalLabel="Claimed with Form 10C"
                  footnote={pension.ruleText}
                />

                <div className="rounded-lg border border-line bg-surface p-4 shadow-card">
                  <h3 className="font-semibold text-ink">
                    What you give up by taking it now
                  </h3>
                  <p className="prose-measure mt-1 text-sm text-ink-muted">
                    If you keep this account and reach 10 years of service, the same
                    record pays{" "}
                    <span className="num font-semibold text-ink">
                      {inr(pension.pensionAtTenYears)} a month
                    </span>{" "}
                    from age 58, for life, instead of{" "}
                    <span className="num font-semibold text-ink">
                      {inr(pension.withdrawalBenefit ?? 0)}
                    </span>{" "}
                    once. Neither choice is wrong. EPFO simply never puts the two side by
                    side.
                  </p>
                </div>
              </>
            )}
          </section>
        )}

        {!loading && !error && (
          <section className="mt-8 rounded-lg border border-line bg-surface p-4">
            <h2 className="font-semibold text-ink">Before you file</h2>
            <p className="prose-measure mt-1 text-sm text-ink-muted">
              These numbers assume your records match. If they do not, the claim is
              rejected before any of this is paid.
            </p>
            <Link
              href="/validator"
              className="mt-3 inline-flex min-h-11 items-center rounded-md bg-accent px-4 py-2.5 font-medium text-accent-ink hover:bg-accent-hover"
            >
              Check my records
            </Link>
          </section>
        )}
      </main>
    </>
  );
}
