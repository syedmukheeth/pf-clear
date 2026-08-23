# PF Clear

**EPFO, rebuilt around the only question members actually ask: why is my claim stuck?**

Built for [Build What Moves India](https://buildwhatmovesindia.com/) — a citizen-side rebuild of the EPFO / UAN member portal.

---

## Demo login

**Live:** `https://__________.vercel.app` <!-- fill after deploy -->

| Account | UAN | Password | Shows |
|---|---|---|---|
| Arun Deshpande ⭐ | `100100100003` | `demo1234` | **Claim rejected on a DOB mismatch — start here** |
| Ramesh Iyer | `100100100002` | `demo1234` | Claim stalled 21 days at employer approval |
| Priya Raghavan | `100100100001` | `demo1234` | Claim approved and credited |

All three are one-tap buttons on the login screen. No typing required.

> All data is fabricated. No real person, no real UAN, no real employer. Not affiliated with EPFO.

---

## What it does

- **Decodes any rejection, not just the ones we listed.** Paste the wording from your own claim at `/decode` — no login. An OpenAI model maps it to a known reason, or refuses and routes you to a grievance. It never invents a correction route.
- **Decodes rejections.** EPFO says "DOB not matching with UIDAI records." This shows that EPFO has your birth year as 1994 while Aadhaar says 1993 — and the exact correction route.
- **Catches mismatches before you file.** The same cross-check runs pre-submission across EPFO, Aadhaar, PAN, and bank records, so you find out in ten seconds instead of three weeks.
- **Tells you what you'll actually receive.** One number, TDS applied, credit window shown — not a wall of contribution rows.

Every screen answers five questions: what you need · what it costs · how long it takes · your one next step · what usually goes wrong here.

---

## Optional: the model layer

The app runs with no key. The decoder falls back to keyword matching, the
grievance drafter falls back to a template, and every screen says which one
answered. To switch the model path on, copy `.env.example` to `.env.local`:

```
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```

What is sent to the model: the rejection wording only. No UAN, no Aadhaar, no
name, no bank details. Reasoning in [docs/11-build-log.md](docs/11-build-log.md)
and on the site at `/how-it-works`.

## Run locally

```bash
npm install
```

```bash
npm run dev
```

Then open `http://localhost:3000`. No database, and environment variables are optional — all data is mocked.

```bash
npm run contrast
```

Runs the WCAG audit against the real tokens in `app/globals.css`. 24/24 pairs
pass in light and dark.

---

## Documentation

| Doc | What's in it |
|---|---|
| [00 · Brief](docs/00-brief.md) | Competition rules, deadlines, disqualifiers |
| [01 · Problem](docs/01-problem.md) | Why EPFO, the five worst moments, rejection taxonomy, personas |
| [02 · Comparison](docs/02-comparison.md) | Current EPFO vs this build, screen by screen |
| [03 · Features](docs/03-features.md) | The three flows, spec'd in detail |
| [04 · Mock data](docs/04-mock-data.md) | Demo accounts, credentials, entity shapes |
| [05 · Design system](docs/05-design-system.md) | Tokens, components, accessibility, motion rules |
| [06 · Architecture](docs/06-architecture.md) | Stack, routes, mock API contract, deployment |
| [07 · Demo script](docs/07-demo-script.md) | The 2-minute video, second by second |
| [08 · Submission](docs/08-submission.md) | Form answers, the 250-word summary, pre-submit checklist |
| [09 · Presentation](docs/09-presentation.md) | Bangalore pitch outline and anticipated questions |
| [10 · Roadmap](docs/10-roadmap.md) | Seven-day plan, Round 2 scope, cut list |
| [11 · Build log](docs/11-build-log.md) | What broke during the build and what was decided as a result |
| [Changelog](docs/changelog.md) | R1 → R2 changes and mentor feedback log |

---

## Stack

Next.js (App Router) · TypeScript · Tailwind · deployed on Vercel. No database, no auth library, no state manager — reasoning in [06-architecture.md](docs/06-architecture.md).
