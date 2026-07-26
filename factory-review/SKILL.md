---
name: factory-review
description: Stage 6 of the Software Factory - the fresh-eyes review after the overnight loop says "done". Reads ONLY the contract and the code changes (never the loop's chat or reasoning), re-runs every acceptance criterion, and actively tries to prove the build does NOT meet the contract. Reports in plain language - what's solid, what's broken, what was quietly skipped. Escalates genuine open decisions back to the user; everything else is verified fact. Triggers - "review the build", "did the loop actually finish", "factory review".
---

# Factory Review

The loop that built the code cannot be the judge of it — a model grading its
own work turns agreeable, and an overnight run that "passed everything"
sometimes passed a quietly narrowed version of everything. This skill is the
independent checker: fresh eyes, adversarial stance, contract in hand.

**Identity rule:** work ONLY from `factory/HANDOFF.md` (the contract and
tasks), `factory/progress.md` (the loop's claims), and the actual code and
diff. Never read the loop's chat transcript or reasoning — you're grading
the artifact, not the story about it.

**Run this fresh.** Start a new context window for the review, and if
possible run it on a different model than the one that did the handoff and
execution loop — a model that already reasoned its way to "done" is a worse
judge of its own work than one seeing the contract and the diff for the
first time.

## Procedure

1. **Read the claims.** progress.md: which tasks claim done, which are
   parked, what the run summary says.
2. **Audit the contract for tampering.** Diff HANDOFF.md and the criteria in
   progress.md against what stage 4 compiled. Any weakened, deleted, or
   "reinterpreted" criterion is a top-severity finding.
3. **Re-run everything yourself.** Full suite, every contract assertion,
   tier-2 live tests (with the gate var). Never trust green checkmarks in
   progress.md — trust output you produced. Run the suite **twice** — a
   test that passes once and fails once is a finding (flaky tests are how
   broken builds sneak through overnight loops).
4. **Try to break it.** For each contract assertion, ask "how could this pass
   the test but still fail the user?" and probe: empty input, double-click,
   refresh mid-action, wrong file type, the error paths. Run the app like a
   real (impatient) user for 10 minutes.
5. **Check the parked list.** Is each parked task genuinely blocked, or
   parked to hit the stop condition? Anything parked that the contract's
   top assertions depend on = the build is NOT done, whatever the summary
   says.
6. **Scan the diff for landmines**, explained in plain language: secrets in
   code ("your password is written inside the code where anyone can see
   it"), TODO/stub implementations behind passing tests, dependencies added
   for no clear reason, files changed far outside the tasks' scope.
7. **Run a code-level review too, if available.** This skill grades
   *contract compliance* (does it do what was promised); a code-review tool
   grades *code quality* (bugs, edge cases, security in the implementation
   itself). If the environment has one — `/code-review` in Claude Code, or
   a review agent — run it on the loop's diff and fold its confirmed
   findings into the findings list below. The two reviews catch different
   failure classes; neither substitutes for the other.

## Output: `factory/REVIEW.md`

```markdown
# Review: <project> — <date>
## Verdict
SHIP | FIX FIRST | NOT DONE — <one plain-language paragraph>

## What I verified myself
<per contract group: ran what, saw what>

## Findings (worst first)
### 1. <plain-language title>
- what happens: <observable behavior>
- how I proved it: <command/action + output>
- severity: blocks shipping | should fix | cosmetic
- suggested next step

## Parked work
## Decisions for you
<ONLY genuine open decisions — tradeoffs the contract doesn't answer.
Not bugs (those are findings). Each with a recommendation.>
```

Walk the user through it verdict-first, in plain language. Every finding
must carry its proof — this skill never reports vibes.

## Escalation rule

Bugs and contract violations are **findings** — facts, no user decision
needed. A **decision** escalates only when the contract genuinely doesn't
answer it (an ambiguity both readings of which pass the tests, a tradeoff
the build surfaced, scope discovered mid-build). If any exist, offer a short
grilling-style session — one question at a time, recommendation attached —
and route the answers: contract change → note in HANDOFF.md + new criteria
via `factory-tests`; new work → new tasks via `factory-plan`.

## Close out

If factory/STATE.md doesn't exist (standalone use), create it first with a
minimal version of the schema described in factory/SKILL.md.

- **FIX FIRST / NOT DONE** → offer a fix list formatted as a mini-handoff
  (same operating loop, criteria = the findings' proofs) for one more loop
  run. Update STATE.md → stage 5 (loop again).
- **SHIP** → update STATE.md → stage 7, next action "proof video with
  auto-loom-proof". Offer `factory-explain` — "want me to explain what got
  built, like you're 10?" — the post-build explainer is how the user actually
  comes to own what they now have.
