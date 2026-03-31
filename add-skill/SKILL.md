---
name: add-skill
description: Scaffold a new skill into the infinite-headcount repo. Creates the folder and SKILL.md, then updates the README skills list. Use when adding a new marketing skill to the repo.
---

# Add Skill

Scaffold a new skill into the infinite-headcount repo and keep the README in sync.

---

## Steps

1. **Collect info** — ask the user for:
   - Skill name (suggest a kebab-case slug if not provided)
   - One-sentence description (what it does and when to use it)
   - Any trigger phrases (optional — keywords that should auto-invoke it)
   - Any MCP tools required (optional)

2. **Create the skill folder and SKILL.md**

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

3. **Update the README**

   The README at `/Users/mikefishbein/Desktop/Vibe Coding/skills/README.md` has a skills list between these markers:
   ```
   <!-- skills-list-start -->
   <!-- skills-list-end -->
   ```

   Read the current contents between the markers, then replace the block with a sorted markdown table including all existing skills plus the new one.

   Table format:
   ```
   | Skill | Description | Install |
   |---|---|---|
   | [skill-name](./skill-name/) | Description here | `npx skills@latest add MikeFishbeinAtherial/infinite-headcount/skill-name` |
   ```

   Do not include `add-skill` itself in the table.

4. **Confirm** — tell the user:
   - The file that was created
   - That the README was updated
   - Remind them to commit and push when ready
