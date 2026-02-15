# Learning Log — Dev Agent

Where we capture what works, what doesn't, and why.

---

## What Works
- 2026-02-14: Writing a full implementation plan before any code — with file structure, phases, and key decisions — got both Architect and Owner aligned before a single line was written.
- 2026-02-14: Cross-referencing every acceptance criterion against the plan ensures nothing is missed.
- 2026-02-14: Keeping all config constants (`PUNCH_CODE`, `INPUT_MODE`, `TOTAL_PUNCHES`, etc.) at the very top of app.js with clear comments makes the app easy to customize without code knowledge.

## What Doesn't Work
- 2026-02-14: First plan proposed 10 separate SVG elements for shapes. Architect corrected: use a single SVG container with child shapes — better alignment, better performance, simpler coordinate system.
- 2026-02-14: Proposed `start_url: "."` in manifest. Architect corrected to `"./"` for correct relative path resolution.
- 2026-02-14: Initially used `inputmode="numeric"` hardcoded. Architect flagged: the code can be any string, so inputmode must be configurable. Solution: `INPUT_MODE` constant next to `PUNCH_CODE`.

## Patterns to Remember
- Vanilla HTML/CSS/JS only. No frameworks, no build tools, no CDNs. Zero dependencies.
- Zero cost constraint — GitHub Pages for hosting.
- RTL document (`dir="rtl"`) but punch card grid and stepper use `dir="ltr"` for visual consistency.
- iOS quirks to handle: `100dvh` for fullscreen overlay, `touch-action: manipulation` on buttons, Apple-specific meta tags for PWA.
- localStorage: always wrap `setItem` in try/catch. Validate on every read. Handle corruption silently (reset to defaults).
- Save celebration state to localStorage BEFORE showing overlay — if browser dies mid-celebration, card is already reset.
- `storage` event listener for cross-tab sync — trivial to add, solves a real edge case.
- `displayPunches` (in-memory) vs persisted `punches` — needed during celebration animation when visual and stored state diverge.
- System font stack — no web fonts. Fast, consistent Hebrew rendering across platforms.
- 6 phases: skeleton → visuals → logic → animations → celebration → polish. Each phase testable independently.

---

*Update this file after every task. The system gets smarter over time.*
