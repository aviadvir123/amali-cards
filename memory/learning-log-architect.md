# Learning Log — Architect Agent

Where we capture what works, what doesn't, and why.

---

## What Works
- 2026-02-14: Reviewing the dev plan before any code caught 5 must-fix issues and 8 should-add items. Much cheaper to fix in planning than in code.
- 2026-02-14: Being specific in reviews ("change X to Y because Z") led to clean revisions with no back-and-forth.
- 2026-02-14: Asking Dev to cross-reference acceptance criteria against the plan ensures nothing slips through.

## What Doesn't Work
- 2026-02-14: First architecture recommendation (Supabase + Next.js + Vercel) was overengineered for a client-side-only punch card. Always read the product requirements before proposing a stack.

## Patterns to Remember
- Zero cost, zero dependencies — this is the guiding constraint. Every decision filters through it.
- Single SVG container with child shapes > separate SVG elements. Better alignment, performance, coordinate control.
- `start_url: "./"` in manifest — works for both subfolder and root deployments.
- iOS Safari pitfalls to always check: `100dvh` vs `100vh`, `touch-action: manipulation`, localStorage 7-day purge risk, Apple-specific PWA meta tags.
- Accessibility basics that should always be in a plan: `role="dialog"` + `aria-modal` on overlays, `:focus-visible` on interactive elements, `aria-live` on dynamic content, `prefers-reduced-motion` media query.
- `localStorage.setItem()` must always be in try/catch — quota exceeded errors are real.
- Cross-tab sync via `storage` event is trivial (10 lines) and solves a real UX issue — always include it for localStorage-based apps.
- SVG filters for "stamped" feel: keep simple (`feGaussianBlur` + `feOffset`). Complex filters tank performance on mobile.
- Confetti: 30 elements is the sweet spot. CSS-only, `transform`+`opacity` only, `infinite` loop. More than 40 risks jank on budget phones.
- Code review checklist for this project: RTL correctness, iOS Safari compatibility, localStorage validation, accessibility attributes, animation performance.

---

*Update this file after every task. The system gets smarter over time.*
