# Learning Log — PM Agent

Where we capture what works, what doesn't, and why.

---

## What Works
- 2026-02-14: Writing a detailed spec with wireframes, all UI states, copy reference table, and acceptance criteria gives dev zero ambiguity. Worth the upfront investment.
- 2026-02-14: Including a "What is Explicitly NOT in MVP" section prevents scope creep effectively.
- 2026-02-14: The carry-over truth table (in v1) was helpful for validating logic — even though carry-over was removed in v2, the table format is good for any complex logic.

## What Doesn't Work
- 2026-02-14: First spec draft had barista-side app, phone number lookup, Supabase backend — way overengineered. Owner wanted a simple client-side punch card. Always start with the simplest possible version.
- 2026-02-14: Assumed 10th punch = 10th purchase. Owner clarified: 10th punch = free coffee (not a purchase). Always confirm the business model before speccing.
- 2026-02-14: Originally included cooldown and lockout mechanics. Owner removed them — unnecessary friction for a local coffee shop built on trust.

## Patterns to Remember
- The owner wants to approve every decision. Never assume — always present and wait.
- Keep the spec as a single living document. Version it (v1 → v2) but don't split across files.
- Hebrew-first copy, English secondary. Always provide both in the copy reference table.
- The product is "literally a paper card replacement" — use this as the litmus test for every feature decision.
- Data loss risks should be enumerated explicitly with resolutions. For a local shop, "barista helps re-punch" is an acceptable resolution.

---

*Update this file after every task. The system gets smarter over time.*
