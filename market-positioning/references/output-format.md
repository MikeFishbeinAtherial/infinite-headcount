# Output Format Reference — Atherial Design System

This file documents the HTML/CSS patterns to use when rendering the positioning strategy document. Read `/mnt/skills/user/atherial-design-system/SKILL.md` for the full design system before generating output.

## Document Structure

```html
<!-- Three-section document with fixed dark sidebar -->
<aside class="sidebar">
  <div class="sidebar-logo">
    <div class="name">[Company Name]</div>
    <div class="sub">Positioning Strategy</div>
  </div>
  <a href="#competitor" class="nav-item active">01 — Competitor Analysis</a>
  <a href="#positioning" class="nav-item">02 — Positioning Framework</a>
  <a href="#homepage" class="nav-item">03 — Homepage Copy</a>
</aside>

<main class="main">
  <div id="competitor">...</div>
  <div id="positioning">...</div>
  <div id="homepage">...</div>
</main>
```

## Section Dividers

```html
<div class="section-divider"><span>01 — Competitor Analysis</span></div>
```

## Battle Cards

Use `.two-col` grid for pairs, single `.card` for solo competitor:

```html
<div class="two-col">
  <div class="card reveal">
    <div class="card-title">Competitor Name</div>
    <div class="card-meta">Model description / ICP</div>
    <div class="section-divider"><span>What they do well</span></div>
    <ul class="styled">
      <li>...</li>
    </ul>
    <div class="section-divider"><span>Weaknesses</span></div>
    <ul class="styled">
      <li>...</li>
    </ul>
    <div style="margin-top: 14px;">
      <span class="badge accent">Label</span>
      <span class="badge">Label</span>
    </div>
  </div>
</div>
```

## Comparison Table

```html
<div class="table-wrap reveal">
  <table>
    <thead>
      <tr>
        <th>Dimension</th>
        <th>Competitor 1</th>
        <th>Competitor 2</th>
        <th>[User Company] (Target)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Category name</strong></td>
        <td>Their name</td>
        <td>Their name</td>
        <td>Recommended name</td>
      </tr>
    </tbody>
  </table>
</div>
```

## Gap / Insight Cards

Use `.insight-card` (pale lime background) for strategic insights:

```html
<div class="insight-card reveal">
  <div class="card-title">The Gap [Company] Can Own</div>
  <div class="card-meta">Strategic opportunity</div>
  <p>...</p>
</div>
```

## Positioning Elements

Use `.pos-card` (dark background with texture) for positioning framework elements:

```html
<div class="pos-card reveal">
  <div class="card-title">Core Positioning Idea</div>
  <div class="card-meta">The central insight driving all messaging</div>
  <div class="value">The Imagination Gap</div>
  <p>...</p>
</div>
```

## Messaging Pillars

Use `.grid-3` with `.pos-card` children:

```html
<div class="grid-3 reveal">
  <div class="pos-card">
    <div class="card-title">01 — Primary Differentiator</div>
    <div class="card-meta">Label</div>
    <p>...</p>
    <div style="margin-top: 12px; height: 2px; background: var(--accent); width: 24px;"></div>
  </div>
  <!-- repeat x3 -->
</div>
```

## Homepage Copy Sections

Each homepage section uses `.hp-section` with a dark header bar:

```html
<div class="hp-section reveal">
  <div class="hp-section-header">
    <span>Hero Section</span>
    <span>Above the fold</span>
  </div>
  <div class="hp-section-body">
    <div class="accent-bar"></div>
    <div class="copy-block">
      <div class="copy-label">Hero Headline</div>
      <div class="copy-text hero-size">The headline goes here.</div>
    </div>
    <div class="copy-block">
      <div class="copy-label">Subheadline</div>
      <div class="copy-text large">The subheadline goes here.</div>
    </div>
  </div>
</div>
```

## Copy Block Types

```html
<!-- Standard copy -->
<div class="copy-text">Body copy here.</div>

<!-- Hero/headline size (15px, 600 weight) -->
<div class="copy-text hero-size">Big headline here.</div>

<!-- Large body (14px) -->
<div class="copy-text large">Subheadline or intro paragraph here.</div>

<!-- Muted/secondary -->
<div class="copy-text" style="color: var(--text-muted);">Placeholder or note.</div>
```

## Scroll Reveal Script

Include this at the bottom of every document:

```javascript
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.05 });
reveals.forEach(el => observer.observe(el));

const sections = ['competitor', 'positioning', 'homepage'];
const navItems = document.querySelectorAll('.nav-item');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 100) current = id;
  });
  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('href') === '#' + current) item.classList.add('active');
  });
});
```
