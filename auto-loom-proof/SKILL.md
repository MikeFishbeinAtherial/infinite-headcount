---
name: auto-loom-proof
description: Stage 7 of the Software Factory - the proof video. Turns a build's acceptance criteria into a narrated MP4 - Playwright drives the real app criterion by criterion while a voice explains what's being proven, plus one beat showing the rendered test results. "Watch your software pass its own exam" for people who won't read test output. Thin entry point over the auto-loom engine (requires the auto-loom skill as a sibling folder). Triggers - "proof video", "show me it works", "prove the build".
---

# Auto-Loom Proof

Test output convinces engineers. A video of the real app doing each thing it
promised — while a voice explains what's being proven — convinces everyone
else, including the person who paid for the overnight run. This skill turns
acceptance criteria into that video.

**Engine:** all recording machinery comes from the sibling `auto-loom` skill
(ElevenLabs narration + Playwright driving + ffmpeg mux), installed next to
this one — engine paths below are relative to this skill's folder. **First
check:** if `../auto-loom/` does not exist next to this skill, stop and tell
the user the auto-loom skill is required. Install auto-loom first and run its
setup (`bash ../auto-loom/scripts/setup.sh`) + `../auto-loom/scripts/doctor.mjs`
(no ElevenLabs account yet? use the maintainer's referral link:
https://try.elevenlabs.io/atherial).
This skill only decides *what to show and say*; consult the engine's
`../auto-loom/references/` for beat actions, selector rules, TTS rules, and
auth.

## Inputs

- **Factory mode** (default): `factory/HANDOFF.md` (the contract + criteria)
  and `factory/REVIEW.md` (verify verdict is SHIP — proving an unreviewed
  build puts a narrated stamp on unverified claims; warn and get explicit
  consent if the user insists).
- **Standalone**: any list of acceptance criteria (or even a feature list)
  plus a running app URL.
- The app running locally (or a URL), with codebase access for selector
  instrumentation (`data-vn` attributes — see engine developer mode).

## Step 1 — Choose what goes on camera

From the contract, select **5-9 criteria** that are *visible in a browser* —
a person can watch them happen. Prioritize:

1. The "done looks like" behavior from the brief — the morning-it-works test
   (always the opening beat).
2. The riskiest tasks that passed (`risk: high` in the plan) — proof matters
   most where doubt was highest.
3. One **error path** — the app refusing bad input gracefully is the most
   trust-building thing a non-technical owner can watch.

Tier-1 logic tests and API-only criteria don't film well — they're covered by
the test-results beat instead. List the chosen criteria to the user with one
line each on why, before building anything.

**Never perform a real side-effecting action on camera.** A criterion like
"given valid card details, payment succeeds" or "clicking delete removes the
account" must NOT be executed live during recording — that's a real charge,
a real send, a real destructive delete. Before filming any such criterion,
check: is there a test/sandbox mode, a seeded fixture account, or a
dry-run flag? Use that. If none exists, don't perform the action at all —
narrate over a screenshot of the already-passed test instead, and say so
plainly ("this one's shown from the test results, not performed live, since
it would [charge a real card / send a real email]"). When in doubt, ask the
user before recording, not after.

## Step 2 — Render the test results as a page

The engine films web pages, so put the suite's verdict on one:

1. Run the full test suite; capture the output.
2. Write `factory/proof/test-results.html` — self-contained, no external
   assets: big pass/fail count up top, per-contract-group rows with green
   check / red cross, run date, and the exact command used. Readable from
   two meters away; this page is on camera.
3. Getting it in front of the engine's browser, in order of preference:
   serve the app's own static folder if it has one (`public/`), else serve
   `factory/proof/` with a one-line static server on a spare port, else use
   a full `file://` or absolute URL as the beat's page — check the engine's
   `../auto-loom/schema/beats.schema.json` and
   `../auto-loom/references/actions.md` for what the `page` field accepts,
   and run `node ../auto-loom/scripts/validate.mjs` early to find out cheaply.

If any tests fail, stop — this is a proof video, and filming a red suite
means the factory should be back at review, not in the studio.

## Step 3 — Storyboard: one criterion per beat

Follow the engine's beat format and TTS rules, with one override: set
`{"voice":{"settings":{"stability":0.8}}}` (the Robust band — see
`../auto-loom/references/voices.md` → Model). ElevenLabs' own docs call the low/expressive end of
this setting "prone to hallucinations" — an ad-libbed word is a bigger
problem in a video whose entire job is proving specific claims than a flatter
delivery is. Skip audio tags entirely here for the same reason; save them
for `auto-loom`'s other, non-proof use cases.

Structure:

- **Beat 1 — the promise:** open on the app's main screen. Narration: what
  this software promised to do, in one sentence from the brief.
- **Beats 2..N — one criterion each:** Playwright *performs the criterion's
  "when"* (clicks, types, submits — real actions, not just scrolling past
  the feature) and the result stays on screen as the narration lands.
  Narration formula, plain language:
  "The contract says: <criterion, paraphrased simply>. Watch." →
  action happens → "There it is — <what just appeared/changed>."
- **Error-path beat:** feed it the bad input on camera. "And when someone
  enters the wrong thing? No crash — it says exactly what's wrong."
- **Test-results beat:** the rendered page. "Beyond what you just watched,
  <N> automated checks run behind the scenes. All green, as of <date>."
- **Closing beat:** back to the main screen. "<N> promises made, <N> shown
  working. This build is verified." (CTA per the user's context.)

Get the narration script approved verbatim before spending on audio — engine
rule, doubly true here because narration makes *claims*: every sentence must
be literally true of what's on screen in that beat. Never narrate a
criterion the video doesn't actually perform.

## Step 4 — Instrument, validate, record

Add `data-vn` selectors where beats need them (engine developer mode), then
the engine's standard pipeline: `node ../auto-loom/scripts/validate.mjs` →
fix → `node ../auto-loom/scripts/run.mjs`. Output lands per engine config;
copy/link the final MP4 into `factory/proof/`.

## Step 5 — Trust the engine's verify step, then spot-check

`../auto-loom/scripts/run.mjs` ends with its own automated verify: duration
match, audio level
(flags a near-silent track — mean_volume around −91dB means the mux mapped
the wrong stream), a contact sheet, and captions — printing
`FAIL: N verification check(s) failed` if anything's wrong. **A FAIL here
blocks the proof video** exactly like a failed test blocks a "done" build —
don't hand over an MP4 the engine itself flagged as broken; fix and re-run
before anything else.

Once the automated verify passes, do one human spot-check the engine can't
run for you: watch the first, one middle, and the last beat, confirming the
visual on screen actually matches what the narration claims — the engine
proves the *file* is well-formed, not that beat 4 is showing the criterion
beat 4 claims to show.

## Close out (factory mode)

Update `factory/STATE.md` → done, notes: "proof video at
factory/proof/<file>.mp4, <N> criteria shown, verify passed". Tell the user
where the video is and offer the last stop on the line: `factory-explain`,
if they haven't run the post-build explainer yet.
