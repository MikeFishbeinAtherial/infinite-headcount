---
name: eng-ghostwriter
description: Automatically generates 2-3 social post drafts about recent engineering work by mining Claude Code session transcripts and git commits. Runs on demand or on a daily schedule. Pushes output to the social content repo. Use when you want content about what was built without having to think about it.
triggers: eng-ghostwriter, ghostwriter, write about what I built, draft posts about my build
---

# Eng Ghostwriter

Turn recent engineering work into polished post drafts — automatically. Reads Claude Code session transcripts and git commits to figure out what was built, asks targeted questions to fill the gaps, and generates 2-3 drafts ready for editing or posting.

Output is a markdown file committed to `content/eng-drafts/` in the shared social content repo: `[YOUR_OUTPUT_REPO]`.

---

## Step 0 — Configure and Self-Update

**First, Configure for Your Setup (Skip if already configured):**
- Update the `REPO_DIR` and `git clone` URL in Step 5 to point to your actual social content repository (replace `[YOUR_OUTPUT_REPO_URL]`).
- Update the `find` paths in Step 1 to point to your actual code repositories (replace `[YOUR_CODE_DIR]`).
- Customize the audience and tone prompts in the Tier 1 routine to match your brand (replace `[YOUR_AUDIENCE]`).

**Then, Self-Update:**
Before doing anything else, pull the latest version of this skill from GitHub so updates propagate automatically:

```bash
curl -fsSL https://raw.githubusercontent.com/MikeFishbeinAtherial/infinite-headcount/main/eng-ghostwriter/SKILL.md \
  -o ~/.claude/skills/eng-ghostwriter/SKILL.md 2>/dev/null || true
```

Continue with the rest of the skill as loaded in memory — the update takes effect on the next run.

Two modes:
- **Manual** (interactive): asks questions in chat before generating — sharper drafts
- **Scheduled** (non-interactive): best-effort drafts from source material alone; open questions go into the Additional Context section for the editor

---

## Step 1 — Discover What Was Built

### Read Claude Code transcripts

Find recent JSONL session files. Use the last-run marker if it exists, otherwise look back 24 hours:

```bash
MARKER=~/.claude/.ghostwriter-last-run
if [ -f "$MARKER" ]; then
  find ~/.claude/projects -name "*.jsonl" -not -path "*/subagents/*" -newer "$MARKER"
else
  find ~/.claude/projects -name "*.jsonl" -not -path "*/subagents/*" -mtime -1
fi
```

Read each file. Each line is a JSON message. Extract:
- What the user described wanting to build
- Assistant summaries of completed work
- File names created or edited (from tool calls)
- Any integrations, APIs, or platforms mentioned
- Outcome signals: anything that suggests a result ("it worked", "deployed", "tested")

### Read recent git commits

Find git repos in common locations:

```bash
find [YOUR_CODE_DIR] -maxdepth 3 -name ".git" -type d 2>/dev/null
```

For each repo, get commits since the last run (or last 24 hours):

```bash
git -C <repo-path> log --oneline --since="24 hours ago" 2>/dev/null
git -C <repo-path> diff HEAD~1 --stat 2>/dev/null
```

### Synthesize

From transcripts + commits, identify:
- **What was built**: the primary artifact (tool, agent, integration, system, automation, script)
- **Technologies involved**: APIs, platforms, languages, services, tools
- **What it does**: inferred capabilities from code and conversation
- **Outcome signals**: any result, metric, or moment of it working

**If nothing meaningful was built** (only config tweaks, readme edits, no commits, or entirely client-confidential work), exit cleanly:
> "Nothing significant to write about from the last 24 hours. Run again after your next meaningful build."

---

## Step 2 — Fill Gaps with Questions

**Manual mode:** Ask in chat. Only ask what the transcripts/commits didn't answer. Adaptive — skip any question with a clear answer already. Ask 3–5 max; fewer is better. Never ask more than one at a time.

**Scheduled mode:** Skip this step entirely. All unanswered questions go into the Additional Context section.

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

**Filename:** `drafts/YYYY-MM-DD-[short-slug].md`
`[short-slug]` = 2–4 words from the build name, kebab-cased (e.g., `2025-01-15-hubspot-slack-bot.md`)

**File structure:**

```markdown
# [What Was Built]
Generated: [date]
Mode: [manual | scheduled]

---

## System Flow

[Mermaid flowchart showing input → processing → output. Use the global-mermaid skill (`~/.claude/skills/global-mermaid/SKILL.md`) to format and style this diagram with Atherial's diagonal backgrounds. Ensure `beautiful-mermaid` is installed/available in the repo.]

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
[Bullet list: key facts extracted from transcripts, commits, and answered questions]
- What was built: ...
- Technologies: ...
- Problem solved: ...
- Key capabilities: ...
- Outcomes/numbers: ...

### Open Questions
*(In scheduled mode: list what the skill couldn't answer. In manual mode: leave blank if all answered.)*
- [ ] [Question 1]
- [ ] [Question 2]

### Editorial Notes
[2–3 sentences for the editor: which draft is strongest and why, what specific detail would most improve the drafts, what to ask the builder to clarify]

### Style Profiles Available for Editing
These profiles from the social content system can be applied when refining these drafts. Run `/write-post-draft` in the social repo to rewrite any draft using one of these styles:
- **Bold Contrarian Take** — punchy hot take, Claim→Evidence→Conclusion, best for strong opinions about AI/building
- **Tactical How-To Post** — numbered walkthrough, coaching voice, best for step-by-step build guides
- **Narrative Lesson Arc** — first-person story, problem→build→what I learned, best for build demos
- **Insider Knowledge Drop** — authority voice, surfaces non-obvious insight, best for things most people don't know
- **Data Authority Post** — leads with a number or finding, analytical tone, best for results-driven builds
*(Full profiles with hook templates and anti-patterns live in the `style_profiles` Supabase table in the social content system)*
```

---

## Step 5 — Push to GitHub

Output goes to `content/eng-drafts/` in the shared social content repo: `[YOUR_OUTPUT_REPO_URL]`.

```bash
REPO_DIR="$HOME/.social-content-repo"

# Clone if not present
if [ ! -d "$REPO_DIR/.git" ]; then
  git clone [YOUR_OUTPUT_REPO_URL] "$REPO_DIR"
fi

# Pull latest
git -C "$REPO_DIR" pull --rebase

# Ensure eng-drafts/ folder exists
mkdir -p "$REPO_DIR/content/eng-drafts"

# [Write the markdown file to $REPO_DIR/content/eng-drafts/YYYY-MM-DD-slug.md]

# Commit and push
git -C "$REPO_DIR" add content/eng-drafts/
git -C "$REPO_DIR" commit -m "eng-draft: [slug] [date]"
git -C "$REPO_DIR" push

# Update last-run marker
touch ~/.claude/.ghostwriter-last-run
```

---

## Step 6 — Confirm

Tell the user:
- What was identified as the main build (1 sentence)
- Which drafts were generated (A only / A+B / A+B+C) and why
- The filename pushed to GitHub
- **Print the ASCII flowchart directly in the chat** so the user can easily copy and paste it if they want to post immediately.
- In scheduled mode: list the open questions so they can answer them to improve the drafts
- Offer to re-run with additional context to sharpen any draft

---

## Automation: Two-Tier Model

There are two ways to run this skill. Use both — they complement each other.

---

### Tier 1: Claude Code Routines (recommended for daily automation)

Routines run on Anthropic-managed cloud infrastructure, so your laptop doesn't need to be open. The tradeoff: Routines can't access local JSONL transcripts (those live on your machine). So Routine-generated drafts are based on **git commits only** — good, but not as rich as a local run.

**Setup (do this once per person at claude.ai/code/routines):**

1. Go to `claude.ai/code/routines` → **New routine**
2. Name: `eng-ghostwriter`
3. Repositories: add your active working repos + `[YOUR_OUTPUT_REPO]`
4. For the social repo: enable **Allow unrestricted branch pushes**
5. Schedule: daily at 6:00 PM ET
6. Paste this prompt:

```
You are running eng-ghostwriter in automated mode. No human interaction — run straight through.

Step 1 — Scan git commits from the last 24 hours across all cloned repos:
  git log --oneline --since="24 hours ago"
  git diff HEAD~1 --stat
Identify: what was built, technologies involved, inferred capabilities, outcome signals.
If nothing meaningful (only config tweaks, readme edits, no commits): write a brief note to content/eng-drafts/YYYY-MM-DD-no-build.md explaining this and stop.

Step 2 — Generate 2 drafts. Audience: [YOUR_AUDIENCE]. Core angle: [YOUR_CORE_ANGLE].

DRAFT A (Experience Post): Hook with a specific outcome. Behind-the-scenes list of what was built (past tense, active verbs, 5-8 bullets starting with →). Closing frame — the system/loop insight. 150-250 words. Single post. No thread. No em-dashes.

DRAFT B (Feature Showcase): Opens with visual verb language (rips through, interrogates, surfaces, demolishes). 2-4 "No more X" problem statements with specific scenarios. 4-7 feature bullets showing input → output. Tactical build steps. 200-300 words.

Step 3 — Write output to content/eng-drafts/YYYY-MM-DD-[slug].md in [YOUR_OUTPUT_REPO]. Include:
- Mermaid system flow diagram (Styled using the Atherial global-mermaid skill rules, assuming beautiful-mermaid is available)
- ASCII system flow diagram (~70 chars wide, plain + - | v ^ > < only) as a plain-text alternative
- Draft A
- Draft B
- Additional Context section with: what was found in commits, open questions that would sharpen the drafts (hook moment, specific numbers, the before, problem it solves), editorial note on which draft is stronger and why

Step 4 — Commit and push to main branch of [YOUR_OUTPUT_REPO].
```

Each person sets up their own Routine. They run independently — your Routine sees your commits, partner's sees theirs.

---

### Tier 2: Local manual run (for high-quality drafts with transcript analysis)

Run `/eng-ghostwriter` in Claude Code on your machine. This reads session transcripts + git commits, asks targeted questions, and generates sharper drafts. Use this when you want the best possible output or when you've just finished a significant build.

When invoked with `--scheduled` flag, the skill runs non-interactively: skips Step 2 entirely and routes all unanswered questions to the Additional Context section.

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
