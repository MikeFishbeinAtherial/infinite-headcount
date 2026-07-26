---
name: eng-ghostwriter
description: Generates 2-3 social post drafts about engineering work in the current repository. Reads the repository's code and git history, asks targeted questions to fill gaps, and saves a markdown draft locally. Use when you want content about what was built without exposing transcripts or pushing anywhere.
triggers: eng-ghostwriter, ghostwriter, write about what I built, draft posts about my build
---

# Eng Ghostwriter

Turn engineering work in the current repository into polished post drafts. Read the code and git history, ask targeted questions to fill gaps, and generate 2-3 drafts ready for editing or posting.

Output is a markdown file at `content/eng-drafts/YYYY-MM-DD-[short-slug].md` in the current repository.

> **Privacy rule:** stay inside the current repository. Do not read chat/session transcripts, inspect sibling repositories, or push/commit the generated draft. Before writing, ask what must be excluded from public content.

---

## Step 0 — Establish scope

Confirm the current repository is the project the user wants to write about. Ask who the audience is and whether any names, integrations, unreleased features, metrics, or client details must be excluded.

---

## Step 1 — Discover What Was Built

Inspect only the current repository:

```bash
git status --short
git log --oneline -10
git diff --stat
git diff
```

Read relevant source files and project documentation as needed. Git is helpful but optional: if the directory is not a git repository, work from the files and the user's answers.

### Synthesize

From the current repository, identify:
- **What was built**: the primary artifact (tool, agent, integration, system, automation, script)
- **Technologies involved**: APIs, platforms, languages, services, tools
- **What it does**: inferred capabilities from code and conversation
- **Outcome signals**: any result, metric, or moment of it working

If the repository does not provide enough context, ask the user what changed rather than searching elsewhere.

---

## Step 2 — Fill Gaps with Questions

Ask only what the repository did not answer. Ask 3–5 questions maximum, one at a time.

### The 7 questions (ask only what's needed, in any order)

1. **Hook moment** — "What's the most interesting thing this did — the moment it surprised you or actually worked? Think: what would you text a friend about it."
2. **Numbers** — "Any concrete metrics? Time saved, outputs generated, tasks automated, anything measurable."
3. **The before** — "What were you doing manually before this existed?"
4. **Problem** — "What's the core problem or pain this solves?"
5. **Capabilities** — "What does it actually do for you — in plain language, not technical terms?"
6. **Audience** — "Is this internal tooling, a client build, or something you're shipping as a product?"
7. **Exclusions** — "Anything to keep out of public content — client names, sensitive integrations, work still in progress?"

---

## Step 3 — Generate Drafts

Generate 2–3 drafts depending on what fits the input. Draft C is optional — only include it if there's a meaningfully different angle that A and B don't capture.

---

### Draft A: Experience / Operator Post

**The frame:** The tool did the work while you weren't watching. You showed up to results.

**Structure:**
1. **Hook** (1–2 sentences): what the agent told you, or what you woke up / came back to. Ultra-specific. Include a number or result if possible.
2. **Passive outcome** (1 sentence): what you did with it — approved from the gym, checked Slack, woke up to it.
3. **Behind-the-scenes list** (5–8 bullets): what it did. Past tense. Active verbs. Specific. Sequential where relevant.
4. **Closing frame** (1–2 sentences): the system insight — the loop, the pattern, what this represents.
5. **CTA** (optional): "Reply X for Y" or "DM me if you want to see how."

**Style rules:**
- Past tense throughout the bullet list
- Specific numbers in the hook and list wherever possible
- Operator/founder voice — you're a user of the system, not the engineer explaining it
- No "how to build this" anywhere — this is about living with it, not building it
- ~150–250 words, single post, never a thread
- No em-dashes, no headers, no colons introducing lists

**Reference example:**
> My agent DM'd me this morning "your landing pages are ready. 6 drafts targeting 14 citation gaps on ChatGPT and Claude."
>
> I approved them from the gym then it auto publishes.
>
> What the agent did on Sunday night while I slept:
> → Generated 47 buyer prompt queries based on our sales call recordings
> → Checked ChatGPT and Claude to find who's being cited
> → Found 14 gaps where competitors showed up and we didn't
> → Matched each gap to a content format
> → Pulled from our knowledge base to create insightful content
> → Wrote 6 on-message and on-brand drafts
> → Sent them to me to approve before it published
> → Reviewed analytics to do more of what works

---

### Draft B: Feature Showcase

**The frame:** Here's what this thing does and why it matters. Educational, instructional, LinkedIn-ready.

**Structure:**
1. **Opening** (2–3 sentences): what it does and where it runs. Visual language — rips through, interrogates, surfaces, demolishes.
2. **Problem statements** (2–4 sentences): "No more X" format. Specific, relatable scenarios with details.
3. **Feature list** (4–7 bullets): what it handles. Each bullet = specific example scenario. What you say/do + what you get back. Include real tool names, numbers, timeframes.
4. **Build steps** (3–5 steps): how to replicate it. Imperative voice. Specific: file names, prompts, API keys, configs.

**Style rules:**
- Visual verbs: rips through, interrogates, surfaces, demolishes, crafts, annihilates, scrapes, pulls
- Specific examples not abstract capabilities
- Concrete details: names, numbers, timeframes
- Capitalize first letter of every sentence
- No em-dashes
- ~200–300 words

---

### Draft C: Use Case Story *(optional)*

**The frame:** You're in a specific moment, you use this, here's exactly what happens.

**Structure:**
1. **Scenario opening** (2–3 sentences): hyper-specific situation. Names, numbers, timeframe. Second person ("You").
2. **What you do and get** (2–3 sentences): exact input + exact output. Visual verbs.
3. **Capability details** (4–6 bullets): how each piece works. Technical mechanism → practical outcome.
4. **Build instructions** (3–5 steps): what to tell Claude Code, what files/APIs needed.

**Style rules:**
- Written in second person throughout
- Hyper-specific: names, numbers, exact timeframes
- Show inputs and outputs explicitly
- Same visual verbs as Draft B
- ~200–300 words

**Include Draft C when:** there's a strong narrative use case Draft A and B don't fully capture, or a specific "you're 8 minutes from a call" scenario that makes the value immediately obvious.

---

## Step 4 — Write the Output File

**Filename:** `content/eng-drafts/YYYY-MM-DD-[short-slug].md`
`[short-slug]` = 2–4 words from the build name, kebab-cased (e.g., `2025-01-15-hubspot-slack-bot.md`)

**File structure:**

```markdown
# [What Was Built]
Generated: [date]
Source: current repository

---

## System Flow

[Mermaid flowchart showing input → processing → output. If the global-mermaid skill (`~/.claude/skills/global-mermaid/SKILL.md`) is installed, use it to style the diagram; otherwise plain mermaid is fine — any mermaid renderer will display it.]

## System Flow (ASCII)

[ASCII flowchart showing input → processing → output. Plain ASCII only: + - | v ^ > <
Real tool/system names in boxes. ~70 chars wide. Parallel steps side-by-side. 
This provides a plain text alternative that can be pasted directly into a LinkedIn post.]

---

## Draft A: Experience Post

[Draft A]

---

## Draft B: Feature Showcase

[Draft B]

---

## Draft C: Use Case Story
*(only if generated)*

[Draft C]

---

## Additional Context

### What We Know
[Bullet list: key facts extracted from repository files, commits, and answered questions]
- What was built: ...
- Technologies: ...
- Problem solved: ...
- Key capabilities: ...
- Outcomes/numbers: ...

### Open Questions
*(List anything the repository and user answers could not establish.)*
- [ ] [Question 1]
- [ ] [Question 2]

### Editorial Notes
[2–3 sentences for the editor: which draft is strongest and why, what specific detail would most improve the drafts, what to ask the builder to clarify]

### Style Profiles Available for Editing
These generic profiles can be applied when refining these drafts. Ask Claude to rewrite any draft in one of these styles (or swap in your own style profile notes):
- **Bold Contrarian Take** — punchy hot take, Claim→Evidence→Conclusion, best for strong opinions about AI/building
- **Tactical How-To Post** — numbered walkthrough, coaching voice, best for step-by-step build guides
- **Narrative Lesson Arc** — first-person story, problem→build→what I learned, best for build demos
- **Insider Knowledge Drop** — authority voice, surfaces non-obvious insight, best for things most people don't know
- **Data Authority Post** — leads with a number or finding, analytical tone, best for results-driven builds
*(To go further, keep your own style profiles — hook templates, anti-patterns, past posts that hit the right tone — in a `references/` folder and point the skill at them.)*
```

---

## Step 5 — Save Locally

Create `content/eng-drafts/` in the current repository if needed, then write the draft there.

```bash
mkdir -p content/eng-drafts
# Write content/eng-drafts/YYYY-MM-DD-[short-slug].md
```

Do not commit or push unless the user separately asks.

---

## Step 6 — Confirm

Tell the user:
- What was identified as the main build (1 sentence)
- Which drafts were generated (A only / A+B / A+B+C) and why
- The local filename created
- **Print the ASCII flowchart directly in the chat** so the user can easily copy and paste it if they want to post immediately.
- List any open questions that would improve the drafts
- Offer to re-run with additional context to sharpen any draft

---

## Quality Checklist

**Draft A:**
- [ ] Hook is ultra-specific — a message received, a result discovered, a number
- [ ] List uses past tense, active verbs, specific details
- [ ] Operator framing — tool did the work, you showed up to results
- [ ] No "how to build this"
- [ ] 150–250 words, single post

**Draft B:**
- [ ] Opens with visual verb language
- [ ] 2–4 "No more X" problem statements with specific scenarios
- [ ] 4–7 feature bullets with specific examples (input → output)
- [ ] Build steps included and tactical
- [ ] Properly capitalized

**Draft C (if included):**
- [ ] Hyper-specific scenario with names/numbers/timeframe
- [ ] Second person throughout
- [ ] Build steps included

**All drafts:**
- [ ] No em-dashes
- [ ] No future possibilities or hypothetical use cases
- [ ] Real tool names throughout
- [ ] Concrete numbers wherever possible
- [ ] Single post length (~150–300 words), never a thread
