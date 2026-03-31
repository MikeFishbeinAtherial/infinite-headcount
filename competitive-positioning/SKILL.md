---
name: competitive-positioning
description: "Run a full competitive positioning and intelligence exercise for any company or product. Use this skill whenever the user wants to research competitors, develop positioning or messaging, create a category name, define an ICP, write website or landing page copy, create competitive battle cards, or figure out how to differentiate a product or service. Also trigger when the user says things like 'help me position X', 'who are my competitors', 'what should our messaging be', 'help me figure out what makes us different', 'create a strategy doc for our website', or 'scrape competitor websites'. This skill replicates a full consulting-grade workflow: competitor scraping, battle cards, positioning framework, and homepage copy. Always use this skill when the request involves understanding a competitive landscape AND developing messaging or copy in response to it."
triggers: positioning, messaging, homepage copy, landing page copy, competitive intelligence, competitive analysis, positioning statement, differentiation, brand strategy, market research
---

# Market Positioning & Competitive Intelligence

This skill runs a structured competitive intelligence and brand positioning exercise. It produces:
1. Competitive battle cards for each competitor (scraped from live sites)
2. A positioning framework (category name, ICP, messaging pillars, taglines)
3. Full homepage or landing page copy

Work through the three phases in order. Do not skip Phase 1 — the grilling process is what produces the insight that makes the positioning and copy sharp.

---

## Phase 1: Context Gathering (Grill the User)

Before touching any competitor research, interview the user to build a full picture of their business. Ask one question at a time, provide a recommended answer hypothesis with each question, and resolve each branch before moving on.

**Ask these questions in order, one at a time:**

### Q1 — ICP
"When you picture the ideal customer — the one you'd clone 10 times — what do they do and what's the specific pain that makes them come to you?"

*Recommended answer prompt: Offer a hypothesis based on what you know. Ask them to confirm or correct.*

### Q2 — Primary Transformation
"When a customer finishes with your product or service and they're thrilled — what specifically changed for them?"

Offer multiple choice options tailored to what you already know about their business. General options:
- They saved significant time or eliminated manual work
- They finally have visibility or data they didn't have before
- Their product or service now has a new capability
- They unlocked a new channel or revenue stream
- They reduced risk or avoided a costly problem
- All of the above — it depends on the customer

### Q3 — Delivery Model
"How does your company actually deliver value?"

- Physical product
- Software / SaaS
- Service — project-based (defined scope and timeline)
- Service — retainer / ongoing relationship
- Service — embedded (working inside the client's team)
- Marketplace or platform
- Hybrid (e.g., software + services)

### Q4 — What You Actually Deliver
"What does a customer walk away with — the tangible output?"

Tailor options to what you know. General options:
- A physical product
- Software or a working application
- A completed campaign or creative deliverable
- A strategy document or roadmap
- Ongoing execution (reports, content, management)
- Training or enablement
- Integrations or automations
- A mix depending on the engagement

### Q5 — Team or Company Structure
"Who does the work?"

- Solo founder / freelancer
- Small senior team (2–5 people)
- Mid-size team with specialists
- Scales with contractors per project
- Large team / established company

### Q6 — Key Differentiator
"What's the one thing you do better than everyone else in your space?"

- Senior expertise or deeper experience
- Strategy and execution from the same team — no handoff gap
- Speed
- Custom or bespoke approach vs. templated solutions
- Niche domain expertise in a specific industry
- Price / value
- Relationships or access

### Q7 — Sales Conversation Intelligence
"Walk me through the last two or three customers you closed. What was the moment they said yes? What phrase did they use that told you they were sold?"

*This is the most important question. Listen for the emotional truth — the line that becomes the headline. The insight from a real sales conversation almost always contains the positioning idea.*

### Q8 — Category Name
"Do you have a category name in mind — how you describe what you do in a few words — or are you open to inventing one?"

- I have one I want to refine
- I'm open to your recommendation
- I want to invent a new category name entirely

### Q9 — Pricing / Deal Size
"What's the typical price or deal size? This informs how premium the positioning should feel."

*A $99/month SaaS and a $500K annual retainer require different messaging registers.*

### Q10 — Customer Revenue or Size
"What's the size of the companies or type of people you sell to best?"

---

After completing the grilling, summarize back to the user in a brief "Here's what I heard" recap before moving to Phase 2. Get confirmation before proceeding.

---

## Phase 2: Competitive Research & Battle Cards

### Step 1: Collect Competitor URLs

Ask the user: "Give me a list of your top 3–5 competitors — names and website URLs if you have them. If you only know names, I'll find the URLs."

For each competitor where a URL is not provided, use `web_search` to find it.

### Step 2: Scrape Each Competitor Site

For each competitor, use `web_fetch` to retrieve:
- The homepage (root URL)
- The "About" or "How It Works" page if linked from homepage
- Any services, pricing, or product page

**What to extract from each site:**
- Hero headline and subheadline
- Category name or how they describe themselves
- ICP signals (who they say they serve)
- Problem framing (how they describe the customer's pain)
- Delivery model (how they describe their process)
- Key differentiators or unique claims
- Proof signals (case studies, logos, testimonials, numbers)
- Any pricing signals
- Memorable lines or ownable language

### Step 3: Build Battle Cards

For each competitor, produce a battle card. See `references/example-battle-card.md` for a quality example.

```
COMPETITOR NAME
Category: [how they describe themselves]
ICP: [who they target]
Delivery: [how they work]

WHAT THEY DO WELL
- [bullet]
- [bullet]
- [bullet]

WEAKNESSES / GAPS
- [bullet]
- [bullet]
- [bullet]

MEMORABLE LINES
- "[exact quote from site]"

BADGES: [label] [label] [label]
```

### Step 4: Comparison Table

After individual battle cards, produce a side-by-side comparison table across all competitors + the user's company (target column). Dimensions:

| Dimension | Comp 1 | Comp 2 | Comp 3 | [User's Company] |
|---|---|---|---|---|
| Category name | | | | |
| Primary ICP | | | | |
| Delivery model | | | | |
| Core differentiator | | | | |
| Proof / credibility | | | | |
| Positions vs. what? | | | | |
| Team credentialing | | | | |
| Pricing signals | | | | |

### Step 5: Gap Analysis

After the table, write a 2–3 paragraph "The Gap [Company] Can Own" insight card. This should:
- Name what all competitors share (the shared angle they all position around)
- Identify what none of them credibly own
- Name the specific intersection the user's company can claim

---

## Phase 3: Positioning Framework & Homepage Copy

Use everything from Phase 1 (company context) and Phase 2 (competitive landscape) to build the positioning framework.

### Positioning Framework Output

Produce these elements:

**1. Category Name (3–4 options)**
- Should communicate what kind of company this is in 3–5 words
- Signal the most important differentiator
- Avoid generic labels that every competitor also uses

**2. Core Positioning Idea (1 paragraph)**
The single insight that drives all messaging. It usually comes from Q7 (the sales conversation answer). Name it explicitly so the user can reference it internally.

**3. Ideal Customer Profile (bullet list)**
- Customer type / company type
- Size or revenue range
- Any vertical focus (or explicitly "any vertical")
- What they have / don't have internally
- Buying trigger (what makes them ready to buy now)
- Decision-maker profile

**4. The Problem We Solve (bullet list)**
Frame from the customer's perspective. Be specific — name real frustrations, not generic ones.

**5. Three Messaging Pillars**
One paragraph each. Label them 01, 02, 03. These should be distinct angles — don't repeat the same idea three ways.

**6. Shared Enemy**
Who or what do all competitors in this space position against? Name it. Explain why positioning against the same enemy is correct — buyers already resent that enemy and this creates instant alignment.

**7. Hero Headline Options (5 variations)**
- Option A: Leads with the core positioning idea (recommended)
- Option B: Customer outcome or transformation
- Option C: Anti-incumbent (vs. the shared enemy)
- Option D: Discovery or process framing
- Option E: Bold category claim

---

### Homepage Copy Output

Produce full single-page website copy in this section order. For each section include: section name, intent note, all copy elements labeled clearly.

1. **Navigation** — logo name + right links
2. **Hero** — eyebrow label, headline, subheadline, CTA buttons, social proof bar note
3. **Problem Section** — section headline, body copy (3 paragraphs), three pain point callouts
4. **What We Do** — section headline, intro paragraph, three service or product descriptions
5. **How It Works** — section headline, 3–5 step process
6. **Who It's For** — section headline, body copy, three self-selection signals, engagement or pricing qualifier
7. **Team & Credibility** — section headline, intro, bios or credentials, one-liner dynamic
8. **Social Proof** — placeholder structure with format guidance for when testimonials/logos are ready
9. **Closing CTA** — section headline, subheadline, CTA button, supporting line
10. **Footer** — company name, category label, contact, socials, copyright

**Copy voice rules (apply throughout):**
- Authoritative and confident
- Short sentences. No em-dashes.
- Lead with benefits, not features
- No fluff ("innovative", "cutting-edge", "world-class", "transformative")
- Specificity beats generality — numbers, named processes, concrete outcomes
- No vertical list unless the user explicitly wants one
- See `references/homepage-copy-examples.md` for strong vs. weak examples by section

---

## Output Format

If the Atherial design system skill is available, read it and render the full output as a styled HTML document with:
- Dark sidebar with section navigation
- Three sections: Competitor Analysis, Positioning Framework, Homepage Copy
- Battle cards using the card component
- Comparison table using the table component
- Positioning elements using pos-card (dark) components
- Homepage sections using hp-section components
- See `references/output-format.md` for exact HTML patterns

If the design system is not available, output as clean structured markdown with clear section headers.

Save the output to a file named `[company-name]-positioning-strategy.html` (or `.md`) and share it with the user.

---

## Reference Files

- `references/output-format.md` — HTML/CSS output format using the Atherial design system
- `references/example-battle-card.md` — Annotated example of a completed battle card
- `references/homepage-copy-examples.md` — Before/after copy examples by section

---

## Common Mistakes to Avoid

- **Don't skip Phase 1.** The grilling is where the insight comes from. The Q7 answer (what made customers say yes) almost always contains the positioning idea.
- **Don't invent competitor claims.** Only use copy scraped from live sites. If a site is inaccessible, note it and move on.
- **Don't list verticals unless the user asks.** Broad positioning usually outperforms narrow for companies that serve multiple sectors.
- **Don't use fear-based copy** ("you'll be left behind") unless the user explicitly wants it. Aspirational outperforms fear at premium price points.
- **The hero headline should do one thing.** Don't try to say three things in one line. Pick the most resonant single idea.
- **Pricing signal matters.** If it's a high-ticket product or service, the copy needs to qualify buyers. Include at least one line that signals the engagement size or price range.
- **Don't make the category name sound like everyone else's.** If every competitor calls themselves an "agency" or "platform," those words are invisible. Find the label that's one step more specific or more evocative.
