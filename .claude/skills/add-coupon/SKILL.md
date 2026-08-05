---
name: add-coupon
description: Add a new gift/promo coupon code to the Amali punch card app. Use whenever the owner asks to create, add, or generate a new coupon/gift code for amali-cards. Also available as /add-coupon <CODE> <AMOUNT>.
argument-hint: "<code> <amount-in-NIS>"
allowed-tools:
  - Read
  - Edit
  - Bash
---

# Add a coupon code to Amali punch cards

The gift-code system lives in a `PROMO_CODES` object near the top of `app.js`. There is no database — codes are hardcoded and shipped via a git push. There is no build step.

## Critical: two copies of app.js exist, only one is live

- `docs/app.js` — **this is production.** GitHub Pages serves `main` branch from `/docs` (confirmed via `gh api repos/aviadvir123/amali-cards/pages`, live at https://aviadvir123.github.io/amali-cards/). It also contains Firebase cloud-sync code that `src/` lacks.
- `src/app.js` — an older, un-deployed dev copy. It has drifted from `docs/app.js` (missing the Firebase config block, etc.). Nothing copies `src/` into `docs/`.

**Always edit `docs/app.js`.** Optionally mirror the same `PROMO_CODES` change into `src/app.js` too (cosmetic parity only — it changes nothing live), but never edit only `src/app.js` and consider the job done.

## Steps

1. Read `docs/app.js` and find the `PROMO_CODES` object (near the top, under `PROMO CODE CONFIGURATION`).
2. Normalize the code the owner gives you to uppercase — entered codes are uppercased at redemption time (`promoInputEl.value.trim().toUpperCase()`), so the key must match exactly in uppercase.
3. Check the code doesn't already exist as a key in `docs/app.js`. If it does, stop and ask before overwriting — an existing code may have partial redemption history tied to it client-side.
4. Add a new entry: `"CODE": amount` (amount is a plain number, NIS, no currency symbol), preserving the existing entries and trailing comma style, in `docs/app.js`.
5. Optionally, make the identical addition to `src/app.js`'s `PROMO_CODES` object to keep it from drifting further (skip if it already looks too diverged to bother).
6. Show the diff (`git diff`) and confirm with the owner before committing.
7. Commit with a message like `Add <CODE> gift code (₪<amount>) to production (docs/)` and push to `main`.
8. Tell the owner GitHub Pages takes about a minute to rebuild after the push, and give them the live URL to test: https://aviadvir123.github.io/amali-cards/

## Notes

- Codes can contain letters, numbers, and hyphens — whatever the owner asks for, just uppercase it.
- This app has no backend: redemption state lives in each customer's browser `localStorage`, keyed by the code string. Renaming or deleting a code after it's been given out will orphan any partial balance a customer has under the old key.
- Don't invent an amount or code — always use exactly what the owner specifies. If either is missing, ask.
