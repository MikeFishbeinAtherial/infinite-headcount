---
name: interrogate-me
description: Run a comprehensive marketing intake interview to extract everything Claude needs to produce great marketing work. Covers business overview, ICP, customer psychology, competitive landscape, brand voice, content strategy, and goals. Use this before creating content, copy, campaigns, or strategy — or anytime Claude needs deep context about a company to do its best work. Trigger when the user says "interrogate me", "interview me", "brief me", "get context on my business", or "ask me questions before we start".
triggers: interrogate me, interview me, brief me, marketing brief, get context, ask me questions, onboard me, marketing intake
---

# Interrogate Me — Marketing Intelligence Interview

Run a full marketing intake interview. Extract everything needed to produce sharp, accurate marketing work: content, copy, campaigns, positioning, strategy, or anything else that requires knowing the business deeply.

This is not a casual conversation. Ask exactly the right questions, one at a time. For each question, offer a recommended answer based on what you already know — then ask the user to confirm, correct, or expand. Don't move on until the answer is resolved.

At the end, synthesize everything into a Marketing Brief the user can save and reference in future sessions.

---

## How to Run This

1. Tell the user what's about to happen: "I'm going to ask you a series of questions to build a complete marketing brief for your business. One question at a time. For each one I'll give you my best guess — just confirm, correct, or add detail."
2. Work through each category in order, one question at a time.
3. If the user has already provided context (in a previous message, a doc, or a CLAUDE.md), skip questions that are already answered — don't re-ask what you already know.
4. After all questions, produce the Marketing Brief (see end of this file).

---

## Category 1: The Business

### Q1 — What You Do
"In one sentence — what does [company/product] do and who does it do it for?"

*Hypothesis: Offer your best guess if you have any prior context. Otherwise say: "Start with: '[Company] helps [type of person] [achieve outcome] by [doing what].' I'll refine it with you."*

### Q2 — The Problem You Solve
"What specific problem does a customer have right before they find you? Not the category-level problem — the specific, frustrating situation."

*Hypothesis: Frame the problem from the customer's perspective, not the company's. The more specific, the more useful.*

### Q3 — Stage of the Business
"Where are you right now?"

Options:
- Pre-launch — building, not yet selling
- Early traction — some customers, still finding product-market fit
- Growth — proven model, scaling what works
- Mature — established, optimizing and expanding

### Q4 — Revenue Model
"How do you make money? Be specific — pricing structure, contract length, transaction vs. recurring."

---

## Category 2: The Ideal Customer

### Q5 — Who Buys
"Who is the person who actually decides to buy? Job title, company type, company size."

*Hypothesis: Give a specific profile — e.g., "VP of Marketing at a 50–500 person B2B SaaS company." Ask them to confirm or adjust.*

### Q6 — Who Uses It
"Is the buyer the same person who uses it day-to-day? If not — who is the user and does the messaging need to speak to both?"

### Q7 — The Perfect Customer
"When you picture the customer you'd clone 10 times — describe them. What do they look like, how did they find you, what made them buy, and what do they say about you six months later?"

*This question often produces the best insight. Listen for specifics — industry, company situation, emotional state when they found you.*

### Q8 — The Buying Trigger
"What happens in a customer's life or business right before they start looking for something like you? What's the event or breaking point?"

*Examples: A key hire left. They just missed a revenue target. A competitor launched. They got funding. Board pressure.*

### Q9 — Objections
"What are the top 2–3 reasons a qualified prospect decides NOT to buy? Not 'price is too high' — what's the real hesitation?"

---

## Category 3: Customer Psychology & Insights

### Q10 — Their Words
"What exact phrases do customers use when they describe their problem — before finding you? And what do they say after?"

*If you have testimonials, interview recordings, sales call notes, or reviews — this is where to pull from. The goal is their language, not yours.*

### Q11 — Why They Chose You
"When a customer picks you over the alternative — what do they say was the deciding factor?"

### Q12 — What They Fear
"What's the underlying fear that drives the buying decision? Not the surface problem — the thing they're scared of if this doesn't work."

*Examples: Looking incompetent to leadership. Falling behind competitors. Wasting budget on something that doesn't deliver.*

### Q13 — The Job to Be Done
"Finish this sentence: 'When I [situation], I want to [motivation], so I can [desired outcome].'"

*Use the customer's perspective. This is the Jobs to Be Done framework — it often reveals messaging that resonates better than feature-first copy.*

---

## Category 4: Competitive Landscape

### Q14 — Direct Competitors
"Who are your top 3 direct competitors — companies solving the same problem for the same buyer?"

### Q15 — Indirect Alternatives
"What does your buyer do instead of using you? What's the 'do nothing' or 'do it themselves' alternative?"

### Q16 — Your Edge
"What can you credibly claim that no competitor can? Not aspirationally — specifically, right now."

### Q17 — Shared Enemy
"What do you and all your competitors secretly position against — the common enemy or status quo you're all trying to replace?"

*Examples: spreadsheets, legacy enterprise software, agencies that overpromise, manual processes, one-size-fits-all solutions.*

---

## Category 5: Brand Voice & Tone

### Q18 — Personality
"If your brand were a person at a dinner party — how would you describe them in 3 adjectives? What do they talk like? What don't they sound like?"

*Examples: Direct but warm. Sharp and irreverent. Calm and authoritative. Confident but not arrogant.*

### Q19 — Voice References
"Is there a brand, writer, publication, or person whose voice you admire — inside or outside your industry? What specifically do you like about it?"

### Q20 — What to Avoid
"What words, phrases, or tones should we never use? Things that make you cringe when you see them in competitor copy."

*Common answers: "innovative", "cutting-edge", "revolutionize", "world-class", corporate jargon, fear-based copy, overly casual.*

### Q21 — Existing Copy
"Do you have a current tagline, hero headline, or positioning statement — even a rough one? Paste it here."

---

## Category 6: Content & Channels

### Q22 — Current Channels
"Where are you currently showing up? Which channels are working and which aren't?"

Options (multi-select): LinkedIn, X/Twitter, Newsletter, Blog/SEO, YouTube, Instagram, TikTok, Paid ads, Podcast, Community, Cold outreach, Word of mouth

### Q23 — Content That's Worked
"What specific piece of content — post, email, article, talk — got the best response? What do you think made it land?"

### Q24 — Audience Hangouts
"Where does your ideal customer actually spend time and consume content? Not where you think they should be — where they actually are."

### Q25 — Content Formats
"What formats does your audience respond to best? And what format do you find easiest or most natural to produce?"

---

## Category 7: Goals & Priorities

### Q26 — Primary Marketing Goal Right Now
"What's the one marketing outcome that matters most in the next 90 days?"

Options:
- Build awareness — more people knowing we exist
- Generate leads — qualified pipeline
- Improve conversion — better close rate from existing traffic or leads
- Retain and expand — keeping customers and growing accounts
- Launch something new — product, feature, market, or audience

### Q27 — What Success Looks Like
"If this is working in 90 days — what specifically is different? Give me numbers or concrete changes if you can."

### Q28 — What's Been Tried
"What marketing have you tried that hasn't worked? What's the hypothesis for why it didn't?"

### Q29 — Constraints
"What are the real constraints? Budget, team size, time, technology, founder bandwidth — what limits what we can actually do?"

---

## Category 8: One Last Thing

### Q30 — The Thing That Never Makes It Into the Brief
"What's the thing about your company, your customers, or your market that you always wish marketers understood — but it never makes it into the brief?"

*This question often surfaces the most useful insight. Give the user space to just talk.*

---

## Output: The Marketing Brief

After all questions are answered, produce a Marketing Brief in this format. This document is designed to be saved and shared in future Claude sessions as context.

---

```
# Marketing Brief — [Company Name]
Generated: [date]

## The Business
**What it is:** [one-sentence description]
**Problem it solves:** [specific customer problem]
**Stage:** [pre-launch / early / growth / mature]
**Revenue model:** [how money works]

## Ideal Customer Profile
**Primary buyer:** [title, company type, size]
**End user:** [if different]
**Perfect customer profile:** [detailed description]
**Buying trigger:** [what event prompts the search]
**Key objections:** [top 2-3 real hesitations]

## Customer Psychology
**Their language (before):** "[exact phrases they use to describe the problem]"
**Their language (after):** "[exact phrases they use to describe success]"
**Why they chose you:** [deciding factor]
**Underlying fear:** [what they're really afraid of]
**Job to be Done:** "When I [situation], I want to [motivation], so I can [outcome]."

## Competitive Landscape
**Direct competitors:** [names + one-line positioning each]
**Indirect alternatives:** [what they do instead]
**Your credible edge:** [what you can actually claim]
**Shared enemy:** [the status quo everyone is fighting]

## Brand Voice
**Personality:** [3 adjectives]
**Voice references:** [brands/people to emulate]
**Never use:** [words, phrases, tones to avoid]
**Current positioning/tagline:** [if exists]

## Content & Channels
**Active channels:** [list]
**What's worked:** [specific example + why]
**Where audience actually is:** [honest answer]
**Best formats:** [for audience and for creator]

## Goals
**Primary goal (90 days):** [specific outcome]
**Success looks like:** [concrete definition]
**What hasn't worked:** [and hypothesis why]
**Real constraints:** [budget, team, time]

## The Insight
[The thing that never makes it into a brief — the most important piece of context from Q30]
```

---

## After Delivering the Brief

Tell the user:
1. The brief has been created
2. Suggest they save it as a reference in their project (e.g., paste into CLAUDE.md or a context file)
3. Ask: "What do you want to work on first — content, copy, positioning, campaigns, or something else?"
