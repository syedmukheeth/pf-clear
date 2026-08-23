/**
 * All seed dates are derived from *today*, not hard-coded.
 *
 * Hard-coded dates would make the demo read as stale within weeks, and — worse —
 * the "stalled 21 days" beat in Ramesh's timeline would silently drift to 40, 60,
 * 200 days and stop matching the story. Offsets keep every interval exact.
 */
export function today(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function toIso(d: Date): string {
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export const TODAY = toIso(today());

export function daysAgo(n: number): string {
  const d = today();
  d.setDate(d.getDate() - n);
  return toIso(d);
}

export function monthsBefore(iso: string, months: number): string {
  const [y, m, day] = iso.split("-").map(Number);
  const d = new Date(y, m - 1 - months, day);
  return toIso(d);
}

export function daysFromNow(n: number): string {
  const d = today();
  d.setDate(d.getDate() + n);
  return toIso(d);
}
