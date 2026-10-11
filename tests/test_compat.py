"""Existing customers must keep everything.

Seeds every kind of data a phone (and the cloud backup) can hold today, opens the
app, and checks nothing was lost or changed. Also covers the staff-set punch code,
cloud merge writes and live gift balances.

Usage:  python3 tests/test_compat.py docs            # production (docs/)
        python3 tests/test_compat.py docs beta/      # beta (docs/beta/)
        python3 tests/test_compat.py docs "" --full  # production, including features shipped from beta
"""
import functools, http.server, json, os, re, socketserver, sys, threading
from playwright.sync_api import sync_playwright

ROOT = sys.argv[1]
PREFIX = sys.argv[2] if len(sys.argv) > 2 else ""
IS_BETA = PREFIX.startswith("beta") or "--full" in sys.argv
# The one-screen layout (no tabs, no first-open popup, "עוד" menu) — on beta until promoted.
def one_screen(page):
    return page.locator("#more-btn").count() > 0
MOCK = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "mock-firebase.js"), encoding="utf-8").read()
PORT = 8802
BASE = f"http://localhost:{PORT}/"

socketserver.TCPServer.allow_reuse_address = True
H = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT)
class Quiet(H.func):
    def log_message(self, *a): pass
srv = socketserver.TCPServer(("127.0.0.1", PORT), functools.partial(Quiet, directory=ROOT))
threading.Thread(target=srv.serve_forever, daemon=True).start()

results, errors = [], []
def ok(cond, name):
    results.append((bool(cond), name))
    print(("PASS " if cond else "FAIL ") + name)

SHAPES = [3, 7, 1, 12, 5, 0, 9, 14, 2, 11]
KEYS = ["amali_punch_card", "amali_card_id", "amali_used_promos", "amali_active_promo"]

def card(punches, pending=False):
    return json.dumps({"punches": punches, "celebrationPending": pending, "shapeIndices": SHAPES})

# Every state a customer's phone can be in today.
STATES = {
    "new customer (nothing stored)": {},
    "mid-card, has backup code": {"amali_punch_card": card(7), "amali_card_id": "ABC234"},
    "mid-card, never saved a backup code": {"amali_punch_card": card(4)},
    "full card waiting for free coffee": {"amali_punch_card": card(0, True), "amali_card_id": "PEND22"},
    "card + old gift-code balances": {
        "amali_punch_card": card(2), "amali_card_id": "GIFT33",
        "amali_used_promos": json.dumps({"DH180": {"remaining": 80, "history": [{"used": 100, "date": "2026-09-01"}]}}),
        "amali_active_promo": "DH180"},
    "corrupted card data": {"amali_punch_card": "{not json", "amali_card_id": "BADD44"},
}

def seed(page, store, cloud=None):
    page.evaluate("""([store, cloud]) => {
        localStorage.clear();
        for (const [k, v] of Object.entries(store)) localStorage.setItem(k, v);
        localStorage.setItem('__mockdb', JSON.stringify(cloud || {}));
    }""", [store, cloud])

def ls(page):
    return page.evaluate("() => Object.fromEntries(Object.keys(localStorage).map(k => [k, localStorage.getItem(k)]))")

def mockdb(page):
    return page.evaluate("() => JSON.parse(localStorage.getItem('__mockdb') || '{}')")

def set_mockdb(page, fn_js):
    page.evaluate("(src) => { const db = JSON.parse(localStorage.getItem('__mockdb') || '{}'); (new Function('db', src))(db); localStorage.setItem('__mockdb', JSON.stringify(db)); }", fn_js)

def open_app(page, store, cloud=None, query=""):
    page.goto(BASE + PREFIX + "index.html")
    seed(page, store, cloud)
    page.goto(BASE + PREFIX + "index.html" + query)
    page.wait_for_timeout(700)

def progress(page):
    return page.inner_text("#progress-count").strip()

def punch(page, code, qty=1):
    for _ in range(qty - 1):
        page.click("#stepper-plus")
    page.fill("#code-input", code)
    page.click("#punch-btn")
    page.wait_for_timeout(1800)

with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={"width": 390, "height": 844})
    ctx.route(re.compile(r".*gstatic\.com/firebasejs/.*"), lambda r: r.fulfill(body=MOCK, content_type="application/javascript"))
    ctx.route(re.compile(r".*fonts\.(googleapis|gstatic)\.com/.*"), lambda r: r.fulfill(body="", content_type="text/css"))
    page = ctx.new_page()
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.on("dialog", lambda d: d.accept())

    print(f"--- {'BETA' if IS_BETA else 'PRODUCTION'} ({PREFIX or '/'}) ---")

    # ---------- A. existing data survives a plain open ----------
    for name, store in STATES.items():
        open_app(page, store)
        after = ls(page)
        tag = f"[{name}]"
        for k in KEYS:
            if k in store and k != "amali_punch_card":
                ok(after.get(k) == store[k], f"{tag} {k} unchanged")
        if "amali_punch_card" in store and name != "corrupted card data":
            before, now = json.loads(store["amali_punch_card"]), json.loads(after["amali_punch_card"])
            ok(now["punches"] == before["punches"] and now["celebrationPending"] == before["celebrationPending"]
               and now["shapeIndices"] == before["shapeIndices"], f"{tag} punches, shapes and free-coffee state unchanged")
            if not before["celebrationPending"]:
                ok(progress(page) == str(before["punches"]), f"{tag} shows {before['punches']} / 10")
        if name == "full card waiting for free coffee":
            ok(page.is_visible("#celebration.visible") or "visible" in (page.get_attribute("#celebration", "class") or ""),
               f"{tag} free-coffee screen still shows")
        if name == "mid-card, never saved a backup code":
            if one_screen(page):
                page.wait_for_timeout(400)
                cid = ls(page).get("amali_card_id")
                cloud_card = (mockdb(page).get("cards") or {}).get(cid or "", {})
                ok(not page.is_visible("#card-backup-overlay") and cid and cloud_card.get("punches") == 4,
                   f"{tag} no popup; backed up automatically with their 4 punches ({cid})")
            else:
                ok(page.is_visible("#card-backup-overlay") and "4" in page.inner_text("#card-backup-new-desc"),
                   f"{tag} gets a backup code offer that mentions their 4 punches")
        if name == "new customer (nothing stored)" and one_screen(page):
            ok(not page.is_visible("#card-backup-overlay") and page.is_visible("#punch-btn"),
               f"{tag} sees the card right away, no popup")
        if name == "corrupted card data":
            ok(progress(page) == "0" and after.get("amali_card_id") == "BADD44", f"{tag} app opens, backup code kept")

    # ---------- B. restore from backup code (cloud) ----------
    cloud = {"cards": {"REST55": {"punches": 6, "celebrationPending": False, "shapeIndices": SHAPES,
                                   "promos": {"NOAM110": {"remaining": 60, "history": []}}, "activePromo": None}}}
    open_app(page, {}, cloud)
    if one_screen(page):
        page.click("#more-btn")
        page.click("#card-settings-switch-replace")
    else:
        page.click("#card-backup-choice-restore")
    page.fill("#card-backup-restore-input", "REST55")
    page.click("#card-backup-restore-btn")
    page.wait_for_timeout(800)
    ok(progress(page) == "6" and ls(page).get("amali_card_id") == "REST55", "restore by old backup code still works (6 punches back)")

    if one_screen(page):
        page.click("#more-btn")
        ok(page.inner_text("#card-settings-id-display").strip() == "REST55", "\"עוד\" menu shows the backup code REST55")
        page.click("#card-settings-close-btn")
        ok(not page.is_visible("#tab-punch") if page.locator("#tab-punch").count() else True, "no tabs")

    # ---------- C. punch code ----------
    open_app(page, {"amali_punch_card": card(1), "amali_card_id": "PUNC66"})
    punch(page, "8525")
    ok(progress(page) == "2", "current code 8525 works when staff never set a code")

    if IS_BETA:
        cloud = {"settings": {"punch": {"code": "4321", "updatedBy": "דנה"}}}
        open_app(page, {"amali_punch_card": card(1), "amali_card_id": "PUNC66"}, cloud)
        punch(page, "8525")
        ok(progress(page) == "1" and "לא נכון" in page.inner_text("#status-message"), "after staff set 4321, 8525 is rejected")
        punch(page, "4321", qty=2)
        ok(progress(page) == "3", "staff-set code 4321 gives 2 punches")
        ok(ls(page).get("amali_punch_code") == "4321", "code kept on the phone for offline use")

        page.evaluate("window.__mockOffline = true")
        punch(page, "4321")
        ok(progress(page) == "4", "offline: last known code still works")
        page.evaluate("window.__mockOffline = false")

        set_mockdb(page, "db.settings.punch.code = '9999';")
        punch(page, "9999")
        ok(progress(page) == "5", "staff changed the code a minute ago: new code works right away")
        ok(ls(page).get("amali_punch_code") == "9999", "phone picked up the new code")

        # cloud merge keeps fields written by other versions
        set_mockdb(page, "db.cards = db.cards || {}; db.cards.PUNC66 = Object.assign(db.cards.PUNC66 || {}, {futureField: 'keep-me'});")
        punch(page, "9999")
        c = mockdb(page)["cards"]["PUNC66"]
        ok(c.get("futureField") == "keep-me" and c["punches"] == 6, "cloud backup is merged, other fields kept")

        # ---------- D. live gift balance ----------
        cloud = {"giftCodes": {"LIVE-GIFT": {"amount": 200, "remaining": 200, "history": [], "active": True}}}
        open_app(page, {"amali_punch_card": card(0), "amali_card_id": "LIVE77"}, cloud, "?gift=LIVE-GIFT")
        page.wait_for_selector("#promo-result:not(.hidden)")
        ok(page.inner_text("#promo-amount").strip() == "200 ₪", "gift card opens at 200")
        set_mockdb(page, "const g = db.giftCodes['LIVE-GIFT']; g.remaining = 170; g.history.push({used: 30, at: Date.now(), by: 'דנה'});")
        page.wait_for_function("document.querySelector('#promo-amount').textContent.includes('170')", timeout=3000)
        toast = page.inner_text("#toast")
        ok("30" in toast and "170" in toast, f"balance updates by itself with a message ({toast.strip()})")

        # ---------- E. staff page sets the code ----------
        page.goto(BASE + PREFIX + "staff.html")
        set_mockdb(page, "db.settings = {punch: {code: '9999', updatedBy: 'דנה'}};")
        page.evaluate("localStorage.removeItem('__mockuser')")
        page.reload()
        page.click("#login-btn")
        page.wait_for_selector("#staff-view:not(.hidden)")
        page.wait_for_function("document.querySelector('#punch-code-value').textContent === '9999'")
        ok(True, "staff page shows current punch code 9999")
        page.fill("#punch-code-input", "2468")
        page.click("#punch-code-save")
        page.wait_for_function("document.querySelector('#punch-code-status').classList.contains('success')")
        ok(mockdb(page)["settings"]["punch"]["code"] == "2468", "staff saved new code 2468")
        page.click("#logout-btn")
        r = page.evaluate("() => firebase.firestore().collection('settings').doc('punch').set({code: '0000'}).then(() => 'allowed', e => e.code)")
        ok(r == "permission-denied", "customers cannot change the punch code")

    b.close()
srv.shutdown()

ok(not errors, "no JS errors on any page" + ("" if not errors else f" {errors[:3]}"))
failed = [n for c, n in results if not c]
print(f"\n{len(results) - len(failed)}/{len(results)} passed")
sys.exit(1 if failed else 0)
