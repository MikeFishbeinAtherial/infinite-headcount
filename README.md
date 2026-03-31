# infinite-headcount

Marketing skills for Claude Code Claude, and AI agents. Copywriting, Positioning, SEO, content strategy, design, and more coming soon.

Clone this repo and you have a marketing department.

---

## Skill Map

<!-- org-diagram-start -->
```
                                       ┌─────────────────┐
                                       │       YOU        │
                                       └────────┬─────────┘
                                                │
          ┌─────────────────────────────────────┼─────────────────────────────────┐
          ▼                                     ▼                                 ▼
┌─────────────────────────────┐   ┌─────────────────────────────┐   ┌─────────────────────────────┐
│      interrogate-me         │   │  competitive-positioning     │   │     landing-page-copy       │
└─────────────────────────────┘   └─────────────────────────────┘   └─────────────────────────────┘
  · · use with any skill · ·                · · · · · · · · · · · · · · · ↗  common next step
```
<!-- org-diagram-end -->

---

## Skills

<!-- skills-list-start -->
| Skill | Description | Install |
|---|---|---|
| [competitive-positioning](./competitive-positioning/) | 3-phase competitive intelligence sprint. Scrapes competitors, builds battle cards, and produces a full positioning canvas. | `npx skills@latest add MikeFishbeinAtherial/infinite-headcount/competitive-positioning` |
| [interrogate-me](./interrogate-me/) | Adaptive context interview. Reads what you're working on, identifies the gaps, and asks the right questions — one at a time, with a hypothesis. Marketing-aware but general purpose. Use with any skill. | `npx skills@latest add MikeFishbeinAtherial/infinite-headcount/interrogate-me` |
| [landing-page-copy](./landing-page-copy/) | Write conversion-focused landing page copy for any product or service. Outputs structured JSON covering hero, problem, features, who it's for, social proof, and CTA. | `npx skills@latest add MikeFishbeinAtherial/infinite-headcount/landing-page-copy` |
<!-- skills-list-end -->

---

## Install a skill

```bash
npx skills@latest add MikeFishbeinAtherial/infinite-headcount/<skill-name>
```

Or copy any skill folder manually into `~/.claude/skills/`.

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

Made by [@MikeFishbeinAtherial](https://github.com/MikeFishbeinAtherial)
