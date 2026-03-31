---
name: interrogate-me
description: Run a focused marketing context interview to give Claude what it needs to do great work. Covers the business, ideal customer, differentiator, and brand voice in 8 questions. Use this before any marketing task when Claude doesn't have enough context — content, copy, campaigns, strategy, or positioning. Trigger when the user says "interrogate me", "interview me", "brief me", "ask me questions", or when you need context before starting a task.
triggers: interrogate me, interview me, brief me, ask me questions, get context, marketing intake, onboard me, what do you need to know
---

# Interrogate Me

Get the context needed to do sharp marketing work. Eight questions. One at a time. For each, offer a best-guess hypothesis — the user confirms, corrects, or adds detail.

Skip any question already answered by context in the conversation.

At the end, produce a compact Marketing Brief the user can save for future sessions.

---

## The Questions

### Q1 — What You Do
"In one sentence: what does [company/product] do, and who is it for?"

*Hypothesis: "[Company] helps [type of person] [achieve outcome] by [doing what]." — confirm or rewrite.*

### Q2 — The Problem
"What specific situation is the customer in right before they find you? Not the category-level problem — the frustrating, specific moment."

*Hypothesis: Frame it from the customer's perspective. The more specific, the more useful for copy.*

### Q3 — Ideal Customer
"Who is the person who actually buys? Job title, company type, size. And what's the trigger — what just happened in their world that made them start looking?"

*Hypothesis: Offer a specific profile based on what you know. Ask them to adjust it.*

### Q4 — What Makes You Different
"What can you credibly claim that your closest competitor can't? Not aspirationally — right now, specifically."

*If they struggle, ask: "What do customers say when they refer you? What's the thing they mention first?"*

### Q5 — What Customers Say
"What exact words or phrases do your best customers use when they describe what you do for them? Quotes, reviews, testimonials — anything verbatim."

*This is the most useful question for copy. Their language beats your language every time.*

### Q6 — Brand Voice
"Three adjectives that describe how you sound. And one brand or person whose voice you admire — what do you like about it?"

### Q7 — What to Avoid
"Words, phrases, or tones that make you cringe when you see them in competitor copy. What does bad sound like in your space?"

### Q8 — What We're Working On
"What's the specific task you want to tackle today? And what does a great output look like — format, length, channel, audience?"

---

## Output: Marketing Brief

After all questions, produce this brief. Keep it tight — it's a reference card, not a document.

```
# Marketing Brief — [Company Name]

One-liner: [what it does and who it's for]
Problem: [specific customer frustration]
ICP: [buyer profile + buying trigger]
Differentiator: [credible claim competitors can't make]
Customer language: "[verbatim quote or phrase]"
Voice: [3 adjectives] — sounds like [reference]
Never: [words/tones to avoid]
Working on: [today's task]
```

Tell the user to save this brief and paste it into any future Claude session to skip the intake next time.

Then move immediately into the task from Q8.
