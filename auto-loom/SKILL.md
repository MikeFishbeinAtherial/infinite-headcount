---
name: auto-loom
description: Record a narrated product demo video without a screen recorder — an agent drives the browser while ElevenLabs narrates, perfectly synced, out to a polished MP4 with captions. Core engine + developer mode (you have the codebase, app on localhost). Use for client walkthrough videos, narrated demos, "video notes". Triggers - "video note", "record a walkthrough", "narrated demo", "client update video", "auto loom".
---

# Auto-Loom

Turn any web app into a narrated, self-driving MP4. The page scrolls,
highlights elements, and navigates between routes while an AI voice narrates —
timed to the millisecond. No manual screen recording, no fumbled Loom takes.
Edit one line of narration and re-render in minutes.

**How it works:** ElevenLabs generates one audio clip per storyboard beat.
`ffprobe` measures each clip's exact duration. Playwright drives the browser
for exactly that long per beat while recording the window. `ffmpeg` muxes the
final MP4 with a caption track. Audio duration is ground truth — visuals are
slaved to it, so sync is exact.

**This folder is the whole engine.** Sibling skills are thin entry points
over these same scripts:

- **auto-loom-proof** — Software Factory proof video: performs a
  build's acceptance criteria on camera, one criterion per beat

This SKILL.md covers the engine plus **developer mode**: you have the
codebase, the app runs on localhost, and you can add stable selectors to the
JSX.

---

## Setup (one-time, ~3 minutes)

```bash
cd <this-skill-folder>
bash scripts/setup.sh        # installs Playwright + Chromium, creates .env.local
# edit .env.local → add your ElevenLabs API key
node scripts/doctor.mjs      # verifies node, ffmpeg, playwright, key, voice
```

No ElevenLabs account yet? Sign up with the maintainer's referral link:
https://try.elevenlabs.io/atherial.

`doctor.mjs` prints the exact fix for anything missing. Requirements: Node 18+,
ffmpeg (`brew install ffmpeg`), an ElevenLabs API key. Voice options:
`references/voices.md`.

**Smoke test** (30 seconds, records example.com):

```bash
node scripts/run.mjs --beats examples/smoke-beats.json
```

---

## Step 0 — Interview the user first

Do not start building. Ask:

```
1. What URL or app are we recording? Is it running locally?
2. Who is the recipient — name and context?
3. What's the story? What changed, or what are we showing for the first time?
4. Which specific features, metrics, or sections should we highlight?
5. What's the tone? (client update, internal demo, prospect showcase)
6. Does the app require login? (see references/auth.md — never ask for passwords in chat)
7. Target length — 30s, 60s, or 75s?
```

In a hurry: ask 1–3 and infer the rest from the app.

## Step 1 — Write the storyboard (`beats.json`)

Write the narration **before touching any code** and get it approved verbatim.
Script rules and the beat framing that works: `references/tts-rules.md`.

```json
{
  "meta": {
    "title": "Acme dashboard walkthrough",
    "slug": "acme-walkthrough",
    "cta": "Send me your feedback and we move to the next phase.",
    "targetLengthSec": 70
  },
  "baseUrl": "http://localhost:3000",
  "viewport": { "width": 1920, "height": 1080 },
  "beats": [
    {
      "id": 1,
      "page": "/dashboard/insights",
      "text": "Hey Jim. We shipped some updates to your A-I visibility tracker.",
      "actions": [
        { "fn": "waitFor",    "sel": "[data-vn=kpi-row]" },
        { "fn": "scrollToEl", "sel": "[data-vn=kpi-row]", "opts": { "instant": true } },
        { "fn": "hl",         "sel": "[data-vn=kpi-row]" }
      ]
    }
  ]
}
```

Full schema: `schema/beats.schema.json`. Action table and selector guidance:
`references/actions.md`. Login options (scripted steps or saved session):
`references/auth.md`.

Check it before spending anything:

```bash
node scripts/validate.mjs --beats <file>       # structure + TTS + pacing lint
node scripts/run.mjs --beats <file> --script-only   # print the narration and stop
```

The validator catches unknown actions, missing selectors, TTS problems (em
dashes, bare initialisms, run-on sentences), and pacing that won't fit the
target length.

`--script-only` is the money-saving review gate: it prints every beat's
narration with per-beat timing estimates and exits **before any ElevenLabs
call or recording**. Get the script approved here, then re-run without the
flag to spend credits.

## Step 2 — Instrument the page (developer mode)

Playwright needs stable selectors. With codebase access, add `data-vn`
attributes to the component JSX:

```tsx
<div data-vn="kpi-row" className="grid grid-cols-4 gap-4">
<Card data-vn="competitor-chart" ...>
```

Then reference them: `{ "fn": "hl", "sel": "[data-vn=kpi-row]" }`.

**Suppress interactive drilldowns while recording.** Clickable cards with
`role="button"` / `tabIndex={0}` can get auto-focused during highlights and
open a drawer mid-video. Gate them on your demo-mode flag:
`{!isDemoMode() && <MetricBreakdownSheet ... />}`.

If the app requires auth locally, either wire a demo mode (skip auth, fixture
data that matches the narration numbers exactly) or use an auth path from
`references/auth.md`.

**Note on CSP:** the recorder launches Chromium with `bypassCSP: true` so it
can inject `presenter.js` into strict-CSP pages. If you point it at a
production app with a live session, know that Content-Security-Policy is
disabled inside that automation browser context.

## Step 3 — One command

```bash
node scripts/run.mjs --beats <file>
```

That runs: validate → audio (cached by text hash) → **preflight** (headless
pass resolving every selector before anything is recorded) → record → captions
→ mux → verify. Output lands in `demo-video-out/<slug>/`:

- `<slug>-demo.mp4` — final video (H.264/AAC, soft caption track)
- `<slug>-demo-contact-sheet.png` — sampled frames for eyeballing
- `qa/beat-NN.png` — exact screenshot at each beat's hold point
- `captions.srt`, `audio/`, `video/recording.webm`

All flags: `--script-only` (print the narration script and exit before any
ElevenLabs call or recording — the review gate from Step 1),
`--preflight-only` (check selectors, spend nothing), `--skip-audio`
(visual-only changes — audio is reused), `--skip-preflight` (skip the headless
selector check — only when preflight just passed and nothing changed),
`--burn-captions` (hardcode subtitles into pixels for platforms that strip
tracks), `--no-captions`, `--out <dir>`, `--env <envfile>`.

## Step 4 — Verify before sending

`run.mjs` checks duration (MP4 = sum of audio within 0.5s), audio level (silent-track
detection), and drops QA screenshots. You still eyeball:

- Contact sheet + `qa/beat-NN.png`: each frame shows what its beat narrates —
  no login pages, error states, or surprise modals.
- First beat names the recipient; last beat delivers the CTA verbatim.

## Iterating

- Narration edit → re-run; only the changed beat's audio regenerates.
- Visual/pacing edit → `--skip-audio`.
- Selector broke → `--preflight-only` shows exactly which beat and selector.

---

## Known gotchas

- **Hot reload wipes the injected presenter.** Already handled — presenter
  re-injects before every beat. But avoid editing the app *while* recording.
- **Port drift.** `yarn dev` takes 3001 if 3000 is busy — update `baseUrl`.
- **Free vs paid voices.** Cloned/library voices throw `payment_required` on
  free tier. `doctor.mjs` catches this before render time.
- **i18n redirects.** `/en/dashboard` → `/dashboard` redirects are followed
  correctly; same-page beats don't re-navigate.
- **Delivery.** The MP4 is self-contained — email, Slack, LinkedIn DM, Notion
  embed, or import into Descript for a personal intro on top.
