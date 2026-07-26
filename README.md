# infinite-headcount

Marketing and content skills for Claude Code, Cursor, Claude, and AI agents, plus **Mike's Personal Software Factory**, a full assembly line for building software with coding agents. Copywriting, positioning, narrated demos, content strategy, and design.

Clone this repo and pick the skills you need.

---

## Skills

<!-- skills-list-start -->
| Skill | Description | Install |
|---|---|---|
| [auto-loom](./auto-loom/) | Agent-recorded demo videos: an agent drives your real app in a browser while ElevenLabs narrates, out to a polished MP4 with captions. One command: validate → audio → preflight → record → mux → verify. Loom without manual recording. This is the engine; auto-loom-proof requires it as a sibling folder. | `npx skills@latest add MikeFishbeinAtherial/infinite-headcount/auto-loom` |
| [auto-loom-proof](./auto-loom-proof/) | The factory's proof video: turns a build's acceptance criteria into a narrated MP4, Playwright performs each criterion in the real app while a voice explains what's being proven, plus a rendered test-results beat. Install auto-loom first. | `npx skills@latest add MikeFishbeinAtherial/infinite-headcount/auto-loom-proof` |
| [competitive-positioning](./competitive-positioning/) | 3-phase competitive intelligence sprint. Researches competitors' public pages via web fetch, builds battle cards, and produces a full positioning canvas. | `npx skills@latest add MikeFishbeinAtherial/infinite-headcount/competitive-positioning` |
| [eng-ghostwriter](./eng-ghostwriter/) | Generates 2-3 social post drafts from the current repository's code and git history, then saves a markdown file locally. No transcript access or external publishing. | `npx skills@latest add MikeFishbeinAtherial/infinite-headcount/eng-ghostwriter` |
| [factory](./factory/) | **Software Factory, start here.** The conductor: one command that walks you through the whole build pipeline and always knows what's next via a per-project state file. Works in Claude Code and Cursor. | `npx skills@latest add MikeFishbeinAtherial/infinite-headcount/factory` |
| [factory-explain](./factory-explain/) | Explain a codebase or build plan like you're 10: one coherent analogy scene, mermaid diagrams first, zero unexplained jargon. Explanations accumulate into a plain-language owner's manual. | `npx skills@latest add MikeFishbeinAtherial/infinite-headcount/factory-explain` |
| [factory-handoff](./factory-handoff/) | Plain-language contract walkthrough, then compiles the plan into one self-contained HANDOFF.md that runs as an overnight loop in Cursor or Claude Code: builder/checker roles, circuit breakers, guardrails, on-disk state. | `npx skills@latest add MikeFishbeinAtherial/infinite-headcount/factory-handoff` |
| [factory-plan](./factory-plan/) | Relentless one-question-at-a-time intake interview (recommendation attached to every question) → BRIEF.md → staged, dependency-ordered task list where every task is observable behavior. | `npx skills@latest add MikeFishbeinAtherial/infinite-headcount/factory-plan` |
| [factory-review](./factory-review/) | Fresh-eyes post-loop review: reads only the contract and the code, re-runs every criterion, actively tries to break the build, reports verdict-first in plain language. The builder never grades its own work. | `npx skills@latest add MikeFishbeinAtherial/infinite-headcount/factory-review` |
| [factory-tests](./factory-tests/) | Acceptance criteria and tests that PROVE work is correct: behavior + evidence formula, four cost-based test tiers, mandatory error paths, LLM-output property testing. Standalone on any task, feature, or component. | `npx skills@latest add MikeFishbeinAtherial/infinite-headcount/factory-tests` |
| [global-mermaid](./global-mermaid/) | Generate flexible, brand-aligned Mermaid diagrams for social posts, documentation, and general use. Outputs raw mermaid code plus an HTML wrapper with brand styling and diagonal backgrounds. Works with any mermaid renderer. | `npx skills@latest add MikeFishbeinAtherial/infinite-headcount/global-mermaid` |
| [interrogate-me](./interrogate-me/) | Adaptive context interview. Reads what you're working on, identifies the gaps, and asks the right questions, one at a time, with a hypothesis. Marketing-aware but general purpose. | `npx skills@latest add MikeFishbeinAtherial/infinite-headcount/interrogate-me` |
| [landing-page-copy](./landing-page-copy/) | Write conversion-focused landing page copy for any product or service. Outputs structured JSON covering hero, problem, features, who it's for, social proof, and CTA. | `npx skills@latest add MikeFishbeinAtherial/infinite-headcount/landing-page-copy` |
<!-- skills-list-end -->

---

## Mike's Personal Software Factory

This is my personal software factory. It turns ideas into working products while I sleep, no babysitting coding agents with prompts all day.

Cursor and Claude Code made writing code way easier. The harder problem is building a system that can context-engineer and manage itself. It starts with `/factory`, the foreman that sends in the right skill for the job. Here's the assembly line it runs:

1. **The Interviewer** (`factory-plan`) reads the existing codebase, if there is one, pulls the missing context out of you through an interview, and writes a product brief.
2. **The Planner** (`factory-plan`) turns the approved brief into small, testable features and dependency-ordered tasks.
3. **The Professor** (`factory-tests`) gives every task an exam before anyone writes code: the success criteria, and how the coding agent proves to itself the work holds up or needs another pass.
   - *(offered here)* **The Presenter** (`factory-explain`) explains the plan back to you like you're 10, with visual metaphor and mermaid charts. Coding agents write more code, faster than any human ever could; human understanding of that code is the new bottleneck, and this is what closes the gap.
4. **CTO to SWE Handoff** (`factory-handoff`) packages the brief, plan, tests, safety rails, and stop conditions into one work order, so the planning can run on a frontier model and the execution can run on a cheaper one.
5. **The Coffee** (Cursor or Claude Code `/loop`, the night shift) picks one task, builds it, sits its exam, records what happened, iterates if it needs to, then moves to the next task. Circuit breakers stop it from confidently digging a deeper hole while you sleep.
6. **The Grader** (`factory-review`) doesn't let the student grade its own homework. A fresh agent that never met the builder rereads the original plan, reruns the tests, and tries to find anything that's broken.
7. **Demo the Proof** (`auto-loom-proof`) drives the real app through its own acceptance criteria in a browser, adds an ElevenLabs voiceover explaining what's being proven, and sends you a narrated video showing evidence the software works.
   - *(offered here)* **The Explainer** (`factory-explain`, again) writes the plain-language owner's manual for what got built, so you understand your own codebase and can make decisions without becoming the bottleneck or outsourcing your thinking to AI.

Built on the loop-engineering canon: Karpathy ("if you can't evaluate it, you can't automate it"), Boris Cherny ("I don't prompt anymore, I write loops"), and Thariq Shihipar ("gather context, act, verify, repeat"), all packaged so you don't have to hold any of it in your head.

Install the whole family (`factory`, `factory-plan`, `factory-tests`, `factory-handoff`, `factory-review`, `factory-explain`, `auto-loom`, `auto-loom-proof`), then type `/factory` in any project:

```bash
for s in factory factory-plan factory-tests factory-handoff factory-review factory-explain auto-loom auto-loom-proof; do
  npx skills@latest add MikeFishbeinAtherial/infinite-headcount/$s
done
```

---

## Install a skill

```bash
npx skills@latest add MikeFishbeinAtherial/infinite-headcount/<skill-name>
```

Or copy any skill folder manually into `~/.claude/skills/` (Claude Code) and/or `~/.cursor/skills/` (Cursor 2.4+). Both tools read the same SKILL.md format; installing into both directories makes every skill available in every project in either tool.

---

## Getting started

- **Personal scope:** install into `~/.claude/skills/` (Claude Code) or `~/.cursor/skills/` (Cursor) to make a skill available in every project on your machine.
- **Project scope:** install into `.claude/skills/` (or `.cursor/skills/`) inside a repo to make it available only in that project, versioned with the code.
- **Restart your tool** after installing so it picks up the new skills.
- **Invoking:** skills trigger automatically when your request matches their description, or explicitly by name (e.g. `/factory`, or "use the competitive-positioning skill").
- **Prerequisites:** most skills, including `eng-ghostwriter`, are plain markdown and need nothing extra. `auto-loom` (and `auto-loom-proof`, which must be installed beside it) needs Node 18+, ffmpeg, Chromium via Playwright, and an ElevenLabs API key — TTS costs credits per render.

---

## Add all skills

```bash
npx skills@latest add MikeFishbeinAtherial/infinite-headcount
```

---

## Customize with your own examples

Skills get sharper when they know your brand. You can add a `references/` folder to any skill with markdown files containing your own copy examples, brand voice guidelines, or past work you want Claude to reference. The skill will use them as context when generating output.

For example: drop a `references/brand-voice.md` with copy you've written that hits the right tone, and Claude will write in that direction instead of defaulting to generic.

---

## License

MIT — see [LICENSE](./LICENSE).

---

Made by [@MikeFishbeinAtherial](https://github.com/MikeFishbeinAtherial)
