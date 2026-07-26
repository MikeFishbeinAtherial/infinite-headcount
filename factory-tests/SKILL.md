---
name: factory-tests
description: Stage 3 of the Software Factory, and a standalone skill - turn tasks, features, or a whole component into acceptance criteria and tests that PROVE the work is correct, so a coding loop can check itself instead of asking you to trust it. Behavior + evidence formula, four test tiers, mandatory error paths. Works on a factory PLAN.md, a single task, or any feature description. Triggers - "define tests", "acceptance criteria", "how do I know it works", "factory tests".
---

# Factory Tests

The factory's one rule: **if you can't check it by running something, it isn't
done — it's a hope.** This skill turns "build X" into "build X, and here is
the command and the observable result that proves X works," so an unattended
coding loop can grade itself honestly all night.

Three ways in:

- **Factory mode** (default via /factory): read `factory/PLAN.md`, fill every
  task's `acceptance criteria: _pending factory-tests_` hole, add a
  component-level contract at the top.
- **Single task/feature**: user describes one thing ("the login form",
  "task B3") → produce criteria + tests for just that.
- **Whole component/app**: produce the component-level contract — the 15-30
  assertions that define done for the entire build.

## The formula: behavior + evidence

Every acceptance criterion is one sentence with three parts — the setup, the
action, the observable result:

> **Given** <input/state>, **when** <command or user action runs>,
> **then** <something you can see or measure is true>.

- Bad: "Handles Instagram URLs." "Login works." "Handles errors gracefully."
- Good: "Given a public Instagram reel URL, when the CLI runs, then it exits
  successfully and the report folder contains report.md and a video file."
- Good: "Given a wrong password, when the user submits the login form, then
  they see 'wrong email or password' and are NOT taken to the dashboard."

If a criterion doesn't name the action and the observable, a verifier will
rubber-stamp it. Rewrite until it does.

**For non-technical users:** criteria are written in plain language first —
you should be able to read every criterion and picture yourself checking it
by hand. The test code that automates the check is the loop's job, not yours.

## The four test tiers (organize by cost + trustworthiness)

Tag every criterion with a tier. The tier decides *when it runs* during the
overnight loop — this line goes verbatim into the handoff:

| Tier | What | When the loop runs it | Example |
|---|---|---|---|
| **1 — Offline** (free, always trustworthy) | Pure logic: parsers, calculators, formatters, validation. Golden tests (known input → exact expected output, saved to a file). All error paths. | **Every pass.** | "Given the URL `youtu.be/abc`, the router returns source=youtube, id=abc." |
| **2 — Live, gated** (costs pennies or minutes) | Your code against real external services, switched on by an env var (e.g. `RUN_LIVE=1`). Fixtures you control — your own uploads, your own test account. Never random public URLs. | **End of each stage** + once before final sign-off. | "Given the 5-second fixture video, when transcription runs live, then the output is schema-valid with timestamps inside the video's duration." |
| **3 — End-to-end smoke** (cheap, catches wiring) | One run of the real thing: CLI on a fixture file, one API round-trip, one page load + action in a real browser. | **Every pass** if offline; stage ends if it needs live services. | "When the CLI runs on fixture.mp4, then the report folder appears with all expected files." |
| **4 — Canary** (tests the world, not your code) | Is the external dependency itself still alive and unchanged? | **Never blocks the loop.** Failure = log it, flag it, move on. An agent "fixing" your working code at 2am because some platform changed something will wreck the codebase. | "yt-dlp can still download from YouTube today." |

## Error paths are not optional

An unattended loop lives in the error paths — wrong input, dead URL, empty
file, timeout, someone clicking the wrong button. For every task, write at
least one criterion for the most likely failure, with the exact expected
behavior ("shows message X", "exits with code 2", "creates nothing"). A
contract that only describes the happy path will pass review and then die on
first contact with a real user — you.

## Testing AI/LLM output (when the build calls a model)

Exact-match tests don't work on model output. Assert **properties** instead:
the output matches the expected schema, values are in legal ranges
(timestamps inside the video, prices non-negative), required parts are
non-empty. For *quality* ("is this summary good?"), write a short rubric —
2-4 axes, a named good example, a 0-1 threshold — and have a fresh agent
grade against it. Properties gate correctness; the rubric gates taste.

## Component-level contract

Above the per-task criteria sits the whole-build contract: **15-30 assertions**
that define done for everything (fewer gets rubber-stamped). Sources: the
brief's "Done looks like" section, every task's criteria rolled up, the error
paths, and 2-3 assertions nothing else covers (performance floor, data never
lost on refresh, works in the browser the user actually uses).

## Output

Factory mode edits `factory/PLAN.md` in place:

```markdown
### A1. <task title>
- ...
- acceptance criteria:
  - [tier 1] Given ..., when ..., then ...
  - [tier 1, error] Given ..., when ..., then ...
  - [tier 3] Given ..., when ..., then ...
- test notes: <where tests live, fixtures needed, gate var if tier 2>
```

...and adds `## Contract` (the component-level assertions) at the top of
PLAN.md. Standalone mode outputs the same shapes to chat or the file the
user names.

Two standing rules to embed wherever the criteria go:

1. **Every bug found later gets a criterion here first**, then the fix. The
   contract grows to match reality.
2. **The builder never grades its own work** — criteria are checked by
   running them, and final judgment belongs to a fresh reviewer
   (factory-review) that never saw the code being written.

## Close out (factory mode)

Update `factory/STATE.md` → stage 4, next action "walkthrough + handoff with
factory-handoff". If factory/STATE.md doesn't exist (standalone use), create
it first with a minimal version of the schema described in factory/SKILL.md. Offer `factory-explain` — with plan and proof now written,
this is the ideal moment for the user to *see* the whole build as a picture
before it costs a night of compute.
