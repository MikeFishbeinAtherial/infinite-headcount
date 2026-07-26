---
name: factory-handoff
description: Stage 4 of the Software Factory - walk the user through exactly what the coding loop will be told (a plain-language read-and-sign, minutes not an interview), then compile BRIEF.md + PLAN.md into factory/HANDOFF.md - one self-contained markdown file that runs as an overnight loop in Cursor or Claude Code. Encodes loop-engineering best practices - builder/checker roles, circuit breaker, on-disk state, restart permission, tier-gated tests. Triggers - "handoff", "get this ready for the loop", "factory handoff".
---

# Factory Handoff

The handoff document is the single artifact the overnight loop obeys. An error
in it costs a whole night, and nobody reads it while it runs — so this stage
has two jobs: **make the user actually read it** (in plain language, before
launch), and **make it self-contained** (the loop must never need to ask a
question, remember the chat, or interpret an ambiguity).

Requires `factory/PLAN.md` with acceptance criteria filled in. If criteria are
missing, stop and run `factory-tests` first — a handoff without proof is the
factory's one forbidden move.

## Part 1 — The contract walkthrough (read-and-sign)

Before writing HANDOFF.md, walk the user through what the loop will be told —
plain language, one screen per item, minutes not an interview:

1. **The goal** — one sentence, from the brief.
2. **The stages and tasks** — names only, with what exists after each stage.
3. **The contract** — the component-level assertions, summarized in groups
   ("6 about saving and loading, 4 about error messages, 2 about speed").
   Read the 3-5 most load-bearing ones aloud verbatim.
4. **The guardrails** — what the loop is forbidden from doing (below).
5. **The stop conditions** — when it declares victory, when it parks work,
   when the circuit breaker kills it.

Then ask: "Anything here that isn't what you meant?" Fix drift now — this
gate exists to catch the difference between what you said in the interview
and what got written down. On yes, proceed.

## Part 2 — Compile `factory/HANDOFF.md`

One markdown file, fully self-contained (inline the brief summary, the full
task list with criteria, and the contract — link nothing the loop would have
to go find). Structure:

````markdown
# HANDOFF: <project name>
compiled: <date> · source: factory/BRIEF.md + factory/PLAN.md

## How to launch (human instructions — the loop ignores this section)
Launch is two steps: **orientation** (while you're still at the keyboard),
then **begin**.
**Cursor:** open this project, start a new Agent chat, paste:
  "Read factory/HANDOFF.md fully. Do NOT start work yet. First: summarize
  the goal and plan back to me in 5 plain sentences, then ask me anything —
  questions, missing context, access you need — that would improve the
  result. If you have no questions, say so and why."
  Answer its questions, have it append the Q&A to this file's Orientation
  section, then say: "Begin. Execute this file exactly as written."
  Use a loop/background agent so it continues unattended. Enable auto-run
  (yolo) only if you accept it running commands without asking — the
  guardrails below are your protection.
**Claude Code:** same two steps, then
  `/loop work through factory/HANDOFF.md exactly as written`
  No `/loop`? It isn't part of stock Claude Code (loop-style plugins and
  skills exist but must be installed separately). Paste this instead:
  "Begin. Execute factory/HANDOFF.md exactly as written. Work the operating
  loop continuously — pick the next unfinished task, build it, verify it,
  record it in factory/progress.md and factory/log.md, then move straight
  to the next task without waiting for me. Only stop when a stop condition
  or circuit breaker in the file triggers; park questions in progress.md
  and keep going."
Machine must stay awake overnight (Mac: run `caffeinate -dims` in a spare
terminal).

## Orientation (executing agent: do this before your first pass)
A different model wrote this document than the one reading it. Before any
work: read this entire file, summarize your understanding to the human, and
ask for anything that would improve the result — unclear criteria, missing
context, credentials, how to run the app. Append every answer here:

### Orientation Q&A
<!-- executing agent: record each question and the human's answer here.
This file section is your memory of the answers — chat history won't
survive a restart. If you had no questions, write "None — <one line why>." -->

Mid-run: if you hit a genuine ambiguity this file doesn't answer, do NOT
guess silently — park the task with your question written in progress.md
and move on. Parked questions get answered by the human in the morning.

## Goal
<one paragraph. Then: "Done means every Contract assertion passes when run,
not when read.">

## Operating loop (follow exactly)
You are the BUILDER. Each pass:
1. GATHER: read factory/progress.md and this file's task list. Pick the first
   unfinished, unblocked task.
2. ACT: implement that one task only.
3. VERIFY: run the task's acceptance criteria plus all tier-1 and offline
   tier-3 tests. At stage boundaries, also run tier-2 (gated live) tests.
4. RECORD: update factory/progress.md (task status, attempt count) and append
   one line to factory/log.md: `## [date time] <task id> | <what happened>`.
5. Repeat. Assume you may be killed and restarted at any moment — the files
   are your only memory.

## Checker (independent verification)
When a task's criteria pass, verify as a CHECKER before marking done: re-run
the tests fresh and confirm the observable behavior directly (run the app,
hit the endpoint, load the page). If your tool supports subagents, spawn a
fresh one with only this file and the diff, instructed to try to PROVE the
task does NOT meet its criteria. The builder never gets the final vote on its
own work.

## Circuit breakers (hard limits)
- Same task fails verification 3 times → mark it PARKED in progress.md with
  what you tried, move to the next unblocked task. Never delete a parked
  task's criteria to make it "pass".
- 3 tasks parked, or every remaining task blocked → STOP. Write the summary
  and end the run.
- A tier-4 canary fails → it's the outside world, not your code. Log it,
  flag it in progress.md, never "fix" working code in response.
- Hard cap: <N> total passes or <time>, whichever first → stop and summarize.

## Restart permission
If an approach is truly unsalvageable, you may throw away uncommitted work on
the current task and rebuild it from this document. Log the restart. A
restart resets that task's failure count. Restarting a task is the loop
working; silently narrowing its criteria is the loop failing.

## Guardrails (never violate)
- Work only on branch `<branch>`. Never push to main. Never force-push.
- Commit after each task passes verification, message: `<task id>: <title>`.
- Never touch production data, apply migrations to shared databases, send
  emails/messages, or spend money beyond gated test runs.
- Never edit this file. Never delete or weaken an acceptance criterion — if
  one seems wrong, PARK the task with a note instead.
- Secrets stay in env files. Never print or commit them.

## Contract (component-level — final sign-off runs ALL of these)
<the 15-30 assertions from PLAN.md, verbatim>

## Tasks
<every task from PLAN.md verbatim: stages, criteria with tiers, test notes>

## When done
All contract assertions pass and the full test suite is green twice in a row
→ write `## RUN SUMMARY` at the top of factory/progress.md: outcome first,
then per-task status, parked items with reasons, and the exact commands a
human can run to see it work. End your final message to the human with the
baton pass, verbatim: "The build is done and self-checked. Next step: an
independent review that tries to break it — open Claude Code and run
/factory (or /factory-review). Don't skip it; I graded my own homework."
The same applies if you stopped early (circuit breaker, cap): say exactly
where things stand and that /factory is the next step either way.
````

Also create `factory/progress.md` (all tasks pending, attempt counts 0) and
`factory/log.md` (one creation entry) so the loop's first GATHER finds them.

## Part 3 — Pre-flight, then hand over

1. Run the existing test suite once. Red baseline → fix or quarantine before
   launch (a loop verifying against a broken baseline is noise all night).
2. Confirm the branch exists and is checked out.
3. Fill real values for `<branch>`, `<N>` passes (default 25), time cap
   (default "8 hours"), test commands.
4. Tell the user: HANDOFF.md is ready, here are the exact launch lines for
   Cursor (and the Claude Code alternative), machine must stay awake, and
   what they'll find in the morning (progress.md summary → then /factory to
   run the review). Warn them the agent will ask orientation questions
   first — that's by design: answer while you're there, the answers get
   written into the file, and only then tell it to begin.
5. Update `factory/STATE.md` → stage 5, next action "launch the loop, then
   /factory when it's done". If factory/STATE.md doesn't exist (standalone
   use), create it first with a minimal version of the schema described in
   factory/SKILL.md.

**Never launch the loop yourself. The human presses the button.**
