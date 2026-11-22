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
- Staff page `docs/staff.html`: Google sign-in, create codes (random by default), redeem, list, cancel. Owners also manage the team.
- Customers only look up a code they know and see its balance; the barista redeems.
- Security is enforced by `firestore.rules` (paste into Firebase Console → Firestore → Rules). Owners = `ownerEmails()` there and `OWNER_EMAILS` in `staff.html` — keep both in sync.
- Production is `docs/` (served by GitHub Pages from `main`).

## Releasing changes safely (existing customers must never lose data)
- Build in `docs/beta/` first (live at /amali-cards/beta/, same origin as production, so it reads the real cards on each phone). Red "בטא" badge marks it. Bump the `?v=` on `app.js`/`style.css` in `docs/beta/index.html` on every beta change so phones load the new code.
- Run tests against beta and production: `python3 tests/test_compat.py docs beta/`, `python3 tests/test_compat.py docs`, `python3 tests/test_gift_staff.py docs beta/`.
- After the owner approves the beta: `python3 tools/promote_beta.py <next version>` copies it to `docs/` under new file names (`app-<v>.js`, `style-<v>.css`) so cached old pages never mix with new scripts; old files stay. Then run the tests with `python3 tests/test_compat.py docs "" --full`. Review `git diff docs/`.
- Never rename or delete the phone storage keys (`amali_punch_card`, `amali_card_id`, `amali_used_promos`, `amali_active_promo`). Cloud card docs (`cards/{id}`) are written with `merge: true`; only add fields.
- Save with Google: Google Identity Services button; the app hashes `"amali-cards:" + sub` (SHA-256) on the phone and stores only `accounts/{hash} -> {cardId}`. Never store email, name or the raw Google ID. Client ID in `GOOGLE_CLIENT_ID` (app.js); its Authorized JavaScript origin is https://aviadvir123.github.io.
- Auto-restore: on a phone with no card ID and no punches (iPhone clears site data after ~7 days without a visit; in-app browsers and the home-screen icon keep separate storage), the app shows Google's One Tap prompt (`auto_select: true`). A sign-in from the prompt (`select_by` not `btn…`) only restores an already-saved card, never links a new one or replaces a card with punches. After restoring, the add-to-home-screen hint opens. The app also calls `navigator.storage.persist()`. Where the prompt doesn't show, an empty unsaved card gets a closable banner "כבר יש לכם כרטיסייה שמורה?" with Google's button, and the restore screen ("שחזור כרטיסייה") shows Google's button on top — one tap either way.
- Punch code: set by staff on staff.html (Firestore `settings/punch`), cached on the phone (`amali_punch_code`). The app listens to `settings/punch` live while open; on a miss it asks the server (10s). Entered codes ignore spaces and Arabic/Persian digits. If the server can't be reached it says "אין חיבור כרגע" and keeps the typed code, instead of "קוד לא נכון". No punch code or gift code is ever written in the repo (it is public).

## Error monitoring (OpenTelemetry → Dash0)
- `docs/telemetry.js` (shared by beta and production, not versioned — a change there reaches production at once) loads the Dash0 Web SDK (pinned version + SRI hash) on index.html and staff.html. Beta loads it as `../telemetry.js`. Endpoint/token/dataset at the top; the token is public: ingest-only, one dataset. Tests block unpkg/dash0 so they never send real data.
- Per-phone random ID in localStorage `amali_device_id` (sent with `identify`, linked to nothing else).
- telemetry.js also reports: `resource_load_failed` (a script/stylesheet/image failed), `app_not_ready` (pages with `data-ready-check`; app.js sets `window.__amaliReady`), `rage_click` (4+ clicks on one element within ~1s; our own detector — Dash0's needs session recording; labels masked in code/balance/card-ID/Wi-Fi areas and on the whole staff page).
- app.js: `report(name, err)` for failures, `track(name, attrs, severity)` for user-facing events: `punch_ok`, `punch_wrong_code`, `punch_offline`, `punches_dropped` (punches went down without a full card or restore), `punches_recovered_from_cloud` (phone had fewer punches than its backup), `card_restored`, `card_restore_not_found`, `gift_found`, `gift_not_found`, `gift_check_offline`, `google_linked`, `google_restored`, `google_error` (with the Hebrew message shown), `storage_unavailable`, plus the `*_failed` events. Attributes hold only counts, flags, fixed messages and Firebase error codes — never codes, card IDs or Google IDs.
- Never sends: URL query/fragment (scrubbed), Firebase/Google requests (ignored), console logs, session replay.
- Footer has a short "פרטיות" note about technical error reports. No consent banner (owner's decision).

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
