/**
 * WCAG contrast audit, run against the real tokens in app/globals.css.
 *
 * The design doc calls the status-soft backgrounds the place these palettes
 * usually fail, so this reads the stylesheet rather than a copy of the values —
 * an audit that can drift from the thing it audits is worth nothing.
 *
 * Usage: node scripts/contrast-audit.mjs
 */
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

function tokensIn(block) {
  const out = {};
  for (const [, name, value] of block.matchAll(/--([a-z-]+):\s*(#[0-9A-Fa-f]{6})/g)) {
    out[name] = value.toUpperCase();
  }
  return out;
}

const rootBlock = css.slice(css.indexOf(":root {"), css.indexOf("@media"));
const darkBlock = css.slice(css.indexOf("@media"), css.indexOf("@theme"));

const light = { ...tokensIn(rootBlock), white: "#FFFFFF" };
const dark = { ...light, ...tokensIn(darkBlock), white: "#FFFFFF" };

function luminance(hex) {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((v) =>
    v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a, b) {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (high + 0.05) / (low + 0.05);
}

/** [foreground, background, minimum] — 4.5 for body text, 3 for UI boundaries. */
const PAIRS = [
  ["text", "bg", 4.5], ["text", "surface", 4.5], ["text", "surface-sunk", 4.5],
  ["text-muted", "bg", 4.5], ["text-muted", "surface", 4.5], ["text-muted", "surface-sunk", 4.5],
  ["text-faint", "bg", 4.5], ["text-faint", "surface", 4.5], ["text-faint", "surface-sunk", 4.5],
  ["accent", "bg", 4.5], ["accent", "surface", 4.5], ["accent", "accent-soft", 4.5],
  ["accent-ink", "accent", 4.5], ["accent-ink", "accent-hover", 4.5],
  ["ok", "ok-soft", 4.5], ["ok", "surface", 4.5],
  ["wait", "wait-soft", 4.5], ["wait", "surface", 4.5],
  ["stalled", "stalled-soft", 4.5], ["stalled", "surface", 4.5],
  ["rejected", "rejected-soft", 4.5], ["rejected", "surface", 4.5],
  ["border-strong", "surface", 3], ["border-strong", "bg", 3],
];

let failures = 0;

for (const [mode, palette] of [["light", light], ["dark", dark]]) {
  const results = PAIRS.map(([fg, bg, min]) => {
    const value = ratio(palette[fg], palette[bg]);
    return { fg, bg, min, value, pass: value >= min };
  });

  const failed = results.filter((r) => !r.pass);
  failures += failed.length;

  console.log(`\n${mode}: ${results.length - failed.length}/${results.length} pass`);
  for (const r of failed) {
    console.log(`  FAIL  ${r.fg} on ${r.bg}  ${r.value.toFixed(2)}:1  (needs ${r.min})`);
  }
}

if (failures > 0) {
  console.log(`\n${failures} failing pair(s).`);
  process.exit(1);
}
console.log("\nAll pairs pass.");
