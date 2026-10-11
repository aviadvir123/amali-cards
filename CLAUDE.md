# Nikuv — Digital Punch Card App for Amali (עמלי)

A customer-side-only app replacing Amali coffee shop's paper punch cards.

## How It Works
1. Customer opens the app on their phone (via QR code on countertop)
2. They see their current punch card with progress
3. When they buy coffee, the barista gives them a code verbally
4. Customer enters the code — gets a punch
5. At 10 punches — celebration animation, card resets to zero
6. No history, no accounts, no backend (MVP)

## Gift Cards (כרטיסי מתנה)
- Codes and balances live in Firestore, collection `giftCodes` (doc id = the code). Nothing is hardcoded in `app.js`.
- Staff page `docs/staff.html`: Google sign-in, create codes (random by default), redeem, list, cancel. Owners also manage the team and ran the one-time legacy import.
- Customers only look up a code they know and see its balance; the barista redeems.
- Security is enforced by `firestore.rules` (paste into Firebase Console → Firestore → Rules). Owners = `ownerEmails()` there and `OWNER_EMAILS` in `staff.html` — keep both in sync.
- Production is `docs/` (served by GitHub Pages from `main`).

## Releasing changes safely (existing customers must never lose data)
- Build in `docs/beta/` first (live at /amali-cards/beta/, same origin as production, so it reads the real cards on each phone). Red "בטא" badge marks it.
- Run tests against beta and production: `python3 tests/test_compat.py docs beta/`, `python3 tests/test_compat.py docs`, `python3 tests/test_gift_staff.py docs beta/`.
- After the owner approves the beta: `python3 tools/promote_beta.py <next version>` copies it to `docs/` under new file names (`app-<v>.js`, `style-<v>.css`) so cached old pages never mix with new scripts; old files stay. Then run the tests with `python3 tests/test_compat.py docs "" --full`. Review `git diff docs/`.
- Never rename or delete the phone storage keys (`amali_punch_card`, `amali_card_id`, `amali_used_promos`, `amali_active_promo`). Cloud card docs (`cards/{id}`) are written with `merge: true`; only add fields.
- Save with Google: Google Identity Services button; the app hashes `"amali-cards:" + sub` (SHA-256) on the phone and stores only `accounts/{hash} -> {cardId}`. Never store email, name or the raw Google ID. Client ID in `GOOGLE_CLIENT_ID` (app.js); its Authorized JavaScript origin is https://aviadvir123.github.io.
- Punch code: set by staff on staff.html (Firestore `settings/punch`), cached on the phone (`amali_punch_code`); `PUNCH_CODE` in app.js is only the fallback.

## Constraints
- Zero cost — development, hosting, production all free
- No app store — works without install

## Branding
- Colors: rgb(32, 80, 130) deep blue + white
- Hebrew only for now
- Geometric shape icons for punch slots (matching physical card) — keep the punch area's current design
- Simple, warm, local coffee shop — minimal text, no big-chain loyalty feel
- No customer phone numbers, names or emails are stored, ever

## Project Structure
- `docs/` — the live app (index.html, app-<v>.js, style-<v>.css, staff.html, qr-code.html)
- `docs/beta/` — beta for testing changes on real phones before release
- `tests/` — compatibility and end-to-end tests (Playwright + Firebase mock)
- `tools/promote_beta.py` — releases the approved beta
- `firestore.rules` — Firebase security rules (paste into the console)

## Process
1. Agree the change with the owner (Elisha) — she approves every decision
2. Build it in `docs/beta/`, run the tests, owner tests the beta
3. Owner says "מאשרת" → promote, run the tests on production, release
4. Keep this file up to date
