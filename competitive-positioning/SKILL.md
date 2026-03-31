---
name: competitive-positioning
description: "Run a full competitive positioning exercise for any company or product. Produces competitive battle cards and a positioning canvas. Use when the user wants to research competitors, build battle cards, identify positioning gaps, create a category name, define an ICP, or develop a messaging strategy. Trigger when the user says things like 'help me position X', 'who are my competitors', 'what should our messaging be', 'help me figure out what makes us different', or 'scrape competitor websites'."
triggers: positioning, competitive intelligence, competitive analysis, positioning statement, differentiation, brand strategy, battle cards, positioning canvas
---

# Competitive Positioning

Run a structured competitive intelligence and positioning exercise. Produces:
1. Competitive battle cards for each competitor (scraped from live sites)
2. A positioning canvas (category name, ICP, problem, messaging pillars, headline options)

Work through the three phases in order. Do not skip Phase 1 — the grilling is what makes the canvas sharp.

---

## Phase 1: Context Gathering (Grill the User)

Before touching competitor research, interview the user to build a full picture of their business. Ask one question at a time, provide a recommended answer hypothesis with each question, and resolve each before moving on.

**Ask these questions in order, one at a time:**

### Q1 — ICP
"When you picture the ideal customer — the one you'd clone 10 times — what do they do and what's the specific pain that makes them come to you?"

*Offer a hypothesis based on what you already know. Ask them to confirm or correct.*

### Q2 — Primary Transformation
"When a customer finishes with your product or service and they're thrilled — what specifically changed for them?"

Offer multiple choice options tailored to what you know. General options:
- They saved significant time or eliminated manual work
- They finally have visibility or data they didn't have before
- Their product or service now has a new capability
- They unlocked a new channel or revenue stream
- They reduced risk or avoided a costly problem

### Q3 — Delivery Model
"How does your company actually deliver value?"

- Physical product
- Software / SaaS
- Service — project-based
- Service — retainer / ongoing
- Service — embedded
- Marketplace or platform
- Hybrid

### Q4 — Key Differentiator
"What's the one thing you do better than everyone else in your space?"

- Senior expertise or deeper experience
- Strategy and execution from the same team
- Speed
- Custom or bespoke approach vs. templated solutions
- Niche domain expertise
- Price / value

### Q5 — Sales Conversation Intelligence
"Walk me through the last two or three customers you closed. What was the moment they said yes? What phrase did they use that told you they were sold?"

*This is the most important question. The answer almost always contains the positioning idea.*

### Q6 — Category Name
"Do you have a category name — how you describe what you do in a few words — or are you open to inventing one?"

- I have one I want to refine
- I'm open to your recommendation
- I want to invent a new category name entirely

### Q7 — Pricing / Deal Size
"What's the typical price or deal size? This informs how premium the positioning should feel."

### Q8 — Customer Size
"What's the revenue range or profile of the companies or people you sell to best?"

---

After completing the grilling, summarize back in a brief "Here's what I heard" recap. Get confirmation before moving to Phase 2.

---

## Phase 2: Competitive Research & Battle Cards

### Step 1: Collect Competitor URLs

Ask the user: "Give me your top 3–5 competitors — names and URLs if you have them. If you only have names, I'll find the URLs."

For each competitor without a URL, use `web_search` to find it.

### Step 2: Scrape Each Competitor Site

For each competitor, use `web_fetch` to retrieve:
- The homepage
- The About or How It Works page
- Any services or pricing page

**Extract from each site:**
- Hero headline and subheadline
- Category name or how they describe themselves
- ICP signals (who they say they serve)
- Problem framing
- Delivery model
- Key differentiators or unique claims
- Proof signals (case studies, logos, testimonials, numbers)
- Pricing signals
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

WEAKNESSES / GAPS
- [bullet]
- [bullet]

MEMORABLE LINES
- "[exact quote from site]"

BADGES: [label] [label] [label]
```

### Step 4: Comparison Table

Side-by-side across all competitors + the user's company as the target column:

| Dimension | Comp 1 | Comp 2 | Comp 3 | [User's Company] |
|---|---|---|---|---|
| Category name | | | | |
| Primary ICP | | | | |
| Delivery model | | | | |
| Core differentiator | | | | |
| Proof / credibility | | | | |
| Positions vs. what? | | | | |
| Pricing signals | | | | |

### Step 5: Gap Analysis

Write a 2–3 paragraph "The Gap [Company] Can Own" insight. Name:
- What all competitors share (the angle they all cluster around)
- What none of them credibly own
- The specific territory the user's company can claim

---

## Phase 3: Positioning Canvas

Use everything from Phase 1 and Phase 2 to build the canvas. Produce all 11 sections in order.

---

**1. Category Name**

3–4 options. Each should be 3–5 words that communicate what kind of company or product this is. Signal the most important differentiator. Avoid labels every competitor also uses — if "agency," "platform," or "solution" are invisible in this space, find a more ownable label.

---

**2. ICP — Company Profile**

Describe the ideal company to sell to:
- Company type and ownership structure
- Revenue range or headcount
- Industry / vertical (or "any vertical" if truly broad)
- Internal capabilities they have and don't have (be specific — not "no team" but "no dedicated [function]")
- Buying trigger: what just happened in their business that makes them ready to buy now

---

**3. ICP — Buyer Persona**

Describe the individual who champions and closes the purchase:
- Job title and level
- What they're responsible for
- What they're measured on (what makes them look good or bad)
- Their relationship to the problem (do they feel it daily, or is it a strategic concern?)
- Decision-making role: sole buyer, champion, committee member

---

**4. Use Cases**

List the specific scenarios where this product or service gets used. Each use case should be a one-sentence job: "When [situation], the customer uses [product] to [outcome]."

Aim for 3–6 use cases. These should be distinct — don't list the same use case in different words.

---

**5. Capabilities**

What the product or service can do — the functional abilities that enable the use cases. Write as active statements ("Scrapes competitor sites and extracts positioning signals") not feature labels ("Competitor scraping").

Capabilities are broader than features — they describe what becomes possible, not just what exists.

---

**6. Competitive Alternatives**

What does the buyer do instead of using this? List all real alternatives — these may include:
- Direct competitors (named companies in the same category)
- Category alternatives (a different type of solution solving the same problem)
- Legacy processes (spreadsheets, email, manual workflows)
- In-house approaches (hiring someone, building it internally)
- Doing nothing (the status quo)

For each alternative, name it specifically. This list is the foundation for differentiation.

---

**7. Shortcomings of Competitive Alternatives**

For each alternative listed in section 6, identify the key shortcoming — the specific reason a buyer who has tried or considered it would still be looking for something better. Pull from Phase 2 battle card research where possible. Focus on shortcomings the target buyer actually experiences and cares about, not theoretical weaknesses.

---

**8. First-Order Benefits**

The direct, immediate benefits a customer experiences after starting to use the product or service. These are felt quickly — within the first session, week, or engagement. Frame from the customer's perspective.

Examples: "Stops spending 3 hours manually researching each competitor." "Gets a clear positioning statement instead of a blank page."

---

**9. Business Outcomes**

The higher-order results the customer achieves over time — what changes in their business, career, or competitive position as a result of the first-order benefits compounding. These are the outcomes a buyer is actually buying, even if they describe the product in functional terms.

Examples: "Faster time to market on new products." "Sales team closes at a higher rate because messaging resonates." "Attracts higher-quality leads who are pre-sold on the value."

---

**10. Features / Services**

The specific, nameable things the product or service includes. More concrete than capabilities — these are the deliverables or modules a customer would list if describing what they got.

Format each as: **[Feature/Service Name]** — one-sentence description of what it is and what it does.

---

**11. Differentiators**

What makes this product or service meaningfully better than the competitive alternatives on the dimensions that matter most to the buyer. Differentiators must be:
- True (you can back it up)
- Relevant (the buyer actually cares about this dimension)
- Provable (you have evidence, not just a claim)
- Owned (competitors can't credibly make the same claim right now)

For each differentiator, name it, explain why it matters to the buyer, and state why the competition can't match it.

---

## Output Format

If the Atherial design system skill is available, render as a styled HTML document with:
- Dark sidebar with section navigation
- Two sections: Competitor Analysis, Positioning Canvas
- Battle cards using the card component
- Comparison table using the table component
- Canvas elements using pos-card (dark) components
- See `references/output-format.md` for exact HTML patterns

Otherwise, output as clean structured markdown with clear section headers.

Save the output as `[company-name]-positioning-canvas.html` (or `.md`) and share it.

---

## Reference Files

- `references/output-format.md` — HTML/CSS output format using the Atherial design system
- `references/example-battle-card.md` — Annotated example of a completed battle card
- `references/homepage-copy-examples.md` — Copy voice and style reference

---

## Common Mistakes to Avoid

- **Don't skip Phase 1.** The Q5 answer (what made customers say yes) almost always contains the positioning idea.
- **Don't invent competitor claims.** Only use copy scraped from live sites. If a site is inaccessible, note it and move on.
- **Don't list verticals unless asked.** Broad positioning usually outperforms narrow for multi-sector companies.
- **Don't make the category name sound like everyone else's.** If every competitor uses "agency" or "platform," those words are invisible.
- **Don't try to say three things in one headline.** Pick the most resonant single idea.
