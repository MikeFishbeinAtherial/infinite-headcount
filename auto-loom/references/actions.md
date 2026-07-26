# Action reference

Actions run inside each beat, spread across the first 55% of the beat's audio
duration; the final state holds for the remaining 45% so the viewer can absorb
the screen before the next beat.

| `fn` | What it does | Required fields |
|---|---|---|
| `waitFor` | Wait for selector to be visible (up to 10s) | `sel` |
| `wait` | Wait N milliseconds | `ms` |
| `scrollToEl` | Scroll element into view. Add `"opts": {"instant": true}` to skip the smooth-scroll animation | `sel` |
| `hl` | Pulse-highlight with a green outline (customize the color in `assets/presenter.js`) | `sel` |
| `unhl` | Remove highlight | `sel` (or omit to clear all) |
| `clickEl` | Click an element — read-only toggles only (expand/collapse, tabs) | `sel` |
| `expand` | Add `.open` class then click (accordion/collapsible pattern) | `sel` |
| `navigate` | Go to a new URL mid-beat and re-inject the presenter | `sel` (the URL or path) |

## Selector guidance

Prefer, in order:

1. `#id`
2. `[data-testid=…]` / `[data-vn=…]` (add `data-vn` hooks to the JSX if you own the code)
3. `[aria-label=…]`
4. Semantic structure: `main h2`, `table thead`, `main section:nth-of-type(2)`

Avoid generated class names (`css-1a2b3c`, hashed Tailwind). A comma-separated
selector (`"[data-vn=kpis], main table"`) acts as a fallback chain for
`scrollToEl`/`clickEl` (first match wins) — but note `hl` highlights **all**
matches of a comma selector.

Verify uniqueness on the live page before recording:
`document.querySelectorAll(sel).length === 1` — or just run the preflight:

```bash
node scripts/run.mjs --beats <file> --preflight-only
```

## Read-only posture

Never encode actions that submit forms, create records, send messages, or
delete anything. Any click beyond expand/collapse/tab needs explicit operator
approval, with the fallback of narrating over a static view instead.
