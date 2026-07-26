---
name: factory-explain
description: Explain a codebase or build plan like the listener is 10 years old - household analogies, mermaid diagrams, zero unexplained jargon. Two factory checkpoints (after planning - "here's what we're about to build"; after review - "here's how what got built actually works") plus standalone on any codebase. Explanations accumulate into factory/GUIDE.md, a plain-language owner's manual. Understanding is a first-class output of the factory, not a byproduct. Triggers - "explain like I'm 10", "how does this codebase work", "what did we just build", "factory explain".
---

# Factory Explain

Giving the user real understanding is what separates owning your software
from renting it from an AI. This skill explains what's being built — or what
got built — so a smart 10-year-old would follow it: pictures first, analogies
always, jargon never.

Three modes:

- **Pre-build** (factory stage 3→4): explain the *plan* — what we're about to
  build and how the pieces will fit. The cheapest moment to catch "wait,
  that's not what I meant."
- **Post-build** (after factory-review): explain what *actually got built* —
  how it works now that it's real, including anything that changed from plan.
- **Standalone**: point at any codebase or folder — "explain this like I'm
  10" — no factory state needed.

## Rules of explanation

1. **Analogy before mechanism.** Every component maps to something from
   ordinary life — the database is a filing cabinet, the API is a waiter
   carrying orders to the kitchen, the queue is a take-a-number machine at
   the deli. Pick ONE coherent scene per explanation (one restaurant, one
   post office) rather than mixing metaphors.
2. **Picture before paragraph.** Lead every section with a mermaid diagram;
   prose explains the picture, not the other way around.
3. **Zero unexplained jargon.** Every technical term gets defined in the same
   sentence, in parentheses, or doesn't appear.
4. **Follow one thing through the system.** The spine of the explanation is a
   story: "here is what happens, step by step, when you click Save" — from
   the click to the stored data and back to the screen.
5. **Honest, not dumbed down.** Simplify the language, never the truth. If
   something is fragile or was parked, the explanation says so plainly.
6. **End with "what you can now say."** Three sentences the user could
   repeat to a technical person that would be accurate — that's the test of
   whether understanding transferred.

## Structure of one explanation

```markdown
## <Title: "What we're about to build" | "How <project> works">
### The whole thing in one picture
<mermaid flowchart: 5-9 boxes MAX, plain-language labels — "Saves your
items", never "ItemService". More boxes = zoom out further.>
### The cast of characters
<each box: what it does, its analogy, where it lives (folder/file)>
### Follow one click through the system
<the sequence story — mermaid sequenceDiagram if it earns it>
### The parts most likely to confuse you
<2-3 honest gotchas in plain language>
### What you can now say
<the three accurate sentences>
```

Diagram hygiene: quote node labels, keep them under ~6 words, direction
top-down for structure and left-right for flows. If the user's setup has a
mermaid renderer skill available, offer a rendered image; otherwise the
fenced blocks preview fine in Cursor and most markdown viewers.

## Accumulate into `factory/GUIDE.md`

In factory modes, every explanation is appended to `factory/GUIDE.md` (create
with a one-line intro if missing): pre-build sections under
`# Part 1 — The plan, explained`, post-build under `# Part 2 — What got
built, explained`, dated. Post-build explanations that supersede a plan
section get one honest line: "We planned X; we ended up with Y because Z."
Over time GUIDE.md becomes the plain-language owner's manual for the
codebase — the file you point a collaborator (or future you) at first.

## Interactive close

End every explanation with: "Which part should I zoom into?" — then explain
that part one level deeper, same rules, same analogy scene. Depth on demand
beats length by default.

In factory mode, update STATE.md's notes line ("plan explained to user
<date>" / "build explained <date>") — the conductor uses it to avoid
re-offering what's already been done. If factory/STATE.md doesn't exist
(standalone use), create it first with a minimal version of the schema
described in factory/SKILL.md.
