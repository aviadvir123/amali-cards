---
name: add-coupon
description: Add a new gift/promo coupon code to the Amali punch card app. Use whenever the owner asks to create, add, or generate a new coupon/gift code for amali-cards. Also available as /add-coupon <CODE> <AMOUNT>.
argument-hint: "<code> <amount-in-NIS>"
allowed-tools:
  - Read
---

# Add a gift card to Amali

Gift cards are no longer in the code. Codes and balances live in Firestore
(collection `giftCodes`) and are managed from the staff page:

**https://aviadvir123.github.io/amali-cards/staff.html**

Do not add codes to `docs/app.js` — there is no `PROMO_CODES` object anymore,
and the customer app only looks codes up in Firestore.

## What to tell the owner

1. Open the staff page and sign in with Google (owners are listed in
   `firestore.rules` → `ownerEmails()`; staff are added on the page itself).
2. Under "כרטיס מתנה חדש" enter the amount (and optionally who it's for).
   Leave "קוד מותאם אישית" empty so a random, hard-to-guess code is generated.
   A custom code (e.g. the one they asked for) is possible but less secure.
3. Tap "שליחה ללקוח" to send the code + balance link on WhatsApp.

Redemption is done by staff on the same page ("מימוש כרטיס מתנה"); customers
only see their balance in the app.
