const inrFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

/** Indian digit grouping: 7,02,340 — never 702,340. */
export function inr(amount: number): string {
  return `₹${inrFormatter.format(Math.round(amount))}`;
}

/** 2025-06-28 → 28 Jun 2025 */
export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** 2025-06-28 → 28 Jun */
export function formatDayMonth(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

/** 1994-04-12 → 12-04-1994, the format EPFO itself prints. */
export function formatDob(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}-${m}-${y}`;
}

export function daysBetween(fromIso: string, toIso: string): number {
  const from = new Date(`${fromIso}T00:00:00`).getTime();
  const to = new Date(`${toIso}T00:00:00`).getTime();
  return Math.round((to - from) / 86_400_000);
}

/** 38 months → "3y 2m" */
export function formatTenure(months: number): string {
  const y = Math.floor(months / 12);
  const m = months % 12;
  return `${y}y ${m}m`;
}

/** clm_c1 -> CLM-C1, the shape a member would read out on a call. */
export function claimRef(id: string): string {
  return id.replace(/_/g, "-").toUpperCase();
}
