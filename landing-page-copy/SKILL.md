---
name: landing-page-copy
description: Write conversion-focused landing page or homepage copy for any product, service, or solution. Use when the user asks to write, create, draft, or generate landing page content, homepage copy, website copy, product pages, or any marketing page that needs to convert visitors. Also use when the user provides project details, client briefs, or context and asks for web copy or page content.
triggers: landing page, homepage copy, website copy, page copy, convert visitors, marketing page
---

# Landing Page Copywriting

Write high-converting landing page copy that drives action. Produces a full structured page with all sections as valid JSON — ready to populate a landing page template.

## Core Sections

Every landing page includes these sections in order:

1. **Hero** — immediate value proposition or capabilities 
2. **Problem** — pain points and the cost of the status quo
3. **Features & Benefits** — 3 core capabilities with specific outcomes
4. **Who It's For** — self-selection signals that qualify and attract the right buyer
5. **Social Proof** — testimonials and/or client logos
6. **Closing CTA** — one clear action

## Output Format

Always output valid JSON matching this exact schema:

```json
{
  "category_name": "string",
  "hero_header": "string",
  "hero_subheader": "string",
  "hero_image_alt": "string",
  "problem_header": "string",
  "problem_subheader": "string",
  "feature_1_title": "string",
  "feature_1_description": "string",
  "feature_2_title": "string",
  "feature_2_description": "string",
  "feature_3_title": "string",
  "feature_3_description": "string",
  "who_its_for_header": "string",
  "who_its_for_intro": "string",
  "who_signal_1": "string",
  "who_signal_2": "string",
  "who_signal_3": "string",
  "who_qualifier": "string",
  "social_proof_header": "string",
  "testimonial_1_quote": "string",
  "testimonial_1_name": "string",
  "testimonial_1_title": "string",
  "testimonial_2_quote": "string",
  "testimonial_2_name": "string",
  "testimonial_2_title": "string",
  "testimonial_3_quote": "string",
  "testimonial_3_name": "string",
  "testimonial_3_title": "string",
  "logos_note": "string",
  "cta_header": "string",
  "cta_subheader": "string",
  "cta_button": "string",
  "cta_supporting_line": "string"
}
```

---

## Writing Guidelines by Section

### Category Name
- Be specific and descriptive in 5 words or less
- Signal what kind of product or service this is
- Examples: "Custom AI Sales Roleplay Trainer", "B2B Content Strategy System", "AI-Powered Finance Report Generator"

### Hero Section

**hero_header:**
- Communicate the primary outcome or benefits
- Lead with what changes for the customer or new capabilities
- Punchy, active, 6–12 words
- No fluff verbs: not "streamline", "empower", "transform", "revolutionize"

**hero_subheader:**
- Who it's for + what they get + how it works
- 1 long sentence or 2 short sentences
- Include a concrete outcome or time-saving if possible

**hero_image_alt:**
- A text description of the ideal image to show here (product screenshot, team photo, customer scenario, etc.)
- Prefix with "IMAGE:" so the user knows this is a placement note, not copy
- Example: "IMAGE: Product dashboard showing key metrics at a glance"

### Problem Section

**problem_header:**
- Name the problem the reader recognizes in themselves
- Short, specific, relatable
- Not "challenges exist" — name the actual challenge

**problem_subheader:**
- Specific pain points with real consequences
- Name what the reader has already tried (and why it didn't work)
- 2–3 short sentences

### Features & Benefits (3 features)

For each feature:

**title:**
- What the feature does, not what it is
- Outcome-led, not label-led

**description:**
- Sentence 1: the specific problem this feature addresses
- Sentence 2: the benefit or outcome it creates
- Sentence 3 (optional): concrete example or additional detail
- 2–3 sentences total

### Who It's For

**who_its_for_header:**
- Invite the right person to identify themselves
- Examples: "Built for teams that...", "This is for you if...", "Who it works for"

**who_its_for_intro:**
- 1–2 sentences setting up the self-selection signals

**who_signal_1 / 2 / 3:**
- Each signal = one sentence describing a scenario the right buyer recognizes
- Written in second person ("You...")
- Should make the right person lean in and feel seen
- Should quietly filter out the wrong person

**who_qualifier:**
- A pricing or engagement signal that sets expectations
- For premium products: signal the range without showing a price card
- For self-serve: frame the commitment level
- Example: "We work with a small number of clients at a time. Typical engagements start at $X."
- Leave empty string if no qualifier is needed

### Social Proof

**social_proof_header:**
- Simple label, e.g. "What clients say", "Results", "In their words"

**testimonial_1/2/3 (quote, name, title):**
- Use real testimonials if provided
- If no testimonials provided, write compelling placeholder quotes that represent the ideal outcome — label them clearly as "[PLACEHOLDER — replace with real testimonial]"
- Quotes should be specific and outcome-focused, not generic ("It's great!")
- Name and title: "[First Name Last Name], [Title] at [Company]" — use "[Name], [Title]" as placeholder format

**logos_note:**
- If the user has client logos: "LOGOS: Display [company names] logos here"
- If no logos: leave as empty string or "LOGOS: Add client logos here when available"

### Closing CTA

**cta_header:**
- Mirror the hero headline's core idea
- The last thing they read before deciding

**cta_subheader:**
- Reinforce the primary benefit or remove friction
- 1 sentence

**cta_button:**
- Action-oriented, specific
- Not "Submit" or "Click Here"
- Examples: "Book a Call", "Start Free", "See a Demo", "Get Started Today"

**cta_supporting_line:**
- Micro-copy that removes the last objection
- Examples: "No commitment. No sales deck.", "Free for 14 days. No credit card required.", "Typically respond within 1 business day."

---

## Copywriting Voice & Style

- Authoritative and confident
- Short sentences — one idea per sentence
- No em-dashes (—)
- No fluff: "innovative", "cutting-edge", "world-class", "game-changing"
- Active voice throughout
- Specific over general — numbers, timeframes, named processes beat vague claims
- Lead with benefits, not features
- Add a `references/` folder with your own copy examples to calibrate the voice to your brand

---

## Context Extraction

When the user provides a brief, description, or existing materials — extract:

- **Core capability**: what the solution actually does
- **Target audience**: who it's for, role and company type
- **Main problem**: the specific pain it solves
- **Key features**: the 3 most important capabilities
- **Outcomes**: measurable results or benefits
- **Differentiation**: what makes it different from alternatives
- **Pricing / deal size**: if mentioned, use to calibrate the tone and qualifier

If critical information is missing (especially target audience and main problem), ask before writing.

---

## Common Mistakes to Avoid

- Don't write a hero headline that could apply to any company in the category
- Don't list features without the "so what?" — every feature needs a benefit
- Don't write problem sections that lecture the reader — validate, then explain
- Don't use testimonials that say "It's great!" — specificity is credibility
- Don't leave the CTA vague — tell them exactly what happens when they click
- Don't write long paragraphs — 2–3 sentences maximum per block
