# Nikuv — Digital Punch Card App for Amali (עמלי)

A customer-side-only app replacing Amali coffee shop's paper punch cards.

## How It Works
1. Customer opens the app on their phone (via QR code on countertop)
2. They see their current punch card with progress
3. When they buy coffee, the barista gives them a code verbally
4. Customer enters the code — gets a punch
5. At 10 punches — celebration animation, card resets to zero
6. No history, no accounts, no backend (MVP)

## Constraints
- Zero cost — development, hosting, production all free
- No app store — works without install

## Branding
- Colors: rgb(32, 80, 130) deep blue + white
- Multilingual: Hebrew, Arabic, English
- Geometric shape icons for punch slots (matching physical card)

## Project Structure
- `agents/` — AI agent definitions (one file per agent)
- `brain/` — Knowledge & references
- `core/` — Project identity and voice
- `tools/` — Skills & workflows
- `output/` — Agent-generated work
- `memory/` — Lessons learned across sessions

## Agents
- **PM** (`agents/pm.md`) — specs, wireframes, UI/UX, product review
- **Dev** (`agents/dev.md`) — implementation plans, code
- **Architect** (`agents/architect.md`) — plan review, code review, tech decisions

## Agent Rules
- Every agent must read `core/core-identity.md` before starting any task
- Every agent has its own learning log at `memory/learning-log-[agent-name].md`
- Every agent updates their learning log after each task
- All agent output goes to `output/`

## Process
1. PM writes detailed spec (wireframes, UI/UX, acceptance criteria) → **owner approves**
2. Dev writes implementation plan → Architect reviews → iterate → **owner approves**
3. Dev builds → Architect reviews code
4. PM + owner review user-facing output
5. Changes needed? → back to Dev with clear requirements
6. Owner signs off → next feature

## Living Documents
- **This file (`CLAUDE.md`)** — update as project evolves, decisions are made, or process changes
- **`core/core-identity.md`** — update based on owner feedback and project learnings
- **`memory/learning-log-*.md`** — each agent updates after every task
