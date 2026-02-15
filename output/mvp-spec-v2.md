# Nikuv MVP Spec -- Digital Punch Card for Amali

**Version:** 1.0
**Date:** 2026-02-14
**Status:** Draft, pending owner approval

---

## 1. Product Overview

Nikuv is a web-based digital punch card that replaces the paper punch cards at Amali coffee shop. A customer scans a QR code on the countertop to open the app in their phone's browser for the first time. After that, they return via bookmark, home screen shortcut, browser history, or by scanning the QR code again. They see a punch card. Each time they buy a coffee, the barista tells them a secret code verbally. The customer selects how many punches they are earning (defaulting to 1), types in the code, and earns their punches. After 9 purchases, the 10th coffee is free — the customer shows the completed card to the barista, the card resets, and they start over. There are no accounts, no logins, no backend, no app install. It is a static web app that stores everything in the browser's localStorage. It costs nothing to build or host.

**Important:** The 10th punch is not a purchase. It represents the free coffee. When a customer reaches 10 punches, the celebration tells them their coffee is on the house. The barista sees the celebration screen, gives the free coffee, the customer dismisses it, and the card resets to 0.

---

## 2. User Flow

### First-Time Customer

1. Customer sees a small sign/sticker on Amali's countertop with a QR code and the text: "סרקו לכרטיס ניקוב דיגיטלי" (Scan for a digital punch card).
2. Customer scans the QR code with their phone camera.
3. Phone opens the browser to the app URL (e.g., `amali.github.io/nikuv`).
4. The app detects no existing data in localStorage.
5. Customer sees the **Main Screen**: a punch card with 0 out of 10 punches filled, the Amali branding, a punch quantity selector defaulted to 1, and a code input field.
6. There is NO onboarding wizard, no splash screen, no tutorial. The card itself is self-explanatory.
7. If the customer chooses to add the app to their home screen (via the browser's native share/menu), the `manifest.json` ensures it appears with the name "עמלי" and the Amali icon, and opens in standalone mode.

### Returning Customer

8. Customer opens the app via any of these methods — all behave identically, loading their current card from localStorage:
   - Home screen icon (if added)
   - Browser bookmark
   - Browser history
   - Scanning the QR code again
9. App reads localStorage, shows their punch card with existing progress.

### Earning Punches

10. Customer buys coffee(s). Barista verbally says the code (e.g., "2552").
11. If the customer bought more than one coffee, they use the **quantity selector** to set how many punches they are earning (1 to remaining slots). Default is 1.
12. Customer taps the code input field. Numeric keyboard opens.
13. Customer types the code and taps "!ניקוב" (Punch!).
14. **If correct:** The appropriate number of empty slots fill with punch animations, one after another in quick sequence. A brief success toast appears. The input clears. The quantity selector resets to 1.
15. **If wrong:** The input field shakes. An error message appears. The input clears. The customer can try again immediately with no limit on attempts.

### 10th Punch -- Free Coffee Celebration

16. When the customer's punches reach exactly 10, a **full-screen celebration overlay** appears with confetti animation (see Section 5).
17. The customer shows the celebration screen to the barista to claim their free coffee.
18. After the customer dismisses the celebration, the card resets to 0. Fresh start.

---

## 3. Screens

### 3.1 Main Screen (Punch Card)

This is the only screen of the app. It handles all states.

```
┌─────────────────────────────────┐
│                                 │
│        [ Amali Logo ]           │
│                                 │
│  ┌─────────────────────────────┐│
│  │                             ││
│  │   ◆  ◆  ◆  ◆  ◆           ││
│  │                             ││
│  │   ◇  ◇  ◇  ◇  ◇           ││
│  │                             ││
│  │         5 / 10              ││
│  └─────────────────────────────┘│
│                                 │
│        כמה ניקובים?             │
│    ┌──┐                         │
│    │-│  1  │+│                  │
│    └──┘                         │
│                                 │
│  ┌───────────────────────────┐  │
│  │        code input         │  │
│  └───────────────────────────┘  │
│  ┌───────────────────────────┐  │
│  │          קדימה            │  │
│  └───────────────────────────┘  │
│                                 │
│    קוד לא נכון, נסו שוב        │
│    (error state only)           │
│                                 │
└─────────────────────────────────┘
```

#### Layout (top to bottom):

**Header area (top ~12% of viewport)**
- Amali logo image centered on a brand blue `rgb(32, 80, 130)` background bar.
- No navigation, no hamburger menu, no settings icon. Nothing.

**Punch card area (middle ~40% of viewport)**
- A rounded-rectangle card shape with a subtle shadow, white background, slight border in brand blue.
- Inside the card: 10 punch slots arranged in 2 rows of 5.
- Each slot is a geometric shape outline. The shapes cycle through: diamond, circle, hexagon, triangle, square -- one of each per row, repeating for row 2. This creates the "various geometric shapes" feel from the brand identity.
- **Empty slot:** Shape outline only, in a light gray (`#D0D0D0`).
- **Filled slot:** Shape filled with brand blue `rgb(32, 80, 130)`, with a subtle inner shadow to feel stamped.
- Below the shapes, centered: progress text showing "X / 10" in brand blue.

**Quantity selector area (~15% of viewport)**
- Label above: "?כמה ניקובים" (How many punches?) in brand blue, centered.
- A compact stepper control, centered: a minus button (-), a number display in the middle, and a plus button (+).
- The number displays the current quantity (default: 1).
- Minus button decreases by 1, plus button increases by 1.
- **Minimum: 1. Maximum: 10 - current punches.** If the customer has 8 punches, the max is 2. If they have 0, the max is 10. At minimum the minus button is visually disabled (grayed out). At maximum the plus button is visually disabled.
- The stepper has brand-blue borders and text. Buttons are tappable areas of at least 44x44px for easy mobile use.

**Code entry area (~18% of viewport)**
- An input field, full width, centered text. Placeholder text: "הזינו קוד" (Enter code). `inputmode="numeric"` to open the numeric keyboard on mobile.
- A button below the input, full width. Text: "קדימה" (Let's go). Background: brand blue. Text: white. Rounded corners.
- The button is visually enabled (full blue) only when the input is non-empty (at least 1 character). Otherwise it appears muted (`opacity: 0.5`) and is not clickable.
- Below the input: a status message area. Empty by default. Shows error messages in red (`#C0392B`) or success messages in green (`#27AE60`).

**Footer area**
- Empty spacer to push content up. No text.

#### States:

**State: Empty Card (0 punches)**
- All 10 shapes are outlines only (gray).
- Progress text: "0 / 10".
- Quantity selector shows 1, max is 10. Code entry area is active and ready.

**State: Partial Progress (1-9 punches)**
- Filled shapes from top-left, left to right, top row then bottom row. E.g., 3 punches = first 3 shapes in row 1 filled.
- Progress text: "X / 10".
- Quantity selector max adjusts to `10 - current punches`.

**State: Code Entry Active**
- When user taps the input field, the numeric keyboard opens.
- The button is enabled when the input is non-empty.

**State: Success (correct code entered)**
- Newly punched slots animate: shape scales from 0 to full size with a slight bounce (CSS animation, ~400ms). For multiple punches, slots fill in sequence with a staggered animation (200ms apart).
- A toast appears at the top: "ניקוב נוסף בהצלחה" in white text on a green background, fades out after 1.5 seconds.
- Progress text updates.
- If the punches reach 10, the celebration triggers after the last filling animation completes.
- Input field clears. Quantity selector resets to 1.

**State: Error (wrong code)**
- The input field does a horizontal shake animation (~300ms).
- Below the input, red text appears: "קוד לא נכון, נסו שוב" (Wrong code, try again).
- The error message disappears after 3 seconds or when the user starts typing again.
- Input field clears.
- Quantity selector is NOT reset on error (keeps current selection so they can retry without re-selecting).

**State: 10th Punch Celebration**
- See Section 5.

### 3.2 Celebration Overlay

```
┌─────────────────────────────────┐
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░  ◆ ○ △ ◇ □  ◆ ○ △ ◇ □     ░ │
│ ░    ◇  △   ○    □  ◆        ░ │
│ ░       (confetti falling)    ░ │
│ ░                             ░ │
│ ░    הקפה הזה על חשבוננו       ░ │
│ ░                             ░ │
│ ░    This coffee is on us      ░ │
│ ░                             ░ │
│ ░  ┌─────────────────────────┐ ░│
│ ░  │         סגור            │ ░│
│ ░  │         CLOSE           │ ░│
│ ░  └─────────────────────────┘ ░│
│ ░                             ░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
└─────────────────────────────────┘
```

See Section 5 for full detail.

---

## 4. The Punch Code Mechanism

### The Code

- For MVP, the code is defined as a constant in the app source: `const PUNCH_CODE = "2552";`
- The code can be **any reasonable string** -- not limited to 4 digits. The comparison logic and UI make no assumptions about length or character set. The code `2552` is the default, but changing the constant to `"caffe"`, `"Amali2026"`, or `"7"` should work with zero other code changes.
- The comparison is **case-insensitive**. If the code is `"Amali"`, entering `"amali"` or `"AMALI"` is accepted.
- The code is the same for all customers, all the time.
- The barista memorizes this code and tells it to the customer verbally after each purchase.

### Input Behavior

- The input field uses `inputmode="numeric"` to open the numeric keyboard on mobile (optimized for the default code `2552`).
- No maximum length enforced on the input field itself.
- The "!ניקוב" button is enabled when the input has at least 1 character.
- Tapping "!ניקוב" or pressing Enter/Return submits the code.

### Validation

- The app compares the entered value (trimmed of leading/trailing whitespace, lowercased) to the stored code (also lowercased).
- **Correct code:** Punches are awarded based on the quantity selector value. See success states.
- **Wrong code:** Error state. The customer can try again immediately. No attempt counting, no lockout.

### Quantity Selector

- Located between the punch card and the code input.
- A stepper with minus (-) and plus (+) buttons and a number in the middle.
- **Range: 1 to (10 - current punches).** Default: 1.
- The maximum updates dynamically. If the customer has 7 punches, max is 3. If they have 0, max is 10.
- The quantity determines how many punches are awarded on a successful code entry.
- On successful code entry, the selector resets to 1.
- On failed code entry, the selector keeps its current value.
- There is no carry-over. The customer can never select more punches than remaining slots.

### Where the Code Lives in Source

- `const PUNCH_CODE = "2552";`
- It should be at the very top of the JavaScript file, clearly labeled with a comment: `// Change this value to update the punch code for all customers`.
- It is a single string constant. The rest of the code treats it opaquely.

---

## 5. The Celebration

### Trigger

- When the punch count reaches exactly 10 (after awarding punches from a successful code entry).
- The 10th punch is NOT a purchase — it represents the free coffee being claimed.

### Sequence

1. The final slots fill with their staggered animation.
2. After the last slot's animation completes, a 500ms pause.
3. A full-screen overlay fades in (300ms fade) over the punch card.
4. The overlay background is brand blue `rgb(32, 80, 130)` at 95% opacity.
5. **Confetti overlay animation** plays: small geometric shapes (matching the punch slot shapes -- diamonds, circles, hexagons, triangles, squares) in white and light-blue rain down continuously from the top of the screen. CSS-only animation, no external libraries. The confetti loops for as long as the overlay is visible.
6. Center of overlay, large white text:
   - Line 1 (large, bold): "הקפה הזה על חשבוננו" (This coffee is on us)
   - Line 2 (smaller): "This coffee is on us"
7. Below the text: a white-outlined button with "סגור" (Hebrew) and "CLOSE" (English) stacked.

### Dismissal and Reset

9. Customer taps "סגור / CLOSE".
10. Overlay fades out (300ms).
11. The punch card resets to 0. Fresh card, no carry-over.
12. A brief toast "!כרטיס חדש" (New card!) appears for 1.5 seconds.

### What If They Don't Dismiss?

- The overlay stays indefinitely until the customer taps close. No auto-dismiss timer. The customer needs this screen visible to show the barista as proof for the free coffee.
- The reset is written to localStorage **at the moment the 10th punch is awarded**, before the overlay appears. If the customer closes the browser mid-celebration, the next time they open the app they see a fresh card at 0. The free coffee was already claimed (the barista saw the screen).

---

## 6. Data Storage

### Technology

- `localStorage` in the browser. No cookies, no IndexedDB, no server.

### Schema

A single localStorage key: `amali_punch_card`

Value is a JSON string with this structure:

```json
{
  "punches": 7,
  "celebrationPending": false
}
```

**Fields:**

| Field | Type | Description |
|---|---|---|
| `punches` | integer (0-10) | Current number of punches on the card. |
| `celebrationPending` | boolean | True if the card hit 10 and the celebration overlay has not yet been dismissed. Used to restore celebration state if the browser is closed mid-celebration. |

### Initialization

When no `amali_punch_card` key exists in localStorage, the app initializes with:

```json
{
  "punches": 0,
  "celebrationPending": false
}
```

### On 10th Punch (Before Celebration Overlay)

```json
{
  "punches": 0,
  "celebrationPending": true
}
```

The card is reset to 0 immediately. `celebrationPending: true` tells the app to show the celebration overlay on load if the user closed the browser before dismissing.

### On Celebration Dismissed

```json
{
  "punches": 0,
  "celebrationPending": false
}
```

### App Load Logic

1. Read `amali_punch_card` from localStorage.
2. If missing or unparseable: initialize to defaults (0 punches).
3. If `celebrationPending` is true: show the celebration overlay immediately. When dismissed, set `celebrationPending` to false.
4. If `punches` is not a valid integer 0-10, or any field is invalid: reset to defaults.
5. Otherwise: render the punch card with the stored punch count.

---

## 7. QR Code Onboarding

### What the QR Code Points To

- The app's URL: e.g., `https://amali.github.io/nikuv`.
- Plain URL. No special parameters, no tracking codes.

### How Customers Access the App

- **First time:** Scan the QR code on the countertop. This gets the URL onto their phone.
- **Every time after:** Bookmark, home screen icon, browser history, or scanning the QR code again. All methods behave identically — they load the app, which reads localStorage and shows the customer's current card.

### Physical Placement

- A small laminated card or sticker on the counter near the register.
- Design: White background, QR code in center, text above: "עמלי -- כרטיס ניקוב דיגיטלי" (Amali -- Digital Punch Card), text below: "סרקו כדי להתחיל" (Scan to start). The Amali logo/name at the top. Brand blue accents.
- This is a physical artifact the owner prints. The dev delivers a printable image or page.

### First-Time Experience

- There is NO splash screen, NO onboarding flow, NO "welcome" modal, NO "add to home screen" prompt.
- The customer scans the QR code, the browser opens, and they immediately see their empty punch card.
- The card itself is the onboarding. It is visually obvious: empty slots, a quantity selector, an input field, a "Punch!" button.

### Add to Home Screen

- The app includes a `manifest.json` so that if a customer independently chooses "Add to Home Screen" via the browser's native sharing/menu, it works well.
- The app does NOT prompt or nudge the user to add to home screen. No install banners, no pop-ups, no toasts suggesting it.
- Manifest details:
  - `name`: "עמלי - כרטיס ניקוב"
  - `short_name`: "עמלי"
  - `start_url`: "/"
  - `display`: "standalone"
  - `background_color`: "#FFFFFF"
  - `theme_color`: "#205082"
  - `dir`: "rtl"
  - `lang`: "he"
  - Icons: The Amali logo on white background, 192x192 and 512x512 PNG.

---

## 8. Data Loss Risks

Since all data lives in the browser's localStorage, punch progress can be lost. This section enumerates every known scenario and the expected resolution.

### Scenarios Where Punches Are Lost

| Scenario | What Happens | Resolution |
|---|---|---|
| **Customer clears browser data** | All punches gone. Fresh card at 0. | Customer tells the barista. Barista gives them the code to re-enter their approximate count. This is a local coffee shop — trust exists. |
| **Customer uses incognito/private mode** | Punches are never saved. Card resets every time they close the browser. | Customer should use regular browsing mode. Nothing the app can do. |
| **Customer switches phones** | New phone has no localStorage data. Fresh card at 0. | Customer tells the barista "I switched phones." Barista helps them re-punch. |
| **Customer switches browsers** | Different browser = different localStorage. Fresh card at 0. | Same as switching phones. Barista helps. |
| **iOS Safari auto-purges localStorage** | Safari may purge localStorage for sites not visited in 7+ days. Fresh card at 0. | Customer comes back, card is empty, tells barista. Barista helps. Frequent customers (the target audience) are unlikely to hit the 7-day gap. |
| **Customer uninstalls browser / resets phone** | All browser data gone. Fresh card at 0. | Barista helps re-punch. |
| **Browser bug / OS update wipes data** | Extremely rare but possible. | Barista helps. |
| **Corrupted localStorage** | App silently resets to 0. | Barista helps. |

### Why This Is Acceptable

- The paper punch card had the same risks (lost card, washed in laundry, left at home). Digital is strictly better.
- Amali is a local coffee shop. The barista knows the regulars. If someone says "I had 7 punches and my phone broke," the barista can tell them to punch 7 times. The code is shared verbally anyway.
- The worst case is a customer gets a free coffee slightly early or slightly late. The cost of that is one coffee. The trust model matches the business.

### Developer Considerations

- Use `localStorage` — it persists across sessions and is the most reliable client-side storage.
- Do NOT use `sessionStorage` (dies when tab closes).
- Do NOT rely on cookies (can be blocked, have size limits).
- Be aware that iOS Safari may purge localStorage for sites not visited in 7 days. This is a known platform limitation. For MVP, accept this risk. For a future version, a service worker with Cache API could help with persistence.

---

## 9. Edge Cases

### Customer opens on desktop

- The app renders and functions on desktop browsers.
- The card is centered on screen with a max-width of 480px, looking like a phone-screen-sized card in the center of the page. White page background. Same layout, same functionality.

### Customer enters the code multiple times in a row

- Each successful entry awards the selected number of punches. There is no cooldown. If a customer buys 3 coffees, they can punch 3 times (with quantity 1 each time) or once with quantity 3.

### Quantity selector when close to 10

- The max adjusts dynamically. At 9/10, selector max is 1. At 7/10, max is 3. The customer can never overshoot 10.

### Customer's phone has localStorage disabled

- The app detects this on load (try writing and reading a test value).
- If localStorage is unavailable, show a centered message:
  - "הדפדפן לא תומך בשמירת נתונים. נסו לפתוח בדפדפן רגיל." (Your browser doesn't support data storage. Try opening in a regular browser.)
  - "Your browser doesn't support data storage. Please use a regular browser."
- The punch card is not shown.

### Browser "back" button or navigation

- This is a single-page app with one screen. There is no navigation. Back button goes to whatever was before (probably the camera app from QR scan). This is fine.

### Multiple tabs open

- If the customer opens the app in two tabs, each tab reads localStorage on load and writes on punch. Last write wins. This could cause a missed punch in an extremely unlikely scenario. Acceptable for MVP.

### App loaded offline

- For MVP, no service worker or offline support. If the customer is offline, the page simply won't load. Coffee shops have WiFi.

### Corrupted localStorage data

- On load, if the JSON is unparseable, or `punches` is not an integer between 0 and 10, or any field is of the wrong type, the app resets to the initial state (0 punches, no celebration pending). Silent reset, no error shown.

### Celebration overlay is showing and customer interacts with the page behind it

- The overlay covers the full viewport and intercepts all clicks/taps. The punch card behind it is not interactive until the overlay is dismissed.

---

## 10. Acceptance Criteria

MVP is "done" when all of the following are true:

**Functional:**
- [ ] Opening the URL shows the punch card immediately with no loading screen, splash, or onboarding flow.
- [ ] The punch card displays 10 geometric-shape slots in 2 rows of 5, using varied shapes (diamond, circle, hexagon, triangle, square).
- [ ] Filled and empty slots are visually distinct (brand blue fill vs. gray outline).
- [ ] A quantity selector (stepper: minus, number, plus) is visible between the card and the code input.
- [ ] Quantity selector defaults to 1. Max is `10 - current punches`. Buttons disable at min/max.
- [ ] A code input field and "קדימה" button are visible below the quantity selector.
- [ ] Tapping the input field opens a numeric keyboard on mobile.
- [ ] The "קדימה" button is disabled when the input is empty and enabled when it has at least 1 character.
- [ ] Entering the correct code awards punches equal to the selected quantity.
- [ ] Code comparison is case-insensitive.
- [ ] Each awarded punch fills the next empty slot with a bounce animation, staggered 200ms apart for multiple punches.
- [ ] A success toast appears briefly after a successful punch.
- [ ] After a successful punch, the input clears and the quantity selector resets to 1.
- [ ] Entering a wrong code shows a shake animation and error message. No lockout, no attempt limit. Quantity selector is preserved.
- [ ] Progress is saved in localStorage and persists across browser sessions.
- [ ] At 10 punches, a full-screen celebration overlay appears with confetti animation (CSS-only, geometric shapes) and congratulations text in Hebrew and English.
- [ ] Confetti loops continuously while the celebration overlay is visible.
- [ ] Tapping "סגור / CLOSE" dismisses the celebration and resets the card to 0.
- [ ] The card resets in localStorage at the moment of the 10th punch (before the overlay), so closing the browser mid-celebration results in a fresh card.
- [ ] If the browser is closed mid-celebration, reopening the app shows the celebration overlay (via `celebrationPending` flag).
- [ ] If localStorage is unavailable, a helpful error message is shown (Hebrew + English).
- [ ] If localStorage data is corrupted, the app silently resets to 0 punches.

**Visual / Branding:**
- [ ] Brand colors are correct: `rgb(32, 80, 130)` deep blue and white.
- [ ] Amali logo is displayed prominently in the header.
- [ ] The design feels warm, local, and simple -- not corporate.
- [ ] Hebrew text is right-to-left and renders correctly.
- [ ] The layout works on mobile screens 320px wide and up.
- [ ] On desktop, the card is centered with a max-width of 480px.
- [ ] Geometric shapes are used for punch slots (not generic circles or checkmarks).

**Technical:**
- [ ] The app is a single set of static files (HTML + CSS + JS). No build step required.
- [ ] No server-side code. No API calls. No database.
- [ ] Hosted for free (GitHub Pages or equivalent).
- [ ] A `manifest.json` is included with correct name ("עמלי"), icons, `display: standalone`, RTL direction, and Hebrew language tag.
- [ ] "Add to Home Screen" works correctly on iOS and Android without any prompting.
- [ ] The punch code is stored as a single constant at the top of the JS file with a descriptive comment.
- [ ] The code constant accepts any string value -- changing it requires zero other code changes.
- [ ] No JavaScript dependencies or libraries. Vanilla HTML/CSS/JS only. Google Fonts (Alef) is the only external resource.
- [ ] Page loads in under 1 second on a normal connection.

**Deliverables:**
- [ ] Working deployed app at a public URL.
- [ ] A printable QR code image for the countertop (pointing to the app URL).

---

## 11. What is Explicitly NOT in MVP

The following are out of scope. The developer should not build, plan for, or architect around these:

- **No backend / server.** No API, no database, no server-side anything.
- **No user accounts.** No login, no signup, no email, no phone number.
- **No barista-side app.** The barista does not interact with any software.
- **No remote code changing.** The punch code is hardcoded. Remote config comes later.
- **No push notifications.** No reminders, no "come back for coffee" messages.
- **No analytics or tracking.** No Google Analytics, no Mixpanel, no event tracking.
- **No history of past cards.** When a card is completed, it is gone forever.
- **No carry-over.** Punches cannot exceed 10. No overflow logic.
- **No multi-language toggle.** The app shows Hebrew as primary with small English translations below key text. There is no language picker. Arabic is deferred to a future version.
- **No offline support / service worker.** The app requires an internet connection to load.
- **No install prompts.** The app never asks, suggests, or nudges the user to add to home screen.
- **No A/B testing or feature flags.**
- **No accessibility audit.** Basic semantic HTML is expected, but a full WCAG audit is post-MVP.
- **No dark mode.**
- **No sound effects.** The celebration is visual only.
- **No "About" page or links to the coffee shop's social media.**
- **No terms of service or privacy policy page.** (There is no data collection.)
- **No animation libraries.** All animations are CSS-only.
- **No cooldown between punches.** Customers can punch multiple times consecutively.
- **No attempt limit or lockout on wrong codes.** Wrong code just shows an error.
- **No build tools, bundlers, or transpilers.** Vanilla files served directly.

---

## Appendix A: Copy Reference

All user-facing text in one place for the developer:

| Context | Hebrew | English (secondary) |
|---|---|---|
| Header | Amali logo image | -- |
| Progress | X / 10 | -- |
| Quantity label | ?כמה ניקובים | -- |
| Input placeholder | הזינו קוד | -- |
| Punch button | קדימה | -- |
| Success toast | ניקוב נוסף בהצלחה | -- |
| Error: wrong code | קוד לא נכון, נסו שוב | -- |
| Celebration line 1 | הקפה הזה על חשבוננו | -- |
| Celebration line 2 | -- | This coffee is on us |
| Celebration close button | סגור | CLOSE |
| New card toast | !כרטיס חדש | -- |
| localStorage error | הדפדפן לא תומך בשמירת נתונים. נסו לפתוח בדפדפן רגיל. | Your browser doesn't support data storage. Please use a regular browser. |

---

## Appendix B: Technical Constants

| Constant | Value | Notes |
|---|---|---|
| `PUNCH_CODE` | `"2552"` | The code baristas tell customers. Can be changed to any string. |
| `TOTAL_PUNCHES` | `10` | Punches per card. |
| `MIN_QUANTITY` | `1` | Minimum selectable punch quantity. |
| `LOCALSTORAGE_KEY` | `"amali_punch_card"` | The localStorage key. |

Note: There is no fixed `MAX_QUANTITY` constant. The max is always calculated as `TOTAL_PUNCHES - currentPunches`.
