---
name: factory-plan
description: Stages 1-2 of the Software Factory - a relentless one-question-at-a-time interview that sharpens a loose idea into a brief (factory/BRIEF.md), then breaks the brief into a staged, dependency-ordered task list (factory/PLAN.md). This is the skill that CREATES the task list. Built for semi-technical and non-technical builders - plain language, a recommendation with every question. Use standalone or via /factory. Triggers - "plan my build", "turn this idea into tasks", "factory plan".
---

# Factory Plan

Two jobs, in order: **sharpen the idea** (intake interview → BRIEF.md), then
**break it into tasks** (PLAN.md). The task list created here is the spine of
everything downstream — `factory-tests` attaches proof to each task,
`factory-handoff` compiles them into the loop document, `factory-review`
grades the build against them.

A loose idea handed straight to a coding loop doesn't get built — it gets
*interpreted*, all night, by an agent that can't ask you anything. This stage
exists so every ambiguity dies while it's still cheap.

## Part 1 — Intake interview (stage 1)

Interview protocol (adapted from Matt Pocock's grilling technique):

- **One question at a time.** Multiple questions at once are bewildering.
  Wait for the answer before the next question.
- **Every question comes with your recommended answer** and one line on why.
  The user can accept in two words or push back.
- **Facts are yours, decisions are theirs.** If the answer is discoverable —
  in the existing codebase, package.json, a README — look it up instead of
  asking. Only genuine decisions go to the user.
- **Plain language.** No jargon without an in-sentence definition.
- **Walk the design tree in dependency order.** Settle what shapes everything
  else first: who it's for → what done looks like → what's explicitly out →
  platform/data realities → the risky unknowns.

Cover, at minimum:

1. What are we building, in one sentence a 10-year-old would understand?
2. Who uses it, and what do they walk away with?
3. What does "done" look like — what would you *do* with it the morning it
   works? (This becomes the top-level acceptance test.)
4. What is explicitly NOT in this version? (Scope creep is what kills
   overnight runs.)
5. New project or existing codebase? (If existing: read it now — stack, test
   command, how it runs — and confirm your findings in one summary line.)
6. Anything that touches the outside world? (Payments, logins, emails, other
   people's APIs — each one is a risk to flag, not a reason to stop.)
7. What's the riskiest or least-clear part, in their view?

Stop when you can write the brief without guessing. Usually 6-12 questions.

### Output: `factory/BRIEF.md`

```markdown
# Brief: <project name>
date: <YYYY-MM-DD>

## What we're building
<2-4 sentences, plain language>

## Who it's for and what they get
## Done looks like
<the morning-it-works test, as concrete behavior>

## Not in this version
## Facts (discovered, not asked)
<stack, commands, existing structure — with file paths>

## Decisions made
<one line per interview decision — this is the record the loop can't reinterpret>

## Open risks
```

Read the brief back in 3-4 sentences and get an explicit yes before Part 2.

## Part 2 — Break the brief into tasks (stage 2)

Rules for a task list a coding loop can actually execute:

- **Each task is one loop pass**: a coding agent should finish it, test it,
  and commit it in a single focused session. Too big → split. "Build the
  dashboard" is a stage; "show the list of saved items on the dashboard page"
  is a task.
- **Each task names observable behavior**, not code structure. "User can save
  an item and see it after refresh" — never "create ItemService class".
- **Dependency order, staged.** Stage A must produce something runnable, even
  if ugly. Every later stage keeps the app runnable. A loop that can always
  run the app can always verify itself.
- **Walking skeleton first.** Task 1 is always: the thinnest end-to-end slice
  that proves the stack works (one page, one action, one saved thing).
- **Flag the risky tasks** (`risk: high` — external APIs, auth, payments, data
  migrations) so the handoff can order or gate them sensibly.
- **6-20 tasks** for a typical build. Fewer means tasks are too big; more
  means scope is too big for one overnight run — say so and propose cutting
  scope, not compressing tasks.

### Output: `factory/PLAN.md`

```markdown
# Plan: <project name>
brief: factory/BRIEF.md
date: <YYYY-MM-DD>

## Stage A — <plain-language stage name>

### A1. <task title — observable behavior>
- what: <1-3 sentences>
- proves: <which part of "done looks like" this serves>
- risk: low | medium | high (<why, if not low>)
- acceptance criteria: _pending factory-tests_

### A2. ...

## Stage B — ...
```

`acceptance criteria: _pending factory-tests_` is a deliberate hole —
**factory-tests fills it**. There is no separate task-creation skill: plan
creates the tasks, tests make them provable.

## Close out

1. Walk the user through the plan in plain language — stages, what exists
   after each, which tasks are risky and why. One screen, not a wall.
2. Update `factory/STATE.md` → stage 3, next action "define acceptance
   criteria with factory-tests". If factory/STATE.md doesn't exist
   (standalone use), create it first with a minimal version of the schema
   described in factory/SKILL.md.
3. Offer the two next moves: run `factory-tests` now (recommended), or
   `factory-explain` first if they want to *see* the plan as a picture before
   committing to it.
