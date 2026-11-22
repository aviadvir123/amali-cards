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
  var DASH0_ENDPOINT = ""; // e.g. "https://ingress.eu-west-1.aws.dash0.com"
  var DASH0_AUTH_TOKEN = ""; // "auth_…"
  var DASH0_DATASET = "default";
  var SDK_URL = "https://unpkg.com/@dash0/sdk-web@0.35.2/dist/dash0.iife.js";
  var SDK_INTEGRITY = "sha384-HUjlVLn4IIaXjoY2iUueLc62um1kFf3wXEbEaXS1n60cmBol1wKetFchE83QsXif";

  var enabled = !!(DASH0_ENDPOINT && DASH0_AUTH_TOKEN);
  var path = window.location.pathname;
  var isStaff = /staff\.html$/.test(path);
  var isBeta = /\/beta\//.test(path);

  // amaliReport(name, attrs) — safe to call always; a no-op while monitoring is off.
  // Only pass short, non-identifying attributes (e.g. { step: "punch-code", reason: "timeout" }).
  window.amaliReport = function (name, attrs) {
    if (!enabled || typeof window.dash0 !== "function") return;
    try {
      window.dash0("sendEvent", name, { severity: "WARN", attributes: attrs || {} });
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

  var s = document.createElement("script");
  s.src = SDK_URL;
  s.integrity = SDK_INTEGRITY;
  s.crossOrigin = "anonymous";
  s.defer = true;
  document.head.appendChild(s);
})();
