// Test double for Google Identity Services (accounts.google.com/gsi/client).
// renderButton draws a button that "signs in" as window.__mockGoogleSub.
(function () {
  function b64url(obj) {
    return btoa(unescape(encodeURIComponent(JSON.stringify(obj)))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  var cfg = null;
  window.google = { accounts: { id: {
    initialize: function (c) { cfg = c; },
    renderButton: function (el) {
      var b = document.createElement("button");
      b.id = "mock-google-btn";
      b.type = "button";
      b.textContent = "Continue with Google (mock)";
      b.onclick = function () {
        var payload = { iss: "https://accounts.google.com", aud: cfg.client_id,
          sub: window.__mockGoogleSub || "111111111111111111111",
          email: "someone@gmail.com", name: "Someone Private" };
        cfg.callback({ credential: b64url({ alg: "RS256" }) + "." + b64url(payload) + ".sig" });
      };
      el.appendChild(b);
    },
    prompt: function () {}, disableAutoSelect: function () {}
  } } };
})();
