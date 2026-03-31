---
name: add-skill
description: Scaffold a new skill into the infinite-headcount repo. Creates the folder and SKILL.md, updates the README skills table, and updates the org diagram. Use when adding a new marketing skill to the repo.
---

# Add Skill

Scaffold a new skill into the infinite-headcount repo and keep the README fully in sync — both the skills table and the org diagram.

---

## Steps

### 1. Collect info

Ask the user for:
- **Skill name** (suggest a kebab-case slug if not provided)
- **One-sentence description** (what it does and when to use it)
- **Trigger phrases** (optional — keywords that should auto-invoke it)
- **MCP tools required** (optional)
- **Parent skill** — ask: "Does this skill depend on another skill running first, or is it a standalone peer?" For most skills the answer will be `interrogate-me` (runs first for context) or standalone.

---

### 2. Create the skill folder and SKILL.md

Path: `/Users/mikefishbein/Desktop/Vibe Coding/skills/<skill-name>/SKILL.md`

Template:
```
---
name: <skill-name>
description: <description>
---

# <Skill Title>

<One paragraph explaining what this skill does and when to use it.>

---

## Instructions

<Step-by-step instructions for Claude to follow when this skill is invoked.>
```

---

### 3. Update the README skills table

The README at `/Users/mikefishbein/Desktop/Vibe Coding/skills/README.md` has a skills list between these markers:
```
<!-- skills-list-start -->
<!-- skills-list-end -->
```

Read the current contents, then replace with a sorted markdown table including all existing skills plus the new one.

Table format:
```
| Skill | Description | Install |
|---|---|---|
| [skill-name](./skill-name/) | Description here | `npx skills@latest add MikeFishbeinAtherial/infinite-headcount/skill-name` |
```

Do not include `add-skill` itself in the table.

---

### 4. Update the org diagram

The README has a diagram between these markers:
```
<!-- org-diagram-start -->
<!-- org-diagram-end -->
```

Read the current diagram. Then redraw it with the new skill added as a box in the bottom row, connected via the horizontal branch line from `interrogate-me`.

**Box format** (keep all boxes the same width — 31 chars inner, 33 chars total with borders):
```
┌───────────────────────────────┐
│        skill-name             │
└───────────────────────────────┘
```

Center the skill name inside the box with spaces. If the name is longer than 29 chars, allow the box to be wider but keep it consistent with its siblings.

**Branch pattern** — the horizontal line under `interrogate-me` branches once per skill using `┬`. For N skills in the bottom row:
- The horizontal line spans from beneath `interrogate-me` outward
- Each branch point drops a `▼` down to a box
- Spacing between boxes: approximately 5–10 spaces

**Example with 3 skills:**
```
                              ┌──────────────────────────────────┐
                              │          interrogate-me           │
                              │      run first for context        │
                              └────────────────┬─────────────────┘
                                               │
    ┌──────────────────────────────────────────┼──────────────────────────────────────────┐
    ▼                                          ▼                                          ▼
┌───────────────────────────────┐  ┌───────────────────────────────┐  ┌───────────────────────────────┐
│     competitive-positioning   │  │       landing-page-copy       │  │          new-skill            │
└───────────────────────────────┘  └───────────────────────────────┘  └───────────────────────────────┘
```

If a skill has a different parent (not `interrogate-me`), nest it below its parent box instead using the same vertical branch pattern.

Replace the entire content between the markers (including the fenced code block) with the redrawn diagram.

---

### 5. Confirm

Tell the user:
- The file path that was created
- That the README skills table was updated
- That the org diagram was updated
- Remind them to commit and push: `cd "/Users/mikefishbein/Desktop/Vibe Coding/skills" && git add -A && git commit -m "Add [skill-name] skill" && git push`
