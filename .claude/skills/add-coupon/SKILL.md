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

The gift-code system lives entirely in `src/app.js`, in the `PROMO_CODES` object. There is no database — codes are hardcoded and shipped via a git push.

## Steps

1. Read `src/app.js` and find the `PROMO_CODES` object (near the top, under `PROMO CODE CONFIGURATION`).
2. Normalize the code the owner gives you to uppercase — entered codes are uppercased at redemption time (`promoInputEl.value.trim().toUpperCase()`), so the key must match exactly in uppercase.
3. Check the code doesn't already exist as a key. If it does, stop and ask before overwriting — an existing code may have partial redemption history tied to it client-side.
4. Add a new entry: `"CODE": amount` (amount is a plain number, NIS, no currency symbol), preserving the existing entries and trailing comma style.
5. Show the diff (`git diff`) and confirm with the owner before committing.
6. Commit with a message like `Add <CODE> gift code (₪<amount>)` and push to `main`, following the repo's normal commit process (see top-level CLAUDE.md / git conventions).

## Notes

- Codes can contain letters, numbers, and hyphens — whatever the owner asks for, just uppercase it.
- This app has no backend: redemption state lives in each customer's browser `localStorage`, keyed by the code string. Renaming or deleting a code after it's been given out will orphan any partial balance a customer has under the old key.
- Don't invent an amount or code — always use exactly what the owner specifies. If either is missing, ask.
