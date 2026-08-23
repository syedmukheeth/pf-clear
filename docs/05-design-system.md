# 05 — Design System

Mobile-first, calm, informational. The visual job is to make an anxious person feel oriented — not to impress.

**Stated anti-goal:** no 3D, no scroll-jacking, no decorative motion. The organisers explicitly said a build loaded with Three.js flourish that doesn't help a busy citizen scores worse. Every visual choice here has to earn its place by carrying information.

---

## Tokens

```css
:root {
  /* surface */
  --bg:            #FBFBF9;
  --surface:       #FFFFFF;
  --surface-sunk:  #F4F4F1;
  --border:        #E4E4DF;
  --border-strong: #8C8C87;

  /* text */
  --text:          #1A1A17;
  --text-muted:    #5C5C55;
  --text-faint:    #707068;

  /* brand — a deep government-adjacent indigo, not saffron/green (avoids flag cosplay) */
  --accent:        #1F3A8A;
  --accent-hover:  #172E6E;
  --accent-soft:   #EBEFFB;

  /* status semantics — the most important tokens in the file */
  --ok:            #1B7A4A;  --ok-soft:      #E7F4ED;
  --wait:          #886B1E;  --wait-soft:    #FBF3DE;
  --stalled:       #B35209;  --stalled-soft: #FDF0E3;
  --rejected:      #B02A2A;  --rejected-soft:#FBEAEA;

  /* type */
  --font: ui-sans-serif, system-ui, "Inter", "Segoe UI", sans-serif;
  --font-num: ui-monospace, "SF Mono", "Roboto Mono", monospace;

  --t-xs: 0.75rem; --t-sm: 0.875rem; --t-base: 1rem;
  --t-lg: 1.125rem; --t-xl: 1.375rem; --t-2xl: 1.75rem; --t-3xl: 2.25rem;

  /* space — 4px base */
  --s-1: 4px; --s-2: 8px; --s-3: 12px; --s-4: 16px;
  --s-5: 24px; --s-6: 32px; --s-7: 48px; --s-8: 64px;

  --r-sm: 6px; --r-md: 10px; --r-lg: 14px;
  --shadow: 0 1px 2px rgb(0 0 0 / 0.04), 0 4px 12px rgb(0 0 0 / 0.04);
}
```


**Four status colours, four meanings, never reused for decoration:**

| Token | Means | Used on |
|---|---|---|
| `--ok` | Done, verified, clear | Completed timeline nodes, `Clear` badges, credited amounts |
| `--wait` | Waiting, but normal | In-progress nodes inside expected duration |
| `--stalled` | Waiting too long | Overdue nodes, `Warning` severity |
| `--rejected` | Blocked, failed | Rejections, `Blocker` severity, the mismatch diff |

A member should be able to read their situation from colour alone, before reading a word.

### Dark mode

Only if it comes free from the token swap. Not a priority — it is not what the judging is about.

```css
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg: #14140F; --surface: #1C1C17; --surface-sunk: #24241E;
    --border: #33332B; --border-strong: #6E6E64;
    --text: #F2F2EC; --text-muted: #A8A89E; --text-faint: #8B8B81;
    --accent: #8CA8F0; --accent-soft: #1E2748;
    --ok-soft: #12291D; --wait-soft: #2B2410;
    --stalled-soft: #2E1F0E; --rejected-soft: #2E1414;
  }
}
```

---

## Typography rules

- Body text at `--t-base` minimum. This audience includes 58-year-olds on phones.
- **Money and dates always in `--font-num`,** tabular figures on. Amounts that jitter between rows look untrustworthy.
- Amounts in Indian grouping: `₹7,02,340` — not `₹702,340`. Getting this wrong signals the builder never used the real thing.
- Max line length 68 characters on explanation text.
- No sentence case / title case mixing. Sentence case everywhere except badges.

---

## Components

### `ActionCard`
The signature component. Five slots, always in this order, none omissible:
`whatYouNeed` · `whatItCosts` · `howLong` · `nextStep` (single primary button) · `whatGoesWrong` (muted, at the bottom, prefixed "Usually goes wrong:").

If a screen can't fill all five, the content isn't ready.

### `StatusTimeline`
Vertical, left rail. Node glyphs: `●` done (`--ok`) · `◉` active (`--wait`) · `◉` overdue (`--stalled`, plus an explicit duration callout) · `✕` rejected (`--rejected`) · `○` not started (`--text-faint`).
Each node carries the four lines from [03-features.md](03-features.md). Overdue nodes get a visible "21 days — usually 3–7" strip; that strip is the emotional core of Flow 2.

### `MismatchDiff`
Two-row comparison, source label left, value right, differing characters underlined with a caret rail beneath. Never a red/green code diff — it's a record disagreement, not a merge conflict. Must be legible at 375px, which means stacking, not columns.

### `SeverityBadge`
`Blocker` (`--rejected`) · `Warning` (`--stalled`) · `Clear` (`--ok`). Text label always present — never colour alone, for colourblind readers and for screenshots.

### `FeeBreakdown`
Right-aligned numeric column, a rule above the total, deductions in `--rejected` with a leading minus. The savings line at the bottom is a link-styled call to action, not body text.

---

## Mobile-first rules

- Design at **375px first**, widen after. Most EPFO members are on a phone.
- Single column throughout. No horizontal scroll anywhere on the page body; wide tables scroll inside their own container.
- Tap targets ≥ 44px.
- One primary action per screen. If two things look equally clickable, the screen has failed.
- Sticky bottom bar for the primary action on long screens.

---

## Accessibility floor

- Body text ≥ 4.5:1 contrast; large text ≥ 3:1. Verify the status-soft backgrounds against their text colours — that's where these palettes usually fail.
- Visible focus ring on every interactive element: `2px solid var(--accent)`, 2px offset.
- Status never communicated by colour alone — always paired with a glyph and a word.
- Semantic headings in order; the timeline is an ordered list in markup.
- **English-first with the EPFO term retained in parentheses** where members will be searching for the official phrase — e.g. "Final settlement (Form 19)". A full Hindi toggle is Round 2 scope.

---

## Motion

Two rules:
1. Transitions ≤ 200ms, ease-out, on state changes only.
2. `prefers-reduced-motion: reduce` disables all of it.

The single deliberate animation in the build: the `MismatchDiff` rows settling into place when the decoder opens — roughly 250ms, drawing the eye to the differing digit. That one earns its place because it directs attention. Nothing else animates.

Next: [06-architecture.md](06-architecture.md)
