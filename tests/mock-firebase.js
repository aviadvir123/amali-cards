// Test double for the Firebase compat SDK used by docs/ (served instead of gstatic in tests).
// Minimal in-browser mock of the Firebase compat API (app/auth/firestore),
// persisted in localStorage so several pages on the same origin share data.
// Also enforces a simplified version of firestore.rules so permission paths are exercised.
(function () {
  if (window.firebase && window.firebase.__mock) return;
  var KEY = "__mockdb";
  var OWNERS = ["elisharainer@gmail.com"];
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save(d) { localStorage.setItem(KEY, JSON.stringify(d)); }
  function clone(x) { return JSON.parse(JSON.stringify(x)); }
  var SERVER_TS = { __serverTs: true };

  function currentUser() { try { return JSON.parse(localStorage.getItem("__mockuser")); } catch (e) { return null; } }
  function isOwner() { var u = currentUser(); return !!u && OWNERS.indexOf(u.email) !== -1; }
  function isStaff() {
    var u = currentUser(); if (!u) return false;
    if (isOwner()) return true;
    var d = load(); return !!(d.staff && d.staff[u.email]);
  }
  function denied() { var e = new Error("Missing or insufficient permissions."); e.code = "permission-denied"; return e; }

  function ts(ms) { return { __ts: ms }; }
  function revive(v) {
    if (v && typeof v === "object") {
      if (v.__ts !== undefined) { var ms = v.__ts; return { toMillis: function () { return ms; }, toDate: function () { return new Date(ms); } }; }
      if (Array.isArray(v)) return v.map(revive);
      var o = {}; Object.keys(v).forEach(function (k) { o[k] = revive(v[k]); }); return o;
    }
    return v;
  }
  function resolveWrites(data) {
    var o = {};
    Object.keys(data).forEach(function (k) { o[k] = data[k] && data[k].__serverTs ? ts(Date.now()) : data[k]; });
    return clone(o);
  }

  // Simplified rules check (mirrors firestore.rules intent).
  function check(op, col, id, before, after) {
    if (col === "cards") {
      if (op === "list") { if (!isStaff()) throw denied(); return; }
      if (op === "delete") throw denied();
      return;
    }
    if (col === "giftCodes") {
      if (op === "get") { if (!/^[A-Z0-9-]{4,24}$/.test(id)) throw denied(); return; }
      if (op === "list") { if (!isStaff()) throw denied(); return; }
      if (op === "delete") { if (!isOwner()) throw denied(); return; }
      if (op === "create") {
        if (!isStaff()) throw denied();
        if (!/^[A-Z0-9-]{4,24}$/.test(id)) throw denied();
        if (!Number.isInteger(after.amount) || after.amount <= 0 || after.amount > 5000) throw denied();
        if (after.remaining !== after.amount && !isOwner()) throw denied();
        if (after.history.length !== 0 && !isOwner()) throw denied();
        if (after.active !== true) throw denied();
        return;
      }
      if (op === "update") {
        var keys = Object.keys(after).filter(function (k) { return JSON.stringify(after[k]) !== JSON.stringify(before[k]); });
        var redemption = isStaff() && before.active === true &&
          keys.every(function (k) { return k === "remaining" || k === "history"; }) &&
          Number.isInteger(after.remaining) && after.remaining >= 0 && after.remaining < before.remaining &&
          after.history.length === before.history.length + 1 &&
          after.history[before.history.length].used === before.remaining - after.remaining &&
          Number.isInteger(after.history[before.history.length].at);
        var ownerEdit = isOwner() && keys.every(function (k) { return ["remaining", "note", "active", "history"].indexOf(k) !== -1; });
        if (!redemption && !ownerEdit) throw denied();
        return;
      }
    }
    if (col === "settings") {
      if (op === "get") { if (id !== "punch") throw denied(); return; }
      if (op === "list") throw denied();
      if (op === "delete") { if (!isOwner()) throw denied(); return; }
      if (!isStaff() || id !== "punch") throw denied();
      if (typeof after.code !== "string" || !after.code.length || after.code.length > 20) throw denied();
      return;
    }
    if (col === "staff") {
      if (op === "get" || op === "list") { if (!isStaff()) throw denied(); return; }
      if (!isOwner()) throw denied();
      return;
    }
    throw denied();
  }

  function DocSnap(id, data) {
    this.id = id; this.exists = data !== undefined;
    this.data = function () { return data === undefined ? undefined : revive(clone(data)); };
  }

  function DocRef(col, id) { this.col = col; this.id = id; }
  function offline() { var e = new Error("offline"); e.code = "unavailable"; return e; }
  DocRef.prototype.get = function () {
    var self = this;
    return Promise.resolve().then(function () {
      if (window.__mockOffline) throw offline();
      check("get", self.col, self.id);
      var d = load(); return new DocSnap(self.id, (d[self.col] || {})[self.id]);
    });
  };
  DocRef.prototype._write = function (data, merge) {
    var d = load(); d[this.col] = d[this.col] || {};
    var before = d[this.col][this.id];
    var after = merge ? Object.assign({}, before, resolveWrites(data)) : resolveWrites(data);
    check(before === undefined ? "create" : "update", this.col, this.id, before, after);
    d[this.col][this.id] = after; save(d);
  };
  DocRef.prototype.set = function (data, opts) { var s = this; return Promise.resolve().then(function () { if (window.__mockOffline) throw offline(); s._write(data, !!(opts && opts.merge)); }); };
  // Live listener: polls the shared store so changes made by another page show up.
  DocRef.prototype.onSnapshot = function (next, error) {
    var self = this, last;
    function tick() {
      try {
        check("get", self.col, self.id);
        var d = (load()[self.col] || {})[self.id];
        var j = JSON.stringify(d === undefined ? null : d);
        if (j !== last) { last = j; next(new DocSnap(self.id, d)); }
      } catch (e) { if (error) error(e); clearInterval(t); }
    }
    var t = setInterval(tick, 150);
    setTimeout(tick, 0);
    return function () { clearInterval(t); };
  };
  DocRef.prototype.update = function (data) {
    var s = this;
    return Promise.resolve().then(function () {
      var d = load(); if (!(d[s.col] || {})[s.id]) { var e = new Error("not found"); e.code = "not-found"; throw e; }
      s._write(data, true);
    });
  };
  DocRef.prototype.delete = function () {
    var s = this;
    return Promise.resolve().then(function () {
      check("delete", s.col, s.id);
      var d = load(); if (d[s.col]) delete d[s.col][s.id]; save(d);
    });
  };

  function ColRef(name) { this.name = name; }
  ColRef.prototype.doc = function (id) { return new DocRef(this.name, id); };
  ColRef.prototype.get = function () {
    var self = this;
    return Promise.resolve().then(function () {
      check("list", self.name);
      var d = load(); var docs = d[self.name] || {};
      var snaps = Object.keys(docs).map(function (id) { return new DocSnap(id, docs[id]); });
      return { forEach: function (fn) { snaps.forEach(fn); }, size: snaps.length, docs: snaps };
    });
  };

  var firestoreInstance = {
    collection: function (n) { return new ColRef(n); },
    runTransaction: function (fn) {
      var tx = {
        get: function (ref) { return ref.get(); },
        set: function (ref, data) { ref._write(data, false); },
        update: function (ref, data) { ref._write(data, true); }
      };
      return fn(tx);
    },
    batch: function () {
      var ops = [];
      return {
        set: function (ref, data) { ops.push(function () { ref._write(data, false); }); },
        commit: function () { return Promise.resolve().then(function () { ops.forEach(function (o) { o(); }); }); }
      };
    }
  };
  function firestore() { return firestoreInstance; }
  firestore.FieldValue = { serverTimestamp: function () { return SERVER_TS; } };

  var listeners = [];
  function notify() { var u = currentUser(); listeners.forEach(function (fn) { fn(u); }); }
  var authInstance = {
    onAuthStateChanged: function (fn) { listeners.push(fn); setTimeout(function () { fn(currentUser()); }, 0); },
    signInWithPopup: function () {
      var email = window.__mockLoginEmail || "elisharainer@gmail.com";
      var user = { email: email, displayName: window.__mockLoginName || "Elisha Reiner" };
      localStorage.setItem("__mockuser", JSON.stringify(user));
      setTimeout(notify, 0);
      return Promise.resolve({ user: user });
    },
    signOut: function () { localStorage.removeItem("__mockuser"); setTimeout(notify, 0); return Promise.resolve(); }
  };
  function auth() { return authInstance; }
  auth.GoogleAuthProvider = function () { this.setCustomParameters = function () {}; };

  window.firebase = {
    __mock: true,
    initializeApp: function () {},
    firestore: firestore,
    auth: auth
  };
})();
