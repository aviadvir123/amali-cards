import json, re, sys, threading, functools, http.server, socketserver, os
from playwright.sync_api import sync_playwright

"""Gift cards + staff page, end to end, against the Firebase mock.
Usage: python3 tests/test_gift_staff.py docs [beta/] [screenshots_dir]"""
ROOT = sys.argv[1]
PREFIX = sys.argv[2] if len(sys.argv) > 2 else ""
OUT = sys.argv[3] if len(sys.argv) > 3 else None
MOCK = open(os.path.join(os.path.dirname(__file__), "mock-firebase.js"), encoding="utf-8").read()
PORT = 8801
BASE = f"http://localhost:{PORT}/"

Handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT)
class Quiet(Handler.func):
    def log_message(self, *a): pass
socketserver.TCPServer.allow_reuse_address = True
httpd = socketserver.TCPServer(("127.0.0.1", PORT), functools.partial(Quiet, directory=ROOT))
threading.Thread(target=httpd.serve_forever, daemon=True).start()

results = []
def ok(cond, name):
    results.append((bool(cond), name))
    print(("PASS " if cond else "FAIL ") + name)

errors = []

with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={"width": 390, "height": 844}, locale="he-IL")
    ctx.route(re.compile(r".*gstatic\.com/firebasejs/.*"), lambda r: r.fulfill(body=MOCK, content_type="application/javascript"))
    ctx.route(re.compile(r".*fonts\.(googleapis|gstatic)\.com/.*"), lambda r: r.fulfill(body="", content_type="text/css"))
    page = ctx.new_page()
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.on("dialog", lambda d: d.accept())

    # ---- seed: legacy customer data + cloud card with legacy promo balance
    page.goto(BASE + PREFIX + "staff.html")
    page.evaluate("""() => {
      localStorage.clear();
      localStorage.setItem('__mockdb', JSON.stringify({cards: {
        ABC123: {punches: 3, promos: {DH180: {remaining: 80, history: [{used: 100, date: '2026-09-01'}]}}},
        XYZ789: {punches: 1, promos: {DH180: {remaining: 130, history: []}, NOAM110: {remaining: 60, history: []}}}
      }}));
    }""")
    page.reload()

    # ---- owner login
    page.wait_for_selector("#login-view:not(.hidden)")
    page.click("#login-btn")
    page.wait_for_selector("#staff-view:not(.hidden)")
    ok(page.is_visible("#team-card") and page.is_visible("#import-card"), "owner sees team + import")
    (OUT and page.screenshot(path=OUT + "/staff_owner_top.png", full_page=True))

    page.click("#import-btn")
    page.wait_for_function("document.querySelector('#import-status').classList.contains('success')")
    db = page.evaluate("JSON.parse(localStorage.getItem('__mockdb'))")
    gc = db["giftCodes"]
    ok(set(gc) == {"DH180", "NOAM110", "AMAL300-N", "AML100-L", "GFU200"}, "import created 5 codes")
    ok(gc["DH180"]["remaining"] == 80 and gc["NOAM110"]["remaining"] == 60 and gc["GFU200"]["remaining"] == 200, "import used lowest balances")
    ok(page.is_hidden("#import-card"), "import card hidden after import")

    # ---- create
    page.fill("#new-amount", "200")
    page.fill("#new-note", "יום הולדת לנועה")
    page.click("#create-btn")
    page.wait_for_selector("#new-code-box:not(.hidden)")
    new_code = page.inner_text("#new-code-value").strip()
    ok(re.fullmatch(r"[A-HJKMNP-Z2-9]{4}-[A-HJKMNP-Z2-9]{4}", new_code), f"random code format ({new_code})")
    (OUT and page.screenshot(path=OUT + "/staff_created.png", full_page=True))

    # duplicate custom code rejected
    page.fill("#new-amount", "50")
    page.click("#custom-code-details summary")
    page.fill("#new-custom-code", "dh180")
    page.click("#create-btn")
    page.wait_for_function("document.querySelector('#create-status').classList.contains('error')")
    ok("כבר קיים" in page.inner_text("#create-status"), "duplicate custom code rejected")
    page.fill("#new-custom-code", "")
    page.fill("#new-amount", "")

    # ---- redeem (typed without hyphen, lowercase)
    page.fill("#redeem-code", new_code.replace("-", "").lower())
    page.click("#redeem-check-btn")
    page.wait_for_selector("#redeem-details:not(.hidden)")
    ok(page.inner_text("#balance-amount").strip() == "200 ₪", "staff sees 200 balance")
    page.fill("#redeem-amount", "250")
    page.click("#redeem-btn")
    ok("גבוה מהיתרה" in page.inner_text("#redeem-status"), "over-balance blocked")
    page.fill("#redeem-amount", "50")
    page.click("#redeem-btn")
    page.wait_for_function("document.querySelector('#redeem-status').classList.contains('success')")
    ok(page.inner_text("#balance-amount").strip() == "150 ₪", "balance 150 after redeem")
    db = page.evaluate("JSON.parse(localStorage.getItem('__mockdb'))")
    h = db["giftCodes"][new_code]["history"]
    ok(len(h) == 1 and h[0]["used"] == 50 and h[0]["by"] == "Elisha", "history entry recorded")
    (OUT and page.screenshot(path=OUT + "/staff_redeemed.png", full_page=True))

    # list filter
    ok(page.locator("#codes-list .list-row").count() == 6, "list shows 6 active codes")

    # ---- owner cancels AML100-L
    page.fill("#redeem-code", "AML100-L")
    page.click("#redeem-check-btn")
    page.wait_for_selector("#owner-code-actions:not(.hidden)")
    page.click("#toggle-active-btn")
    page.wait_for_function("document.querySelector('#balance-amount').textContent.includes('בוטל')")
    ok(page.is_hidden("#redeem-form"), "cancelled code cannot be redeemed")

    # ---- add staff
    page.fill("#team-name", "דנה")
    page.fill("#team-email", "Dana.Barista@gmail.com")
    page.click("#team-add-btn")
    page.wait_for_function("document.querySelector('#team-status').classList.contains('success')")
    ok("dana.barista@gmail.com" in page.inner_text("#team-list"), "staff added (lowercased)")

    # ---- stranger denied
    page.click("#logout-btn")
    page.wait_for_selector("#login-view:not(.hidden)")
    page.evaluate("window.__mockLoginEmail='random@gmail.com'; window.__mockLoginName='Random Person'")
    page.click("#login-btn")
    page.wait_for_selector("#denied-view:not(.hidden)")
    ok(True, "stranger sees not-authorized")
    (OUT and page.screenshot(path=OUT + "/staff_denied.png"))
    page.click("#denied-logout-btn")
    page.wait_for_selector("#login-view:not(.hidden)")

    # ---- barista
    page.evaluate("window.__mockLoginEmail='dana.barista@gmail.com'; window.__mockLoginName='Dana B'")
    page.click("#login-btn")
    page.wait_for_selector("#staff-view:not(.hidden)")
    ok(page.is_hidden("#team-card") and page.is_hidden("#import-card"), "barista: no owner sections")
    ok(page.inner_text("#user-name").strip() == "דנה", "barista name from staff list")
    page.fill("#redeem-code", "DH180")
    page.click("#redeem-check-btn")
    page.wait_for_selector("#redeem-details:not(.hidden)")
    ok(page.is_hidden("#owner-code-actions"), "barista cannot cancel")
    page.fill("#redeem-amount", "30")
    page.click("#redeem-btn")
    page.wait_for_function("document.querySelector('#redeem-status').classList.contains('success')")
    ok(page.inner_text("#balance-amount").strip() == "50 ₪", "barista redeemed DH180 -> 50")
    page.fill("#new-amount", "100")
    page.click("#create-btn")
    page.wait_for_selector("#new-code-box:not(.hidden)")
    ok(True, "barista can create codes")
    page.click("#logout-btn")
    page.wait_for_selector("#login-view:not(.hidden)")
    (OUT and page.screenshot(path=OUT + "/staff_login.png"))

    # ---- customer app
    page.evaluate("""() => {
      localStorage.setItem('amali_card_id', 'ABC123');
      localStorage.setItem('amali_used_promos', JSON.stringify({DH180: {remaining: 80, history: []}}));
      localStorage.setItem('amali_active_promo', 'DH180');
    }""")
    page.goto(BASE + PREFIX + "index.html?gift=" + new_code)
    page.wait_for_selector("#promo-result:not(.hidden)")
    ok(page.inner_text("#promo-amount").strip() == "150 ₪", "customer link shows 150")
    ok("50" in page.inner_text("#promo-usage"), "customer sees usage history")
    ok("gift=" not in page.url, "gift param removed from URL")
    (OUT and page.screenshot(path=OUT + "/customer_balance.png", full_page=True))

    page.click("#promo-back-btn")
    page.wait_for_function("document.querySelectorAll('#promo-history-list .promo-card-row').length === 2 && !document.querySelector('#promo-history-list').textContent.includes('…')")
    txt = page.inner_text("#promo-history-list")
    ok("DH180" in txt and "50 ₪" in txt and new_code in txt, "saved list: migrated DH180 (50) + new code")
    (OUT and page.screenshot(path=OUT + "/customer_list.png", full_page=True))

    if page.is_visible("#promo-add-btn"): page.click("#promo-add-btn")
    page.fill("#promo-input", "NOPE99")
    page.click("#promo-check-btn")
    page.wait_for_function("document.querySelector('#promo-status').textContent.includes('לא תקף')")
    ok(True, "unknown code rejected")

    if page.is_visible("#promo-add-btn"): page.click("#promo-add-btn")
    page.fill("#promo-input", "aml100-l")
    page.click("#promo-check-btn")
    page.wait_for_selector("#promo-result:not(.hidden)")
    ok(page.inner_text("#promo-amount").strip() == "בוטל", "cancelled code shows as cancelled")
    page.click("#promo-remove-btn"); page.click("#promo-remove-confirm-yes")
    saved = page.evaluate("JSON.parse(localStorage.getItem('amali_gift_codes'))")
    ok("AML100-L" not in saved, "remove from my list")

    # customer (signed out) cannot list codes or redeem
    r = page.evaluate("""() => firebase.firestore().collection('giftCodes').get().then(()=> 'allowed', e => e.code)""")
    ok(r == "permission-denied", "customer cannot list codes")
    r = page.evaluate("""() => firebase.firestore().collection('giftCodes').doc('DH180').update({remaining: 0}).then(()=> 'allowed', e => e.code)""")
    ok(r == "permission-denied", "customer cannot change balance")

    # cloud backup holds saved codes
    db = page.evaluate("JSON.parse(localStorage.getItem('__mockdb'))")
    ok(new_code in (db["cards"]["ABC123"].get("giftCodes") or []), "saved codes backed up to card")
    ok("DH180" in db["cards"]["ABC123"].get("promos", {}), "legacy promos preserved in card")

    # punch tab still works visually
    if page.locator("#tab-punch").count(): page.click("#tab-punch")
    (OUT and page.screenshot(path=OUT + "/customer_punch.png"))

    # old admin page renders
    page.goto(BASE + "admin.html")
    ok(page.is_visible("a[href='staff.html']"), "admin links to staff page")

    b.close()

httpd.shutdown()
ok(not errors, "no page JS errors " + ("" if not errors else str(errors[:3])))
failed = [n for c, n in results if not c]
print(f"\n{len(results)-len(failed)}/{len(results)} passed")
sys.exit(1 if failed else 0)
