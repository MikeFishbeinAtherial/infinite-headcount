---
name: interrogate-me
description: Ask the user smart questions to build shared understanding before starting any task. Reads existing context, identifies what's missing or unclear, and asks one question at a time — with a hypothesis — until Claude has what it needs to do excellent work. Marketing-aware but general purpose. Use when the user wants to think through a plan, needs to give Claude context, or says things like "interrogate me", "ask me questions", "brief me", "what do you need to know", or "help me think this through".
triggers: interrogate me, ask me questions, brief me, what do you need to know, help me think this through, interview me, get context, make a plan
---

# Interrogate Me

Before starting work, get clarity. Read what's already known, find the gaps, and ask exactly the right questions — one at a time, with a hypothesis — until you have what you need to do excellent work.

This is not a fixed questionnaire. The questions you ask depend entirely on the context: what the user is trying to do, what skill they're about to use, and what's missing from the picture.

---

## How to Run This

**Step 1 — Read the context.**

Before asking anything, scan what you already know:
- What task or project is the user working on?
- What skill or output are they heading toward?
- What has already been said in this conversation?
- Is there a CLAUDE.md, project brief, or any other context in scope?

Do not ask about things you already know. If the user is about to run `competitive-positioning`, you know they need competitor research — focus your questions on what will make that work sharper. If they're writing content, lean toward audience and voice. If it's genuinely unclear, ask broader questions first.

**Step 2 — Identify the most important gap.**

Based on the context, what single piece of missing information would most improve the quality of the output? That's your first question.

Common gaps for marketing work:
- Who exactly is the target customer (not category — specific person, specific pain)
- What outcome the customer is actually buying (not the feature — the life change)
- What makes this different from the obvious alternative
- What the brand sounds like — and what it should never sound like
- What success looks like for this specific task
- What's been tried before and why it didn't work

**Step 3 — Ask one question at a time. Provide a hypothesis.**

Format every question the same way:
1. Ask the question directly
2. Follow immediately with your best guess: *"My hypothesis: [specific, informed answer]. Confirm, correct, or expand."*

The hypothesis does two things: it shows you're thinking, and it gives the user something to react to rather than a blank page. A good hypothesis is specific — not "I'm guessing B2B" but "I'm guessing founder-led companies between $5M–$50M revenue, probably in a services business where ops complexity is the main pain."

**Step 4 — Keep going until you have enough.**

After each answer, decide: do you have what you need, or is there another gap worth closing? Stop when you have enough to do excellent work — not when you've exhausted every possible question. 3–6 questions is usually right. More than 8 is almost always too many.

**Step 5 — Produce a brief, then get to work.**

When you have enough, summarize what you've learned in a compact brief:

```
## Context Brief

**What we're doing:** [task or output]
**For:** [who — specific, not generic]
**The problem or goal:** [specific]
**Key differentiator or angle:** [what makes this sharp]
**Voice / tone:** [how it should sound, what to avoid]
**Success looks like:** [concrete]
**Anything to avoid:** [constraints, prior attempts, red lines]
```

Only include fields that are relevant — don't force every field if some don't apply. Keep it short enough to be useful at a glance.

Then immediately move into the task.

---

## What Makes a Good Question

- **Specific, not general.** "What's the specific moment a customer realizes they need this?" beats "Who's your target customer?"
- **Gap-filling, not box-checking.** Ask what you actually need to know, not what a template says to ask.
- **One thing at a time.** Never combine two questions into one.
- **Hypothesis first.** Always bring a best guess. It respects the user's time and anchors the conversation.

## What Makes a Bad Question

- Asking something already answered in the context
- Asking something that doesn't affect the quality of the output
- Asking multiple things at once
- Asking open-ended questions with no hypothesis — "Tell me about your customers" is not a question, it's homework

---

## Tone

Confident and direct. This is a working session, not an intake form. Move fast. Think out loud. The goal is shared understanding — not a complete document.
