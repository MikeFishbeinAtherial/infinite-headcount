---
name: eng-ghostwriter
description: Automatically generates 2-3 social post drafts about recent engineering work by mining Claude Code session transcripts and git commits. Runs on demand or as a daily Claude Code Routine. Pushes output to a shared GitHub repo. Use when you want content about what was built without anyone having to think about it.
triggers: eng-ghostwriter, ghostwriter, write about what I built, draft posts about my build
---

# Eng Ghostwriter

Your engineering team builds impressive things every day. Almost none of it becomes content — not because no one wants to write about it, but because writing isn't in the flow and no one wants to interrupt a builder to ask for a blog post.

This skill fixes that. It reads Claude Code session transcripts and git commits, figures out what was built, asks a few targeted questions to fill the gaps, and generates 2-3 polished post drafts. Output is a markdown file committed to a shared GitHub repo so anyone on the team can access and edit.

---

## Configure for Your Setup

Before running this skill, set three things. Edit this file and replace the placeholders:

**1. Output repo** — where drafts get pushed:
```
OUTPUT_REPO="https://github.com/YOUR_USERNAME/YOUR_DRAFTS_REPO.git"
OUTPUT_REPO_DIR="$HOME/.eng-ghostwriter-output"
OUTPUT_PATH="drafts"   # folder inside the repo where files land
```

**2. Your working directory** — where the skill looks for git repos:
```
SEARCH_DIR="$HOME/your/projects/directory"
```

**3. Audience and angle** — who you're writing for and what makes the content sharp. Replace the defaults in Step 3's style guide:
```
AUDIENCE="[who reads your posts — e.g. 'developers at B2B SaaS companies', 'CTOs at fintech startups']"
ANGLE="[what makes your content distinctive — e.g. 'we build with AI tools and share what works', 'tactical and opinionated, always includes build steps']"
```

**Optional customizations:**
- Change the draft formats in Step 3 to match your voice
- Add or remove questions in Step 2 based on what context you typically need
- Adjust the Routine prompt in the Automation section for your stack and audience

---

## Step 0 — Self-Update

Pull the latest version of this skill from GitHub before running, so updates propagate automatically:

```bash
curl -fsSL https://raw.githubusercontent.com/MikeFishbeinAtherial/infinite-headcount/main/eng-ghostwriter/SKILL.md \
  -o ~/.claude/skills/eng-ghostwriter/SKILL.md 2>/dev/null || true
```

Continue with the rest of the skill as loaded in memory. The update takes effect on the next run.

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
- Integrations, APIs, or platforms mentioned
- Outcome signals: anything suggesting a result ("it worked", "deployed", "tested", "it's live")

### Read recent git commits

Find git repos under your configured working directory:

```bash
find $SEARCH_DIR -maxdepth 3 -name ".git" -type d 2>/dev/null
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

**If nothing meaningful was built** (only config tweaks, readme edits, no commits), exit cleanly:
> "Nothing significant to write about from the last 24 hours. Run again after your next meaningful build."

---

## Step 2 — Fill Gaps with Questions

**Manual mode:** Ask in chat. Only ask what transcripts and commits didn't answer. Adaptive — skip any question with a clear answer. Ask 3–5 max; fewer is better. Never ask more than one at a time.

**Routine/scheduled mode:** Skip this step. All unanswered questions go into the Additional Context section for a human editor to review.

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

Generate 2–3 drafts depending on what fits the input. Draft C is optional — only include it when there's a meaningfully different angle A and B don't capture.

---

### Draft A: Experience / Operator Post

**The frame:** The tool did the work while you weren't watching. You showed up to results.

**Structure:**
1. **Hook** (1–2 sentences): what the agent told you, or what you woke up / came back to. Ultra-specific. Include a number or result if possible.
2. **Passive outcome** (1 sentence): what you did with it — approved it, checked the output, woke up to it.
3. **Behind-the-scenes list** (5–8 bullets starting with →): what it did. Past tense. Active verbs. Specific. Sequential where relevant.
4. **Closing frame** (1–2 sentences): the system insight — the loop, the pattern, what this represents.
5. **CTA** (optional): "Reply X for Y" or "DM me if you want to see how."

**Style rules:**
- Past tense throughout the bullet list
- Specific numbers in the hook and list wherever possible
- Operator/founder voice — you're a user of the system, not the engineer explaining it
- No "how to build this" — this is about living with it, not building it
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
3. **Feature list** (4–7 bullets): what it handles. Each bullet = specific example scenario with input and output. Real tool names, numbers, timeframes.
4. **Build steps** (3–5 steps): how to replicate it. Imperative voice. Specific: file names, prompts, API keys, configs.

**Style rules:**
- Visual verbs: rips through, interrogates, surfaces, demolishes, crafts, scrapes, pulls
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
- Same visual verbs as Draft B
- ~200–300 words

**Include Draft C when:** there's a strong narrative use case that A and B don't capture, or a specific scenario that makes the value immediately obvious.

---

## Step 4 — Write the Output File

**Filename:** `YYYY-MM-DD-[short-slug].md` inside your configured `OUTPUT_PATH`

**File structure:**

```markdown
# [What Was Built]
Generated: [date]
Mode: [manual | routine]

---

## System Flow

[ASCII flowchart: input → processing → output.
Plain ASCII only: + - | v ^ > <. ~70 chars wide. Real tool names in boxes.]

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
- What was built: ...
- Technologies: ...
- Problem solved: ...
- Key capabilities: ...
- Outcomes/numbers: ...

### Open Questions
*(Populated in Routine mode when questions couldn't be asked interactively)*
- [ ] [Question that would sharpen the drafts]

### Editorial Notes
[Which draft is strongest and why. What specific detail would most improve the drafts. What to ask the builder to clarify.]
```

---

## Step 5 — Push to GitHub

```bash
REPO_DIR="$OUTPUT_REPO_DIR"

# Clone if not present
if [ ! -d "$REPO_DIR/.git" ]; then
  git clone $OUTPUT_REPO "$REPO_DIR"
fi

# Pull latest
git -C "$REPO_DIR" pull --rebase

# Ensure output folder exists
mkdir -p "$REPO_DIR/$OUTPUT_PATH"

# [Write the markdown file]

# Commit and push
git -C "$REPO_DIR" add $OUTPUT_PATH/
git -C "$REPO_DIR" commit -m "eng-draft: [slug] [date]"
git -C "$REPO_DIR" push

# Update last-run marker
touch ~/.claude/.ghostwriter-last-run
```

---

## Step 6 — Confirm

Tell the user:
- What was identified as the main build (1 sentence)
- Which drafts were generated and why
- The filename pushed to GitHub
- In Routine mode: list the open questions so a human can fill them in to sharpen the drafts
- Offer to re-run with additional context to improve any draft

---

## Automation: Two-Tier Model

Use both tiers — they complement each other.

---

### Tier 1: Claude Code Routines (recommended for daily automation)

Routines run on Anthropic's cloud infrastructure — your laptop doesn't need to be open. The tradeoff: Routines can't access local JSONL transcripts (those live on your machine). So Routine-generated drafts are based on **git commits only**. Good, but not as rich as a local run with transcript context.

**Setup (once per person, at claude.ai/code/routines):**

1. Go to `claude.ai/code/routines` → **New routine**
2. Name it `eng-ghostwriter`
3. **Repositories**: add your active working repos + your output drafts repo
4. For the output repo: enable **Allow unrestricted branch pushes**
5. **Schedule**: daily at your preferred end-of-day time
6. **Prompt**: customize and paste the block below

```
You are running eng-ghostwriter in automated mode. No human interaction — run straight through.

Step 1 — Scan git commits from the last 24 hours across all cloned repos:
  git log --oneline --since="24 hours ago"
  git diff HEAD~1 --stat
Identify: what was built, technologies involved, inferred capabilities, outcome signals.
If nothing meaningful (only config tweaks or readme edits): write a brief note to [OUTPUT_PATH]/YYYY-MM-DD-no-build.md and stop.

Step 2 — Generate 2 drafts.
Audience: [YOUR_AUDIENCE]
Angle: [YOUR_ANGLE]

DRAFT A (Experience Post): Hook with a specific outcome. Behind-the-scenes list of what was built (past tense, active verbs, 5-8 bullets starting with →). Closing frame — the system insight. 150-250 words. Single post. No thread. No em-dashes.

DRAFT B (Feature Showcase): Opens with visual verb language (rips through, interrogates, surfaces, demolishes). 2-4 "No more X" problem statements. 4-7 feature bullets showing input → output with specific examples. Tactical build steps. 200-300 words.

Step 3 — Write output to [OUTPUT_PATH]/YYYY-MM-DD-[slug].md in [YOUR_OUTPUT_REPO]. Include:
- ASCII system flow diagram (~70 chars wide, plain + - | v ^ > < only)
- Draft A and Draft B
- Additional Context section: what was found in commits, open questions that would sharpen the drafts (hook moment, specific numbers, the before, problem solved), editorial note on which draft is stronger

Step 4 — Commit and push to [YOUR_OUTPUT_REPO].
```

Replace `[OUTPUT_PATH]`, `[YOUR_AUDIENCE]`, `[YOUR_ANGLE]`, and `[YOUR_OUTPUT_REPO]` with your values before saving the Routine.

Each person on the team sets up their own Routine. They run independently against each person's commits.

---

### Tier 2: Local manual run (richest output)

Run `/eng-ghostwriter` in Claude Code on your machine. Reads session transcripts + git commits, asks targeted questions, generates sharper drafts. Use this after a significant build or when you want the best possible output.

---

## Quality Checklist

**Draft A:**
- [ ] Hook is ultra-specific — a message, a discovery, a result
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
