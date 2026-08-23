# 06 — Architecture

This doc feeds **minute 2 of the video**: "what decisions did you take, and why."

---

## Stack, and why

| Choice | Reason, in one line |
|---|---|
| **Next.js (App Router)** | Route handlers give a real-feeling mock backend without a second service |
| **Tailwind** | Token-driven styling at speed; the design system in [05](05-design-system.md) maps straight to it |
| **TypeScript** | The mock data has real shape; types stop the seed drifting from the UI |
| **In-memory / JSON mock data** | No database. The judge needs the app to work, not to scale. |
| **Vercel** | Free, instant public HTTPS URL, deploys from day 1 so the pipeline is never a last-day risk |

**No database, no auth library, no state manager.** Every one of those would be defensible engineering and none of them would make a citizen's experience better — which is the only thing being graded.

---

## Routes

| Route | Screen | Notes |
|---|---|---|
| `/` | Login | Three demo accounts as one-tap buttons; credentials visible on screen |
| `/claims` | Claim list | Status at a glance; lands here after login |
| `/claims/[id]` | Timeline + decoder | Rejected claims render the decoder above the timeline |
| `/validator` | Pre-submission check | Reachable from the claim list and from a decoder fix card |
| `/calculator` | Withdrawal / pension estimate | Mode toggle at the top |

Five routes total. Anything that would need a sixth belongs in Round 2.

---

## Folder structure

```
E:\G-web
├─ app/
│  ├─ layout.tsx              # shell, demo-data footer banner
│  ├─ page.tsx                # login
│  ├─ claims/page.tsx
│  ├─ claims/[id]/page.tsx
│  ├─ validator/page.tsx
│  ├─ calculator/page.tsx
│  └─ api/
│     ├─ session/route.ts     # mock login
│     ├─ claims/route.ts
│     ├─ claims/[id]/route.ts
│     ├─ kyc/route.ts         # validator checks
│     └─ estimate/route.ts    # calculator
├─ components/
│  ├─ ActionCard.tsx
│  ├─ StatusTimeline.tsx
│  ├─ MismatchDiff.tsx
│  ├─ SeverityBadge.tsx
│  └─ FeeBreakdown.tsx
├─ lib/
│  ├─ mock/                   # seed data — mirrors docs/04-mock-data.md
│  │  ├─ members.ts
│  │  ├─ claims.ts
│  │  ├─ kyc.ts
│  │  └─ fixes.ts             # Action Card payloads, keyed by fixId
│  ├─ decode.ts               # rejection code → plain language
│  ├─ estimate.ts             # TDS / pension math
│  └─ latency.ts              # artificial 300–600ms delay
├─ docs/                      # this documentation set
└─ README.md
```

---

## Mock API contract

Route handlers, not client-side imports. The point is that the app behaves like something with a server — loading states are real, and swapping in a genuine EPFO integration later would be a change of data source, not a rewrite.

```
POST /api/session        { uan, password }        → { member } | 401
GET  /api/claims                                  → { claims: Claim[] }
GET  /api/claims/:id                              → { claim, events: ClaimEvent[], decoded? }
GET  /api/kyc                                     → { checks: KycCheck[], verdict }
POST /api/estimate       { mode, uan, form15G }   → { breakdown, total, creditWindow }
```

Every handler passes through `lib/latency.ts`. A demo that resolves in 0ms feels fake; 300–600ms feels like software.

`decoded` is computed server-side by `lib/decode.ts`, mapping a rejection code to a plain-language explanation plus a `fixId`. **When a code has no mapping, the API says so honestly** and returns a grievance route instead of inventing an explanation — a decoder that confidently makes things up would be worse than the portal it replaces.

---

## State

- Session: one cookie holding the UAN. No JWT, no auth provider — it's a demo login.
- Server components fetch directly; client components only where interaction demands it (mode toggles, the 15G switch, copy-to-clipboard).
- No global store. Five routes don't need one.

---

## Deployment

- Vercel, connected to the repo, auto-deploy on push.
- No secrets, no env vars. Nothing to misconfigure at 7 PM on submission day.
- **Deploy an empty page on Day 1.** The pipeline must be proven before there is anything to lose.

### Pre-submit checks on the live URL
1. Open in an **incognito window on a different device**, on mobile data, not the dev machine.
2. Log in cold with the published credentials — all three accounts.
3. Reach the rejected-claim decoder in under 30 seconds from a standing start.
4. Every route loads without a client-side error; check the console.
5. The demo-data footer is visible on every screen.

---

## Decisions worth saying out loud in the video

- **Chose EPFO over IRCTC** — the crowded platforms get graded against hundreds of near-identical builds.
- **Built three flows, not thirty screens** — the brief asked for ideas, and depth is what makes an idea legible.
- **The Action Card is the whole thesis** — one repeated pattern that forces every screen to answer what it costs, how long it takes, and what usually goes wrong.
- **The decoder refuses to guess** — unmapped rejection codes route to grievance rather than fabricating a reason.
- **No 3D, no motion for its own sake** — deliberately, because the brief called that out as low-value for a frustrated citizen.

Next: [07-demo-script.md](07-demo-script.md)
