---
name: factory
description: Software Factory — the conductor. One command that walks a semi-technical or non-technical builder through the whole software assembly line - grill the idea sharp, plan it as tasks, define tests that prove each task works, hand off to an overnight coding loop, then review, prove it on video, and explain it in plain language. Reads factory/STATE.md to know where you are and always tells you what's next. Invoke as /factory in Claude Code or Cursor. Triggers - "factory", "software factory", "start a build", "what's next on my build".
---

# Software Factory

A software factory for people who don't write code by hand. You bring the idea
and the decisions; the factory brings the process: sharpen → plan → prove →
build overnight → verify → show. Every stage produces a file you can read, and
you never need to read code to know whether the thing actually works.

**The one rule that makes it work** (Karpathy: "if you can't evaluate it, you
can't auto-research it"): every task gets a test that proves it works *before*
any code is written. The overnight loop can run unattended because proof lives
outside the agent's own opinion of itself.

This skill is the **conductor**. It never does stage work itself — it reads
the state file, tells you where you are in plain language, and runs (or offers)
the right stage skill. Each stage skill also works standalone.

## The assembly line

| # | Stage | Skill | What you get |
|---|---|---|---|
| 1 | Sharpen the idea | `factory-plan` (intake) | `factory/BRIEF.md` — what we're building and why |
| 2 | Plan the tasks | `factory-plan` | `factory/PLAN.md` — staged task list |
| 3 | Define the proof | `factory-tests` | acceptance criteria + tests attached to every task in PLAN.md |
| — | *(offer)* Explain the plan like I'm 10 | `factory-explain` | `factory/GUIDE.md` section + diagrams |
| 4 | Walkthrough + handoff | `factory-handoff` | `factory/HANDOFF.md` — the one markdown file you give the coding loop |
| 5 | The loop builds it | Cursor loop / Claude Code `/loop` (if you have a /loop command; otherwise see factory-handoff for a paste-in loop prompt) | code + `factory/progress.md` + `factory/log.md` |
| 6 | Fresh-eyes review | `factory-review` | `factory/REVIEW.md` — did it really meet the contract? |
| 7 | Proof video | `auto-loom-proof` | narrated MP4 of the app passing its own acceptance criteria |
| — | *(offer)* Explain what got built like I'm 10 | `factory-explain` | updated `factory/GUIDE.md` |

## State: `factory/STATE.md`

Everything the factory knows about a project lives in a `factory/` folder in
the project root — never in chat history. `STATE.md` is the pointer:

```markdown
# Factory State
project: <name>
stage: <1-7 or "done">
stage_name: <plain-language name>
last_updated: <YYYY-MM-DD HH:MM>
next_action: <one sentence — what happens next and which skill runs it>
notes: <anything the next session must know>
```

Update STATE.md at every stage transition. The crash test: a brand-new session
(or a different tool — Claude Code today, Cursor tomorrow) must be able to
read `factory/STATE.md` and continue without asking the user to re-explain.

## When /factory is invoked

1. **Look for `factory/STATE.md`** in the project root.
2. **Not found** → new project. Say what the factory is in two sentences,
   create `factory/` and STATE.md at stage 1, then run the intake interview
   (`factory-plan`).
3. **Found** → read it, then tell the user in plain language: where the build
   stands, what stage is next, and what it involves. Then **ask before
   running it** — one question, e.g. "The loop finished — next is a fresh-eyes
   review of what it built. Want me to run it?"
4. **Stage 5 special case** (loop running/pending): if HANDOFF.md exists but
   progress.md shows incomplete work, ask whether the loop already ran.
   - Not yet → point them at the launch instructions at the top of HANDOFF.md.
   - Ran and finished → advance to stage 6 and offer the review.
   - Ran and got stuck → read `factory/progress.md` and `factory/log.md`,
     explain in plain language where it stopped and why, and offer either a
     relaunch (same HANDOFF.md) or a trip back to stage 2/3 if the *plan* was
     the problem.
5. After any stage completes, update STATE.md and name the next stage.

## Conductor rules

- **Plain language always.** The user may not know what a "diff", "worktree",
  or "CI" is. Say "a safe copy of your project" instead of "worktree". Every
  time a technical term is unavoidable, define it in the same sentence.
- **One question at a time.** Never present a wall of questions or options.
- **Decisions are the user's; facts are yours.** Look up anything discoverable
  in the project before asking. Only decisions get asked.
- **Never skip stage 3.** A task list without acceptance criteria is the #1
  cause of an overnight loop producing confident garbage. If the user wants to
  rush to code, explain the one rule above — then let them decide.
- **Never launch the overnight loop yourself.** Stage 4 ends with launch
  instructions; the human presses the button.
- **Offer, don't force, the explainer.** After stage 3 and after stage 6,
  offer `factory-explain`. It's the fastest way for a non-technical builder to
  catch a wrong plan before it costs a night.
- **Re-entry from anywhere.** If the user invokes a stage skill directly and
  it completes, that skill updates STATE.md — the conductor trusts the file,
  not its memory.

## Why this exists (the loop-engineering canon, condensed)

- **Karpathy:** if you can't evaluate it, you can't automate it. Tests first.
- **Boris Cherny (creator of Claude Code):** "I don't prompt anymore — I write
  loops." A loop = builder + checker passing work back and forth until clean,
  with a circuit breaker so failure can't run all night.
- **Thariq Shihipar (Claude Code eng lead):** every agent turn is gather
  context → act → **verify** → repeat. Write the verifier before you scale the
  generator.
- The factory is those ideas packaged so you don't have to hold them in your
  head: stage 3 writes the verifier, stage 4 writes the loop, stage 6 is the
  independent checker.

## Install (both tools, all projects)

Copy the `factory*` and `auto-loom*` skill folders into:

- Claude Code: `~/.claude/skills/`
- Cursor (2.4+): `~/.cursor/skills/`

Then `/factory` works in any project in either tool. Per-project install also
works: `.claude/skills/` or `.cursor/skills/` inside the repo.
