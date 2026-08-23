"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { href: "/claims", label: "My claims" },
  { href: "/validator", label: "Check my records" },
  { href: "/calculator", label: "What I'll get" },
];

export default function AppHeader({ memberName }: { memberName?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    await fetch("/api/session", { method: "DELETE" });
    router.push("/");
    router.refresh();
  }

  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/claims" className="inline-flex min-h-11 items-center text-lg font-bold tracking-tight text-ink">
          PF Clear
        </Link>
        <div className="flex items-center gap-3">
          {memberName && (
            <span className="hidden text-sm text-ink-muted sm:inline">
              {memberName}
            </span>
          )}
          <button
            type="button"
            onClick={signOut}
            className="min-h-11 rounded-md px-2 text-sm font-medium text-accent hover:underline"
          >
            Sign out
          </button>
        </div>
      </div>

      <nav aria-label="Main" className="mx-auto max-w-3xl px-2">
        <ul className="flex gap-1 overflow-x-auto">
          {NAV.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex min-h-11 items-center border-b-2 px-3 text-sm font-medium whitespace-nowrap ${
                    active
                      ? "border-accent text-accent"
                      : "border-transparent text-ink-muted hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
