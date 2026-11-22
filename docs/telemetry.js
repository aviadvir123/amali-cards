// Error monitoring (OpenTelemetry via the Dash0 Web SDK).
// Loaded by index.html and staff.html before their own scripts.
//
// To turn it on: paste the Dash0 OTLP-via-HTTP endpoint and an auth token below.
// The token is public in the page, so it must be a token used only for this site,
// limited to one dataset, with "Ingesting" permission only.
// While the token is empty nothing is loaded and nothing is sent.
//
// Privacy (see CLAUDE.md): no session recording, no click tracking, no console capture,
// no identify. Query strings and #fragments are dropped from every URL (gift links carry
// the code in ?gift=). Requests to Firebase/Google are not traced (their URLs and logs can
// carry card IDs). Custom events carry only what failed, never codes, card IDs or Google IDs.
(function () {
  var DASH0_ENDPOINT = "https://ingress.europe-west4.gcp.dash0.com";
  var DASH0_AUTH_TOKEN = "auth_5GXlZ69saPgtMcQW0xncNt5MQih1Fkh9";
  var DASH0_DATASET = "default";
  var SDK_URL = "https://unpkg.com/@dash0/sdk-web@0.35.2/dist/dash0.iife.js";
  var SDK_INTEGRITY = "sha384-HUjlVLn4IIaXjoY2iUueLc62um1kFf3wXEbEaXS1n60cmBol1wKetFchE83QsXif";

  var enabled = !!(DASH0_ENDPOINT && DASH0_AUTH_TOKEN);
  var path = window.location.pathname;
  var isStaff = /staff\.html$/.test(path);
  var isBeta = /\/beta\//.test(path);
  var thisScript = document.currentScript;
  var checkReady = !!(thisScript && thisScript.hasAttribute("data-ready-check"));

  // amaliReport(name, attrs, severity) — safe to call always; a no-op while monitoring is off.
  // Only pass short, non-identifying attributes (e.g. { step: "punch-code", reason: "timeout" }).
  window.amaliReport = function (name, attrs, severity) {
    if (!enabled || typeof window.dash0 !== "function") return;
    try {
      window.dash0("sendEvent", name, { severity: severity || "WARN", attributes: attrs || {} });
    } catch (e) {}
  };

  if (!enabled) return;

  // Command queue: calls made before the SDK script arrives are replayed by it.
  (function (d, a, z, h) {
    d[a] || ((z = d[a] = function () { h.push(arguments); }), (z._t = new Date()), (z._v = 1), (h = z._q = []));
  })(window, "dash0");

  window.dash0("init", {
    serviceName: isStaff ? "amali-cards-staff" : "amali-cards",
    serviceNamespace: "amali",
    environment: isBeta ? "beta" : "production",
    endpoint: { url: DASH0_ENDPOINT, authToken: DASH0_AUTH_TOKEN, dataset: DASH0_DATASET },
    enabledInstrumentations: ["@dash0/navigation", "@dash0/web-vitals", "@dash0/error", "@dash0/fetch", "@dash0/xhr"],
    ignoreUrls: [/googleapis\.com/, /gstatic\.com/, /google\.com/, /firebase/i, /unpkg\.com/],
    urlAttributeScrubber: function (attrs) {
      var out = {};
      for (var k in attrs) if (k !== "url.query" && k !== "url.fragment") out[k] = attrs[k];
      out["url.full"] = String(attrs["url.full"] || "").split(/[?#]/)[0];
      return out;
    },
    pageViewInstrumentation: { trackVirtualPageViews: false, includeParts: [] }
  });

  // Random per-phone ID so Dash0 can tell phones apart. Lives only on the phone and is
  // sent only here; not linked to the card, Google or anything else.
  try {
    var deviceId = localStorage.getItem("amali_device_id");
    if (!deviceId) {
      deviceId = (window.crypto && crypto.randomUUID) ? crypto.randomUUID()
        : Date.now().toString(36) + Math.random().toString(36).slice(2);
      localStorage.setItem("amali_device_id", deviceId);
    }
    window.dash0("identify", deviceId);
  } catch (e) {}

  // A script, stylesheet or image of the page that failed to load (Firebase, Google, app files).
  window.addEventListener("error", function (e) {
    var el = e && e.target;
    if (!el || el === window || !el.tagName) return;
    var url = el.src || el.href;
    if (!url || /unpkg\.com|dash0\.com/.test(url)) return;
    try {
      var u = new URL(url, location.href);
      window.amaliReport("resource_load_failed", { "resource.tag": el.tagName.toLowerCase(), "resource.host": u.host, "resource.path": u.pathname, online: navigator.onLine !== false }, "ERROR");
    } catch (err) {}
  }, true);

  // Rage clicks: 4+ clicks on the same element within about a second (e.g. a button that does
  // nothing). Dash0's own detector only runs with session recording, so this is our own.
  // Sends the element's id and, outside areas that can hold codes, balances, card IDs or the
  // Wi-Fi password, its short visible label. Never the text of a field.
  var MASKED = isStaff ? "body" : "#card-id-display, #promo-history, #promo-result, #card-backup-overlay, #wifi-view";
  var rage = { el: null, count: 0, last: 0, timer: null };
  function describe(el) {
    var target = el.closest ? (el.closest("button, a, [role=button], input, label, [id]") || el) : el;
    var tag = target.tagName.toLowerCase();
    var attrs = { "element.tag": tag };
    if (target.id) attrs["element.id"] = target.id;
    var masked = false;
    try { masked = !!target.closest(MASKED); } catch (e) {}
    if (!masked && tag !== "input" && tag !== "textarea" && tag !== "select") {
      var label = target.getAttribute("aria-label") || (target.textContent || "").replace(/\s+/g, " ").trim();
      if (label && !/\d{3,}/.test(label)) attrs["element.label"] = label.slice(0, 40);
    }
    if (target.disabled) attrs["element.disabled"] = true;
    return attrs;
  }
  function flushRage() {
    if (rage.count >= 4 && rage.el) {
      var attrs = describe(rage.el);
      attrs.clicks = rage.count;
      window.amaliReport("rage_click", attrs, "WARN");
    }
    rage.el = null; rage.count = 0;
  }
  document.addEventListener("click", function (e) {
    var t = e.target;
    if (!t || !t.tagName) return;
    var now = Date.now();
    if (t === rage.el && now - rage.last < 1000) rage.count++;
    else { flushRage(); rage.el = t; rage.count = 1; }
    rage.last = now;
    clearTimeout(rage.timer);
    rage.timer = setTimeout(flushRage, 1000);
  }, true);
  // Disabled buttons get no click event; a tap on them reaches the parent, so also listen to pointerdown.
  document.addEventListener("pointerdown", function (e) {
    var t = e.target;
    if (t && t.disabled) {
      var now = Date.now();
      if (t === rage.el && now - rage.last < 1000) rage.count++;
      else { flushRage(); rage.el = t; rage.count = 1; }
      rage.last = now;
      clearTimeout(rage.timer);
      rage.timer = setTimeout(flushRage, 1000);
    }
  }, true);

  // The app didn't finish starting (pages that opt in with data-ready-check; app.js sets __amaliReady).
  if (checkReady) {
    window.addEventListener("load", function () {
      setTimeout(function () {
        if (window.__amaliReady) return;
        window.amaliReport("app_not_ready", { firebase_loaded: typeof window.firebase !== "undefined", online: navigator.onLine !== false }, "ERROR");
      }, 5000);
    });
  }

  var s = document.createElement("script");
  s.src = SDK_URL;
  s.integrity = SDK_INTEGRITY;
  s.crossOrigin = "anonymous";
  s.defer = true;
  document.head.appendChild(s);
})();
