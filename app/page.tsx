"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const DEMO_ACCOUNTS = [
  {
    uan: "100100100003",
    name: "Arun Deshpande",
    shows: "Claim rejected on a date-of-birth mismatch",
    hint: "Start here",
  },
  {
    uan: "100100100002",
    name: "Ramesh Iyer",
    shows: "Claim stuck 21 days at employer approval",
  },
  {
    uan: "100100100001",
    name: "Priya Raghavan",
    shows: "Claim approved and credited",
  },
];

const PASSWORD = "demo1234";

export default function LoginPage() {
  const router = useRouter();
  const [uan, setUan] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState<string>();

  async function signIn(nextUan: string, nextPassword: string) {
    setError(undefined);
    setPending(nextUan);

    const response = await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uan: nextUan, password: nextPassword }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body.error ?? "Could not sign in.");
      setPending(undefined);
      return;
    }

    router.push("/claims");
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-8">
      <p className="text-sm font-semibold tracking-wide text-accent uppercase">
        PF Clear
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">
        Know why your PF claim is stuck.
      </h1>
      <p className="prose-measure mt-3 text-ink-muted">
        EPFO tells you &ldquo;Under Process&rdquo;. This tells you who is holding your
        claim, what they are waiting on, and what you can do today.
      </p>

      <section className="mt-8" aria-labelledby="demo-heading">
        <h2 id="demo-heading" className="text-sm font-semibold text-ink">
          Sign in as a demo member — one tap, no typing
        </h2>

        <ul className="mt-3 space-y-3">
          {DEMO_ACCOUNTS.map((account) => (
            <li key={account.uan}>
              <button
                type="button"
                onClick={() => signIn(account.uan, PASSWORD)}
                disabled={pending !== undefined}
                className="w-full rounded-lg border border-line bg-surface p-4 text-left shadow-card hover:border-accent disabled:opacity-60"
              >
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-ink">{account.name}</span>
                  {account.hint && (
                    <span className="rounded-sm border border-accent/30 bg-accent-soft px-2 py-0.5 text-xs font-semibold tracking-wide text-accent uppercase">
                      {account.hint}
                    </span>
                  )}
                </span>
                <span className="mt-1 block text-sm text-ink-muted">
                  {account.shows}
                </span>
                <span className="num mt-2 block text-xs text-ink-faint">
                  UAN {account.uan} · {PASSWORD}
                  {pending === account.uan ? " · signing in…" : ""}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <details className="mt-6 rounded-lg border border-line bg-surface p-4">
        <summary className="cursor-pointer font-medium text-ink">
          Or type the credentials yourself
        </summary>
        <form
          className="mt-4 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            signIn(uan, password);
          }}
        >
          <div>
            <label htmlFor="uan" className="block text-sm font-medium text-ink">
              UAN
            </label>
            <input
              id="uan"
              name="uan"
              inputMode="numeric"
              autoComplete="username"
              value={uan}
              onChange={(event) => setUan(event.target.value)}
              className="num mt-1 min-h-11 w-full rounded-md border border-line-strong bg-surface px-3 py-2 text-ink"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-ink">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 min-h-11 w-full rounded-md border border-line-strong bg-surface px-3 py-2 text-ink"
            />
          </div>
          <button
            type="submit"
            disabled={pending !== undefined}
            className="min-h-11 w-full rounded-md bg-accent px-4 py-2.5 font-medium text-white hover:bg-accent-hover disabled:opacity-60"
          >
            Sign in
          </button>
        </form>
      </details>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-md border border-rejected/30 bg-rejected-soft px-3 py-2 text-sm text-rejected"
        >
          {error}
        </p>
      )}

      <p className="prose-measure mt-8 text-sm text-ink-faint">
        A citizen-side proof of concept for the EPFO member portal. All members,
        employers, claims and amounts on this site are invented.
      </p>
    </main>
  );
}
