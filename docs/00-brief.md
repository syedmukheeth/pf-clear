# 00 — Brief, Rules & Constraints

Source: the **published builder brief** at
[buildwhatmovesindia.com/brief](https://buildwhatmovesindia.com/brief), read on
23 Aug 2026. This file previously held notes taken from the organiser video;
where the two disagree, the published brief wins and this file now follows it.
Corrections are listed at the bottom.

---

## Timeline

| Date | What happens |
|---|---|
| **28 Aug 2026, 8:00 PM IST** | Submission closes. Stated plainly: **no grace period after the form closes.** |
| 28 Aug – 1 Sep | Every submission reviewed by the organiser team together with OpenAI |
| ~1 Sep | Top **250** shortlisted. Everyone who submitted gets an email, pass or fail. |
| 1 – 7 Sep | Mentorship week — WhatsApp group with five mentors from engineering, tech and the OpenAI team |
| **7 Sep 2026** | Resubmit the improved build, same format, **same email addresses** |
| 8 – 12 Sep | The 10 finalists announced; top 250 honoured on a public page |
| **12 Sep 2026** | Finalists present live in Bengaluru to founders, creators, mentors and invited government officials |

---

## What to build

> "Pick one real problem you have faced on an Indian public-service website or
> digital service. Then build a simpler, clearer and more useful way to solve it."

- Travel, taxes, pensions, certificates, payments, grievances — any public need.
  **IRCTC, EPFO and the Income Tax portal are named as examples, not a fixed
  list.** (The earlier note in this file that off-list entries score lower was
  wrong.)
- **Codex or an OpenAI model is a requirement, not a suggestion:** *"your
  prototype should be built with Codex or powered by an OpenAI model. Codex
  should be a meaningful part of how you build it, not something added only for
  the submission."*
- A **complete citizen journey**, start to finish. A static design is not enough.
- Mock data, accounts and backend behaviour wherever production access would be
  unsafe or unavailable — and mocks must be **clearly identified**.
- Reviewers test the **citizen experience, not an admin panel**.
- Built for **real Indian users**: mobile devices, slower connections, limited
  digital experience.

Our choice: **EPFO / UAN member portal**. Reasoning in [01-problem.md](01-problem.md).

---

## What a strong build makes obvious

Six questions, quoted from the brief. These are effectively the outline of the
video and the summary:

1. Who is facing the problem?
2. What is difficult about the current experience?
3. What did you change?
4. Why is your version better?
5. **What works today, and what is still mocked?**
6. **How could the idea work safely at a larger scale?**

5 and 6 are answered on-site at `/how-it-works`, because a reviewer with two
minutes will not find them anywhere else.

---

## How builds are judged

Six named criteria. Everything we build should be traceable to one of them:

| Criterion | The question asked |
|---|---|
| **Problem** | Is this a real and important user problem? |
| **Working build** | Does the main journey actually work? |
| **Usability** | Is the experience simpler, clearer and more accessible? |
| **Product thinking** | Are the choices thoughtful and well explained? |
| **End-to-end thinking** | Does the solution address the backend, infrastructure and processes, **not just the interface**? |
| **Honesty** | Are limitations, mock data and dependencies clearly disclosed? |

Note what is *not* on this list: visual flourish, feature count, or how much was
built. Note what is: two criteria that a beautiful front end alone cannot score
on.

---

## Submission = 4 things

1. **A live public link** that opens in a browser **without requesting access**.
   Reviewers will not download a mobile app. Include mock login credentials.
2. **One video, 2:00 maximum.** Minute 1: demo as a citizen. Minute 2: how you
   built it and why you made those choices.
3. **A summary under 250 words** — what it is and why it is better than the
   current solution. ("Under 250", not "exactly 250" as this file used to say.)
4. **Partner's registered email** — blank for solo. Both teammates must register
   and list each other.

---

## What not to do

Quoted, because several of these are disqualifying and two constrain the build:

- Do not access, test or interfere with a live government system.
- Do not reverse-engineer private systems or use undocumented private APIs.
- Do not scrape personal or restricted information.
- Do not use real Aadhaar numbers, PAN details, passwords, OTPs, payment
  details, health information or other sensitive data.
- **Do not present the prototype as an official government product.**
- **Do not use government logos in a way that suggests approval or partnership.**
- Do not submit an old project with only small changes.
- Do not include code, assets or data you do not have permission to use.

How this build complies: no live EPFO system was touched, no scraping, all data
invented, no EPFO logo or seal anywhere, a persistent footer on every screen, a
`/how-it-works` page stating we are not affiliated, and `robots: noindex` so a
site that resembles a government portal never appears in search results.

---

## The email rule

The registered email is the identity for every form, result and invite, and an
entry cannot be moved to another address. Round 2 uses the same email as Round 1.

Registered email for this entry: `lokeshkammara@gmail.com`. Solo — partner field
blank.

---

## Prizes

- Top 10: a year of Codex Pro and a Codex Micro
- Top 3: a MacBook on top of that
- Winner: a trip to San Francisco (visa-dependent)
- Top 250: named on a public honours page

Selection does not guarantee that any government body adopts the build. The
stated goal is to start a conversation about better public digital experiences.

---

## Corrections made to this file on 23 Aug

Recorded rather than quietly overwritten, because the build was planned against
the wrong version for several days:

| Was written here | Actually says |
|---|---|
| "Pick one of 10 listed platforms; off-list is scored lower" | The platforms are examples, not a fixed list |
| "Ideas over code — energy on interfaces, not engineering" | Six explicit criteria, two of which (**end-to-end thinking**, **honesty**) are about backend, process and disclosure |
| Nothing about Codex or OpenAI | **A stated requirement**: built with Codex or powered by an OpenAI model |
| "Text summary, exactly 250 words" | Under 250 words |
| Judging "as a citizen, not as an engineer" | Reviewers test the citizen journey, but product and end-to-end thinking are scored explicitly |

Next: [01-problem.md](01-problem.md) · [11-build-log.md](11-build-log.md) · [10-roadmap.md](10-roadmap.md)
