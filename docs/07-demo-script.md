# 07 — Demo Video Script

**2:00 maximum. Hard cutoff.** Over-length is a stated disqualifier.

> **The most common way this video fails: spending minute one on the tech stack.** Minute one is a citizen using the thing. The stack does not appear until 1:00.

---

## Structure

- **0:00 – 1:00** — using it as a citizen. No narration about how it was built.
- **1:00 – 2:00** — decisions and why.

---

## Minute 1 — the citizen

### 0:00–0:08 · Cold open on the problem
**On screen:** the real EPFO status screen showing "Under Process."
**Say:**
> "This is what EPFO tells you about your money. Under Process. That's the whole message. It doesn't say who has it, why it's stuck, or what you can do."

Open on the real portal, not on our build. The judge recognises it immediately and the rest of the video has a reference point.

### 0:08–0:18 · Land in the rebuild
**On screen:** login → tap **Arun Deshpande** → claim list → the claim marked **Rejected**.
**Say:**
> "Same claim, rebuilt. Arun filed for his final settlement in June. It was rejected."

### 0:18–0:40 · The decoder — the hero beat
**On screen:** open the claim. The decoder renders the DOB mismatch, the two dates settling into place.
**Say:**
> "EPFO's actual message was 'DOB not matching with UIDAI records.' Here's what that means: EPFO thinks he was born in 1994. Aadhaar says 1993. One year apart, and it's enough to stop the money."

Pause on the diff for a beat. Let it be read.

> "And here's the fix — which form, how long it takes, what it costs, and what usually goes wrong with it."

Scroll to the Action Card. Don't read it aloud; let it be seen.

### 0:40–0:52 · The validator — close the loop
**On screen:** navigate to `/validator`. Verdict: 1 blocker, 2 warnings.
**Say:**
> "But the real point is this. That check runs *before* you file. Arun would have known in ten seconds, instead of finding out three weeks later."

### 0:52–1:00 · The stall and the number
**On screen:** switch to **Ramesh** → the timeline, overdue strip visible on employer approval. Then a quick cut to the calculator total.
**Say:**
> "And when a claim is just sitting there — it's sitting with his ex-employer. Twenty-one days, when it usually takes three to seven. He can see that now, and send them the request."

---

## Minute 2 — the decisions

### 1:00–1:15 · Why EPFO
> "I picked EPFO because the frustration there isn't ugly screens — it's not being told anything. Every salaried person in India has a PF story, and almost none of them know where their claim actually is."

### 1:15–1:35 · Why these three flows
> "So I built three things and nothing else: decode the rejection, catch it before you file, and tell you what you'll actually receive. Three flows finished beats twenty half-built."

### 1:35–1:50 · The Action Card
> "Every screen answers the same five questions — what you need, what it costs, how long it takes, your one next step, and what usually goes wrong. That last one is the part government sites never tell you."

### 1:50–2:00 · Restraint and honesty
> "I changed no forms and no rules — Form 19 is still Form 19. EPFO already knows all of this. It just doesn't say it. And when the decoder doesn't recognise a rejection code, it says so instead of guessing."

**Hard stop at 2:00.** Cut on the sentence, not after it.

---

## Shot list

| # | Shot | Source |
|---|---|---|
| 1 | Real EPFO "Under Process" | Live portal or a screenshot |
| 2 | Login, tap Arun | Our build |
| 3 | Claim list, Rejected row | Our build |
| 4 | Decoder, DOB diff | Our build — **hold longest** |
| 5 | Fix Action Card | Our build |
| 6 | Validator verdict | Our build |
| 7 | Ramesh timeline, overdue strip | Our build |
| 8 | Calculator total + 15G savings line | Our build |

Shot 4 is the one a judge remembers. Give it the most seconds.

---

## Recording checklist

- [ ] 1080p, browser zoom ~110% so text is readable in a small player
- [ ] Bookmarks bar hidden, notifications off, no other tabs
- [ ] Recording the **deployed URL**, not localhost — judges should see the real thing
- [ ] Demo-data footer visible at least once
- [ ] Mic level checked; record a 10-second test first
- [ ] Cursor movements slow and deliberate — fast mouse reads as nervous
- [ ] No dead air waiting for a page: pre-warm every route before recording
- [ ] Final file **≤ 2:00**. Check the duration before uploading, not after.
- [ ] Uploaded and set to public / anyone-with-link. **Open the link in incognito to confirm it plays.**

---

## What to cut if it runs long

In this order:
1. The 0:52 stall segment (Ramesh) — keep the calculator flash
2. The 1:50 restraint line
3. Shorten the cold open to 5 seconds

Never cut: the decoder beat, or the validator loop-closer. Those two are the entry.

Next: [08-submission.md](08-submission.md)
