// ============================================================
// CONFIGURATION — Change these values to customize the app
// ============================================================

// ============================================================
// FIREBASE CONFIG — fill in from your Firebase project console
// (firebase.google.com → Project settings → Your apps → Web app)
// Leave apiKey as "" to run without cloud backup.
// ============================================================

var FIREBASE_CONFIG = {
  apiKey: "AIzaSyAWxrXv1t2Ut5onoPuOlw6hFK0xfxNGGhk",
  authDomain: "amali-cards.firebaseapp.com",
  projectId: "amali-cards"
};

// The localStorage key that stores this device's card ID
var CARD_ID_KEY = "amali_card_id";


// Change this value to update the punch code for all customers.
// Can be any string: "2552", "caffe", "Amali2026", "7", etc.
var PUNCH_CODE = "8525";

// Change to "text" if PUNCH_CODE contains letters. "numeric" opens the number pad on mobile.
var INPUT_MODE = "numeric";

// Total punches needed for a free coffee.
var TOTAL_PUNCHES = 10;

// Minimum selectable punch quantity.
var MIN_QUANTITY = 1;

// The localStorage key used to persist the punch card.
var LOCALSTORAGE_KEY = "amali_punch_card";


// ============================================================
// PROMO CODE CONFIGURATION — Add gift codes here
// Format: "CODE": amount_in_NIS
// Example: "GIFT150": 150
// ============================================================

var PROMO_CODES = {
  "DH180": 180
};

// The localStorage key used to track redeemed promo codes.
var PROMO_LOCALSTORAGE_KEY = "amali_used_promos";

// The localStorage key used to track the currently active promo code.
var ACTIVE_PROMO_KEY = "amali_active_promo";


// ============================================================
// SHAPE DEFINITIONS — 16 geometric shapes inspired by the brand
// Each shape is defined relative to center (0,0) within ~34x34 box.
// Parts can be 'circle' or 'path' SVG elements.
// ============================================================

var SHAPE_DEFS = [
  // 0: Full Circle
  { parts: [{ elem: "circle", r: 17 }] },

  // 1: Quarter Circle (center at bottom-left, fills upper-right)
  { parts: [{ elem: "path", d: "M-17,17 L-17,-17 A34,34,0,0,1,17,17 Z" }] },

  // 2: Shield (flat top, rounded bottom)
  { parts: [{ elem: "path", d: "M-16,-17 L16,-17 L16,0 A16,17,0,0,1,-16,0 Z" }] },

  // 3: Crescent (C-shape, opening right)
  { parts: [{ elem: "path", d: "M13.9,-9.8 A17,17,0,1,0,13.9,9.8 A12,12,0,0,1,13.9,-9.8 Z" }] },

  // 4: Notched Circle (3/4 circle, bottom-right removed)
  { parts: [{ elem: "path", d: "M0,0 L0,17 A17,17,0,1,0,17,0 Z" }] },

  // 5: Four-Petal Clover (4 overlapping circles in 2x2)
  { parts: [
    { elem: "circle", cx: -7, cy: -7, r: 9.5 },
    { elem: "circle", cx: 7, cy: -7, r: 9.5 },
    { elem: "circle", cx: -7, cy: 7, r: 9.5 },
    { elem: "circle", cx: 7, cy: 7, r: 9.5 }
  ]},

  // 6: Pac-Man (mouth ~90deg facing right)
  { parts: [{ elem: "path", d: "M0,0 L12,12 A17,17,0,1,0,12,-12 Z" }] },

  // 7: Arch (thick inverted U with hollow center)
  { parts: [{ elem: "path", d: "M-17,3.5 L-17,-8.5 A17,17,0,0,1,17,-8.5 L17,3.5 L9,3.5 L9,-8.5 A9,9,0,0,0,-9,-8.5 L-9,3.5 Z" }] },

  // 8: Circle Cluster (5 circles in quincunx/dice-5 pattern)
  { parts: [
    { elem: "circle", cx: -9, cy: -9, r: 6.5 },
    { elem: "circle", cx: 9, cy: -9, r: 6.5 },
    { elem: "circle", cx: 0, cy: 0, r: 6.5 },
    { elem: "circle", cx: -9, cy: 9, r: 6.5 },
    { elem: "circle", cx: 9, cy: 9, r: 6.5 }
  ]},

  // 9: 8-pointed Star / Asterisk
  { parts: [{ elem: "path", d: "M0,-17 L3.1,-7.4 L12,-12 L7.4,-3.1 L17,0 L7.4,3.1 L12,12 L3.1,7.4 L0,17 L-3.1,7.4 L-12,12 L-7.4,3.1 L-17,0 L-7.4,-3.1 L-12,-12 L-3.1,-7.4 Z" }] },

  // 10: Circle Grid (4x4 small circles)
  { parts: [
    { elem: "circle", cx: -12, cy: -12, r: 3.2 },
    { elem: "circle", cx: -4, cy: -12, r: 3.2 },
    { elem: "circle", cx: 4, cy: -12, r: 3.2 },
    { elem: "circle", cx: 12, cy: -12, r: 3.2 },
    { elem: "circle", cx: -12, cy: -4, r: 3.2 },
    { elem: "circle", cx: -4, cy: -4, r: 3.2 },
    { elem: "circle", cx: 4, cy: -4, r: 3.2 },
    { elem: "circle", cx: 12, cy: -4, r: 3.2 },
    { elem: "circle", cx: -12, cy: 4, r: 3.2 },
    { elem: "circle", cx: -4, cy: 4, r: 3.2 },
    { elem: "circle", cx: 4, cy: 4, r: 3.2 },
    { elem: "circle", cx: 12, cy: 4, r: 3.2 },
    { elem: "circle", cx: -12, cy: 12, r: 3.2 },
    { elem: "circle", cx: -4, cy: 12, r: 3.2 },
    { elem: "circle", cx: 4, cy: 12, r: 3.2 },
    { elem: "circle", cx: 12, cy: 12, r: 3.2 }
  ]},

  // 11: Double Dome (small dome on top, large dome on bottom)
  { parts: [
    { elem: "path", d: "M-10,-2 A10,10,0,0,0,10,-2 Z" },
    { elem: "path", d: "M-17,12 A17,17,0,0,0,17,12 Z" }
  ]},

  // 12: Triple Dome (3 stacked semicircles, smallest on top)
  { parts: [
    { elem: "path", d: "M-5,-8 A5,5,0,0,0,5,-8 Z" },
    { elem: "path", d: "M-10,2 A10,10,0,0,0,10,2 Z" },
    { elem: "path", d: "M-16,13 A16,16,0,0,0,16,13 Z" }
  ]},

  // 13: Triangle Grid (8 right triangles in checkerboard pattern)
  { parts: [
    { elem: "path", d: "M-14,-14 L0,-14 L-14,0 Z" },
    { elem: "path", d: "M0,-14 L14,-14 L14,0 Z" },
    { elem: "path", d: "M0,0 L0,-14 L14,0 Z" },
    { elem: "path", d: "M-14,0 L0,0 L-14,14 Z" },
    { elem: "path", d: "M0,0 L14,0 L14,14 Z" },
    { elem: "path", d: "M0,0 L0,14 L-14,14 Z" },
    { elem: "path", d: "M0,14 L14,0 L14,14 Z" }
  ]},

  // 14: 5-Petal Flower (teardrop petals at 72deg intervals)
  { parts: [
    { elem: "path", d: "M0,1.5 C-5,-3.5 -5,-11.5 0,-14.5 C5,-11.5 5,-3.5 0,1.5 Z" },
    { elem: "path", d: "M0,1.5 C3.2,-4.8 10.8,-7.3 15.2,-3.4 C13.9,2.2 6.3,4.7 0,1.5 Z" },
    { elem: "path", d: "M0,1.5 C7.0,2.6 11.7,9.1 9.4,14.4 C3.6,15.0 -1.1,8.5 0,1.5 Z" },
    { elem: "path", d: "M0,1.5 C1.1,8.5 -3.6,15.0 -9.4,14.4 C-11.7,9.1 -7.0,2.6 0,1.5 Z" },
    { elem: "path", d: "M0,1.5 C-6.3,4.7 -13.9,2.2 -15.2,-3.4 C-10.8,-7.3 -3.2,-4.8 0,1.5 Z" }
  ]},

  // 15: Triple Chevron (3 wide leaf shapes fanning upward)
  { parts: [
    { elem: "path", d: "M0,14 C-3,6 -16,-2 -14,-12 C-10,-6 -2,4 0,14 Z" },
    { elem: "path", d: "M0,14 C-3,4 -3,-10 0,-14 C3,-10 3,4 0,14 Z" },
    { elem: "path", d: "M0,14 C3,6 16,-2 14,-12 C10,-6 2,4 0,14 Z" }
  ]}
];

// Grid positions: 5 columns x 2 rows
var SLOT_POSITIONS = [
  { x: 30, y: 30 },  { x: 90, y: 30 },  { x: 150, y: 30 },  { x: 210, y: 30 },  { x: 270, y: 30 },
  { x: 30, y: 100 }, { x: 90, y: 100 }, { x: 150, y: 100 }, { x: 210, y: 100 }, { x: 270, y: 100 }
];

// ============================================================
// DOM REFERENCES
// ============================================================

var appEl = document.getElementById("app");
var storageErrorEl = document.getElementById("storage-error");
var toastEl = document.getElementById("toast");
var progressCountEl = document.getElementById("progress-count");
var stepperMinusEl = document.getElementById("stepper-minus");
var stepperPlusEl = document.getElementById("stepper-plus");
var stepperValueEl = document.getElementById("stepper-value");
var codeInputEl = document.getElementById("code-input");
var punchBtnEl = document.getElementById("punch-btn");
var statusMessageEl = document.getElementById("status-message");
var celebrationEl = document.getElementById("celebration");
var celebrationCloseEl = document.getElementById("celebration-close");
var cardSvgEl = document.querySelector(".card-svg");
var slotGroups = []; // populated by renderSVGSlots

// Tab elements
var tabPunchEl = document.getElementById("tab-punch");
var tabPromoEl = document.getElementById("tab-promo");
var punchSectionEl = document.getElementById("punch-section");
var promoSectionEl = document.getElementById("promo-section");

// Promo elements
var promoInputEl = document.getElementById("promo-input");
var promoCheckBtnEl = document.getElementById("promo-check-btn");
var promoStatusEl = document.getElementById("promo-status");
var promoEntryEl = document.getElementById("promo-entry");
var promoResultEl = document.getElementById("promo-result");
var promoAmountEl = document.getElementById("promo-amount");
var promoActiveCodeNameEl = document.getElementById("promo-active-code-name");
var promoUseAmountEl = document.getElementById("promo-use-amount");
var promoRedeemBtnEl = document.getElementById("promo-redeem-btn");
var promoRedeemStatusEl = document.getElementById("promo-redeem-status");
var promoRedeemedEl = document.getElementById("promo-redeemed");
var promoRedeemedUsedEl = document.getElementById("promo-redeemed-used");
var promoRemainingRowEl = document.getElementById("promo-remaining-row");
var promoRemainingAmountEl = document.getElementById("promo-remaining-amount");
var promoNewBtnEl = document.getElementById("promo-new-btn");
var promoHistoryEl = document.getElementById("promo-history");
var promoHistoryListEl = document.getElementById("promo-history-list");

// ============================================================
// STATE
// ============================================================

var state = { punches: 0, celebrationPending: false, shapeIndices: [] };
var quantity = 1;
var toastTimer = null;
var errorTimer = null;
var isAnimating = false;

var currentPromo = { code: null, amount: null };

// Cloud sync
var db = null;
var cardId = null;
var pendingNewCardId = null;
var pendingCarryOver = 0;

// ============================================================
// SHAPE RENDERING
// ============================================================

/**
 * Pick 10 random shape indices from the 16 available (no repeats).
 */
function generateShapeIndices() {
  var indices = [];
  for (var i = 0; i < SHAPE_DEFS.length; i++) {
    indices.push(i);
  }
  // Fisher-Yates shuffle
  for (var i = indices.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = indices[i];
    indices[i] = indices[j];
    indices[j] = temp;
  }
  return indices.slice(0, TOTAL_PUNCHES);
}

/**
 * Create SVG markup for a single element (circle or path).
 * className: "slot-outline" or "slot-fill"
 * isFill: true for the colored fill layer
 */
function createSVGElement(part, className, isFill) {
  var fillAttr, strokeAttr;

  if (isFill) {
    fillAttr = 'fill="rgb(32,80,130)"';
    strokeAttr = 'stroke="rgb(32,80,130)" stroke-width="1.5"';
  } else {
    fillAttr = 'fill="none"';
    strokeAttr = 'stroke="#999999" stroke-width="1.5"';
  }

  var vecEffect = ' vector-effect="non-scaling-stroke"';

  if (part.elem === "circle") {
    var cx = part.cx || 0;
    var cy = part.cy || 0;
    return '<circle class="' + className + '" cx="' + cx + '" cy="' + cy + '" r="' + part.r + '" ' + fillAttr + ' ' + strokeAttr + vecEffect + '/>';
  } else if (part.elem === "path") {
    return '<path class="' + className + '" d="' + part.d + '" ' + fillAttr + ' ' + strokeAttr + vecEffect + '/>';
  }
  return '';
}

/**
 * Render all 10 SVG slot groups into the card SVG based on shapeIndices.
 */
function renderSVGSlots(shapeIndices) {
  var TARGET_SIZE = 34;

  // Remove existing slots
  var existing = cardSvgEl.querySelectorAll(".slot");
  for (var j = existing.length - 1; j >= 0; j--) {
    cardSvgEl.removeChild(existing[j]);
  }

  // Build and insert new slots with inner group wrapper
  for (var i = 0; i < TOTAL_PUNCHES; i++) {
    var shapeDef = SHAPE_DEFS[shapeIndices[i]];
    var pos = SLOT_POSITIONS[i];
    var html = '';

    // Outline elements
    for (var p = 0; p < shapeDef.parts.length; p++) {
      html += createSVGElement(shapeDef.parts[p], "slot-outline", false);
    }
    // Fill elements
    for (var p = 0; p < shapeDef.parts.length; p++) {
      html += createSVGElement(shapeDef.parts[p], "slot-fill", true);
    }

    // Create the group with inner wrapper for normalization
    var temp = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    temp.innerHTML = '<g class="slot" data-slot="' + i + '" transform="translate(' + pos.x + ',' + pos.y + ')"><g class="slot-inner">' + html + '</g></g>';
    cardSvgEl.appendChild(temp.firstChild);
  }

  // Re-query slot groups
  slotGroups = cardSvgEl.querySelectorAll(".slot");

  // Normalize each shape to fit uniformly in TARGET_SIZE x TARGET_SIZE
  for (var i = 0; i < slotGroups.length; i++) {
    var inner = slotGroups[i].querySelector(".slot-inner");
    try {
      var bbox = inner.getBBox();
      if (bbox.width === 0 || bbox.height === 0) continue;

      var cx = bbox.x + bbox.width / 2;
      var cy = bbox.y + bbox.height / 2;
      var maxDim = Math.max(bbox.width, bbox.height);
      var scale = TARGET_SIZE / maxDim;

      // scale() then translate(): translate runs first (centers shape at origin),
      // then scale resizes to target. vector-effect keeps strokes consistent.
      inner.setAttribute("transform",
        "scale(" + scale + ") translate(" + (-cx) + "," + (-cy) + ")");
    } catch (e) {
      // Shape failed to measure — leave as-is
    }
  }
}

// Card backup modal DOM references
var cardBackupOverlayEl = document.getElementById("card-backup-overlay");
var cardBackupChoiceViewEl = document.getElementById("card-backup-choice-view");
var cardBackupChoiceNewBtnEl = document.getElementById("card-backup-choice-new-btn");
var cardBackupChoiceRestoreEl = document.getElementById("card-backup-choice-restore");
var cardBackupNewViewEl = document.getElementById("card-backup-new-view");
var cardBackupRestoreViewEl = document.getElementById("card-backup-restore-view");
var cardIdDisplayEl = document.getElementById("card-id-display");
var cardBackupIdDisplayEl = document.getElementById("card-backup-id-display");
var cardBackupNewDescEl = document.getElementById("card-backup-new-desc");
var cardBackupGotItBtnEl = document.getElementById("card-backup-gotit-btn");
var cardBackupCopyBtnEl = document.getElementById("card-backup-copy-btn");
var cardBackupSwitchRestoreEl = document.getElementById("card-backup-switch-restore");
var cardBackupRestoreInputEl = document.getElementById("card-backup-restore-input");
var cardBackupRestoreBtnEl = document.getElementById("card-backup-restore-btn");
var cardBackupRestoreStatusEl = document.getElementById("card-backup-restore-status");
var cardBackupSwitchNewEl = document.getElementById("card-backup-switch-new");
var cardSettingsViewEl = document.getElementById("card-settings-view");
var cardSettingsIdDisplayEl = document.getElementById("card-settings-id-display");
var cardSettingsCopyBtnEl = document.getElementById("card-settings-copy-btn");
var cardSettingsCloseBtnEl = document.getElementById("card-settings-close-btn");
var cardSettingsSwitchReplaceEl = document.getElementById("card-settings-switch-replace");
var myCardBtnEl = document.getElementById("my-card-btn");
var utilityDividerEl = document.getElementById("utility-divider");

function showUtilityIcon(el) {
  el.classList.remove("hidden");
  utilityDividerEl.classList.remove("hidden");
}

// ============================================================
// FIREBASE / CLOUD SYNC
// ============================================================

function initFirebase() {
  if (!FIREBASE_CONFIG.apiKey) return;
  try {
    firebase.initializeApp(FIREBASE_CONFIG);
    db = firebase.firestore();
  } catch (e) {}
}

function generateCardId() {
  var chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  var id = "";
  for (var i = 0; i < 6; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

function getStoredCardId() {
  try { return localStorage.getItem(CARD_ID_KEY) || null; } catch(e) { return null; }
}

function storeCardId(id) {
  try { localStorage.setItem(CARD_ID_KEY, id); } catch(e) {}
}

function loadFromCloud(id, callback) {
  if (!db) { callback(null); return; }
  db.collection("cards").doc(id).get()
    .then(function(doc) { callback(doc.exists ? doc.data() : null); })
    .catch(function() { callback(null); });
}

function saveToCloud(stateData) {
  if (!db || !cardId) return;
  var promoData = {};
  var activePromo = null;
  try {
    var raw = localStorage.getItem(PROMO_LOCALSTORAGE_KEY);
    if (raw) promoData = JSON.parse(raw);
    activePromo = localStorage.getItem(ACTIVE_PROMO_KEY) || null;
  } catch(e) {}
  db.collection("cards").doc(cardId).set({
    punches: stateData.punches,
    celebrationPending: stateData.celebrationPending,
    shapeIndices: stateData.shapeIndices,
    promos: promoData,
    activePromo: activePromo
  }).catch(function() {});
}

function validateCloudState(data) {
  var defaults = { punches: 0, celebrationPending: false, shapeIndices: generateShapeIndices() };
  if (!data) return defaults;
  if (typeof data.punches !== "number" || !Number.isInteger(data.punches) ||
      data.punches < 0 || data.punches > TOTAL_PUNCHES) return defaults;
  if (typeof data.celebrationPending !== "boolean") return defaults;
  if (!Array.isArray(data.shapeIndices) || data.shapeIndices.length !== TOTAL_PUNCHES) {
    return { punches: data.punches, celebrationPending: data.celebrationPending, shapeIndices: generateShapeIndices() };
  }
  return { punches: data.punches, celebrationPending: data.celebrationPending, shapeIndices: data.shapeIndices.slice() };
}

// ============================================================
// CARD BACKUP MODAL
// ============================================================

function showCardBackupModal(migrationPunches) {
  cardBackupRestoreInputEl.value = "";
  cardBackupRestoreBtnEl.disabled = true;
  cardBackupRestoreStatusEl.className = "status-message hidden";

  if (migrationPunches > 0) {
    // User has existing punches but no card ID — give them a new code immediately
    pendingNewCardId = generateCardId();
    cardBackupIdDisplayEl.textContent = pendingNewCardId;
    cardBackupNewDescEl.textContent = "יש לכם " + migrationPunches + " ניקובים! שמרו את הקוד כדי שלא תאבדו אותם אף פעם.";
    showAllViews(cardBackupNewViewEl);
  } else {
    // New or returning user — ask first before generating a code
    showAllViews(cardBackupChoiceViewEl);
  }

  cardBackupOverlayEl.classList.remove("hidden");
  appEl.setAttribute("aria-hidden", "true");
}

function hideCardBackupModal() {
  cardBackupOverlayEl.classList.add("hidden");
  appEl.removeAttribute("aria-hidden");
}

function confirmNewCard() {
  cardId = pendingNewCardId;
  storeCardId(cardId);
  saveToCloud(state);
  showUtilityIcon(myCardBtnEl);
  updateCardIdDisplay();
  hideCardBackupModal();
}

function handleRestoreCard() {
  var enteredId = cardBackupRestoreInputEl.value.trim().toUpperCase();
  if (!enteredId) return;

  cardBackupRestoreBtnEl.disabled = true;
  cardBackupRestoreStatusEl.textContent = "מחפש...";
  cardBackupRestoreStatusEl.className = "status-message";

  loadFromCloud(enteredId, function(cloudData) {
    cardBackupRestoreBtnEl.disabled = false;
    if (!cloudData) {
      cardBackupRestoreStatusEl.textContent = "קוד לא נמצא, נסו שוב";
      cardBackupRestoreStatusEl.className = "status-message error";
      return;
    }
    var restored = validateCloudState(cloudData);
    cardId = enteredId;
    storeCardId(cardId);
    // Restore promo data if present
    try {
      if (cloudData.promos) localStorage.setItem(PROMO_LOCALSTORAGE_KEY, JSON.stringify(cloudData.promos));
      if (cloudData.activePromo) localStorage.setItem(ACTIVE_PROMO_KEY, cloudData.activePromo);
    } catch(e) {}
    saveState(restored);
    renderSVGSlots(state.shapeIndices);
    render();
    showUtilityIcon(myCardBtnEl);
    updateCardIdDisplay();
    hideCardBackupModal();
    showToast("הכרטיס שוחזר בהצלחה :)");
    if (state.celebrationPending) {
      lockUI();
      showCelebration();
    }
  });
}

cardBackupChoiceNewBtnEl.addEventListener("click", function() {
  pendingNewCardId = generateCardId();
  cardBackupIdDisplayEl.textContent = pendingNewCardId;
  cardBackupNewDescEl.textContent = "זה הקוד האישי שלכם. שמרו אותו — תוכלו לשחזר את הניקובים מכל מכשיר.";
  showAllViews(cardBackupNewViewEl);
});

cardBackupChoiceRestoreEl.addEventListener("click", function() {
  showAllViews(cardBackupRestoreViewEl);
});

cardBackupGotItBtnEl.addEventListener("click", confirmNewCard);

cardBackupCopyBtnEl.addEventListener("click", function() {
  if (pendingNewCardId) copyCode(pendingNewCardId, cardBackupCopyBtnEl);
});

cardBackupSwitchRestoreEl.addEventListener("click", function() {
  cardBackupNewViewEl.classList.add("hidden");
  cardBackupRestoreViewEl.classList.remove("hidden");
  cardBackupRestoreInputEl.value = "";
  cardBackupRestoreStatusEl.className = "status-message hidden";
  cardBackupRestoreBtnEl.disabled = true;
});

cardBackupSwitchNewEl.addEventListener("click", function() {
  if (!pendingNewCardId) {
    pendingNewCardId = generateCardId();
    cardBackupIdDisplayEl.textContent = pendingNewCardId;
    cardBackupNewDescEl.textContent = "זה הקוד האישי שלכם. שמרו אותו — תוכלו לשחזר את הניקובים מכל מכשיר.";
  }
  showAllViews(cardBackupNewViewEl);
});

cardBackupRestoreInputEl.addEventListener("input", function() {
  cardBackupRestoreBtnEl.disabled = (cardBackupRestoreInputEl.value.trim().length === 0);
  if (cardBackupRestoreStatusEl.classList.contains("error")) {
    cardBackupRestoreStatusEl.className = "status-message hidden";
  }
});

cardBackupRestoreBtnEl.addEventListener("click", handleRestoreCard);

cardBackupRestoreInputEl.addEventListener("keydown", function(e) {
  if (e.key === "Enter" && !cardBackupRestoreBtnEl.disabled) {
    e.preventDefault();
    handleRestoreCard();
  }
});

function showAllViews(show) {
  cardBackupChoiceViewEl.classList.add("hidden");
  cardBackupNewViewEl.classList.add("hidden");
  cardBackupRestoreViewEl.classList.add("hidden");
  cardSettingsViewEl.classList.add("hidden");
  show.classList.remove("hidden");
}

function updateCardIdDisplay() {
  if (cardId && cardIdDisplayEl) {
    cardIdDisplayEl.innerHTML = "הכרטיס שלי: <span dir=\"ltr\">" + cardId + "</span>";
    cardIdDisplayEl.classList.remove("hidden");
  }
}

function showCardSettingsModal() {
  cardSettingsIdDisplayEl.textContent = cardId;
  cardBackupRestoreInputEl.value = "";
  cardBackupRestoreBtnEl.disabled = true;
  cardBackupRestoreStatusEl.className = "status-message hidden";
  showAllViews(cardSettingsViewEl);
  cardBackupOverlayEl.classList.remove("hidden");
  appEl.setAttribute("aria-hidden", "true");
}

function copyCode(code, btn) {
  var origText = btn.textContent;
  navigator.clipboard.writeText(code).then(function() {
    btn.textContent = "הועתק!";
    setTimeout(function() { btn.textContent = origText; }, 1500);
  }).catch(function() {
    var ta = document.createElement("textarea");
    ta.value = code;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    btn.textContent = "הועתק!";
    setTimeout(function() { btn.textContent = origText; }, 1500);
  });
}

cardSettingsCopyBtnEl.addEventListener("click", function() {
  copyCode(cardId, cardSettingsCopyBtnEl);
});

cardSettingsCloseBtnEl.addEventListener("click", hideCardBackupModal);

cardSettingsSwitchReplaceEl.addEventListener("click", function() {
  cardBackupRestoreInputEl.value = "";
  cardBackupRestoreBtnEl.disabled = true;
  cardBackupRestoreStatusEl.className = "status-message hidden";
  showAllViews(cardBackupRestoreViewEl);
  // Override "כרטיס חדש" to go back to settings
  cardBackupSwitchNewEl.textContent = "ביטול";
  cardBackupSwitchNewEl.onclick = function() {
    showAllViews(cardSettingsViewEl);
    cardBackupSwitchNewEl.textContent = "כרטיס חדש";
    cardBackupSwitchNewEl.onclick = null;
  };
});

myCardBtnEl.addEventListener("click", showCardSettingsModal);

// ============================================================
// LOCALSTORAGE HELPERS
// ============================================================

/**
 * Check if localStorage is available by writing and reading a test value.
 */
function checkLocalStorageAvailable() {
  try {
    var testKey = "__nikuv_test__";
    localStorage.setItem(testKey, "1");
    var result = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);
    return result === "1";
  } catch (e) {
    return false;
  }
}

/**
 * Load state from localStorage. Returns defaults if data is
 * missing, unparseable, or fails validation.
 */
function loadState() {
  var defaults = { punches: 0, celebrationPending: false, shapeIndices: generateShapeIndices() };
  var raw;

  try {
    raw = localStorage.getItem(LOCALSTORAGE_KEY);
  } catch (e) {
    return defaults;
  }

  if (raw === null) {
    return defaults;
  }

  var parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    return defaults;
  }

  // Validate punches
  if (typeof parsed.punches !== "number" ||
      !Number.isInteger(parsed.punches) ||
      parsed.punches < 0 ||
      parsed.punches > TOTAL_PUNCHES) {
    return defaults;
  }

  // Validate celebrationPending
  if (typeof parsed.celebrationPending !== "boolean") {
    return defaults;
  }

  // Validate shapeIndices
  if (!Array.isArray(parsed.shapeIndices) ||
      parsed.shapeIndices.length !== TOTAL_PUNCHES) {
    // Keep punches/celebration but assign new shapes
    return {
      punches: parsed.punches,
      celebrationPending: parsed.celebrationPending,
      shapeIndices: generateShapeIndices()
    };
  }

  var seen = {};
  for (var i = 0; i < parsed.shapeIndices.length; i++) {
    var idx = parsed.shapeIndices[i];
    if (typeof idx !== "number" || !Number.isInteger(idx) || idx < 0 || idx >= SHAPE_DEFS.length || seen[idx]) {
      return {
        punches: parsed.punches,
        celebrationPending: parsed.celebrationPending,
        shapeIndices: generateShapeIndices()
      };
    }
    seen[idx] = true;
  }

  return {
    punches: parsed.punches,
    celebrationPending: parsed.celebrationPending,
    shapeIndices: parsed.shapeIndices.slice()
  };
}

/**
 * Save state to localStorage and cloud. Shows a toast on error.
 */
function saveState(newState) {
  state = newState;
  try {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    showToast("לא ניתן לשמור את הכרטיס");
  }
  saveToCloud(state);
}

// ============================================================
// RENDERING
// ============================================================

/**
 * Render the entire UI from the current state (static, no animation).
 */
function render() {
  for (var i = 0; i < slotGroups.length; i++) {
    slotGroups[i].classList.remove("animating");
    if (i < state.punches) {
      slotGroups[i].classList.add("punched");
    } else {
      slotGroups[i].classList.remove("punched");
    }
  }

  progressCountEl.textContent = state.punches;

  var maxQuantity = TOTAL_PUNCHES;
  if (quantity > maxQuantity) {
    quantity = maxQuantity;
  }
  if (quantity < MIN_QUANTITY) {
    quantity = MIN_QUANTITY;
  }
  renderStepper(maxQuantity);
}

/**
 * Animate new punches filling in one by one with a 200ms stagger.
 */
function animatePunches(startSlot, count, onComplete) {
  var animationDuration = 400;
  var stagger = 200;

  for (var i = 0; i < count; i++) {
    (function (slotIndex, delay) {
      setTimeout(function () {
        slotGroups[slotIndex].classList.add("punched", "animating");
        progressCountEl.textContent = slotIndex + 1;
      }, delay);
    })(startSlot + i, i * stagger);
  }

  var totalTime = (count - 1) * stagger + animationDuration;
  if (onComplete) {
    setTimeout(onComplete, totalTime);
  }
}

/**
 * Render the stepper value and button disabled states.
 */
function renderStepper(maxQuantity) {
  stepperValueEl.textContent = quantity;
  stepperMinusEl.disabled = (quantity <= MIN_QUANTITY);
  stepperPlusEl.disabled = (quantity >= maxQuantity);
}

/**
 * Update the punch button disabled state based on input content.
 */
function updatePunchButtonState() {
  punchBtnEl.disabled = (codeInputEl.value.length === 0);
}

// ============================================================
// TOAST
// ============================================================

function showToast(message, duration) {
  if (duration === undefined) {
    duration = 1500;
  }

  if (toastTimer !== null) {
    clearTimeout(toastTimer);
    toastTimer = null;
  }

  toastEl.textContent = message;
  toastEl.classList.remove("hidden");
  void toastEl.offsetWidth;
  toastEl.classList.add("visible");

  toastTimer = setTimeout(function () {
    toastEl.classList.remove("visible");
    setTimeout(function () {
      toastEl.classList.add("hidden");
    }, 300);
    toastTimer = null;
  }, duration);
}

// ============================================================
// STATUS MESSAGE (error / success below input)
// ============================================================

function showStatusMessage(text, type) {
  if (errorTimer !== null) {
    clearTimeout(errorTimer);
    errorTimer = null;
  }

  statusMessageEl.textContent = text;
  statusMessageEl.className = "status-message " + type;

  if (type === "error") {
    errorTimer = setTimeout(function () {
      clearStatusMessage();
      errorTimer = null;
    }, 3000);
  }
}

function clearStatusMessage() {
  statusMessageEl.textContent = "";
  statusMessageEl.className = "status-message hidden";
  if (errorTimer !== null) {
    clearTimeout(errorTimer);
    errorTimer = null;
  }
}

// ============================================================
// CELEBRATION
// ============================================================

function trapFocusCelebration(e) {
  if (e.key === "Tab") {
    e.preventDefault();
    celebrationCloseEl.focus();
  }
  if (e.key === "Escape") {
    dismissCelebration();
  }
}

function showCelebration() {
  celebrationEl.classList.add("visible");
  document.body.classList.add("celebration-active");
  appEl.setAttribute("aria-hidden", "true");
  document.addEventListener("keydown", trapFocusCelebration);
  setTimeout(function () {
    celebrationCloseEl.focus();
  }, 300);
}

function dismissCelebration() {
  if (!celebrationEl.classList.contains("visible")) return;

  celebrationEl.classList.remove("visible");
  document.removeEventListener("keydown", trapFocusCelebration);

  setTimeout(function () {
    document.body.classList.remove("celebration-active");
    appEl.removeAttribute("aria-hidden");

    // Generate new shapes for the new card
    var newIndices = generateShapeIndices();
    var carryOver = pendingCarryOver;
    pendingCarryOver = 0;

    saveState({ punches: 0, celebrationPending: false, shapeIndices: newIndices });
    renderSVGSlots(state.shapeIndices);
    render();

    if (carryOver > 0) {
      lockUI();
      animatePunches(0, carryOver, function () {
        saveState({ punches: carryOver, celebrationPending: false, shapeIndices: newIndices });
        quantity = 1;
        unlockUI();
        showToast("כרטיסיה חדשה עם " + carryOver + " ניקובים :)");
      });
    } else {
      quantity = 1;
      unlockUI();
      showToast("כרטיסיה חדשה :)");
    }
  }, 300);
}

// ============================================================
// PUNCH LOGIC
// ============================================================

function lockUI() {
  isAnimating = true;
  punchBtnEl.disabled = true;
  stepperMinusEl.disabled = true;
  stepperPlusEl.disabled = true;
  codeInputEl.disabled = true;
}

function unlockUI() {
  isAnimating = false;
  codeInputEl.disabled = false;
  updatePunchButtonState();
  renderStepper(TOTAL_PUNCHES);
}

function handlePunch() {
  if (isAnimating) return;

  var enteredCode = codeInputEl.value.trim().toLowerCase();
  var correctCode = PUNCH_CODE.toLowerCase();

  if (enteredCode === correctCode) {
    var oldPunches = state.punches;
    var awardedQuantity = quantity;
    var newPunches = oldPunches + awardedQuantity;
    var carryOver = Math.max(0, newPunches - TOTAL_PUNCHES);
    var punchesToFill = awardedQuantity - carryOver;

    codeInputEl.value = "";
    quantity = 1;
    clearStatusMessage();
    lockUI();

    if (newPunches >= TOTAL_PUNCHES) {
      pendingCarryOver = carryOver;
      saveState({ punches: 0, celebrationPending: true, shapeIndices: state.shapeIndices });

      animatePunches(oldPunches, punchesToFill, function () {
        setTimeout(function () {
          showCelebration();
        }, 500);
      });
    } else {
      saveState({ punches: newPunches, celebrationPending: false, shapeIndices: state.shapeIndices });

      animatePunches(oldPunches, awardedQuantity, function () {
        unlockUI();

        if (awardedQuantity === 1) {
          showToast("ניקוב נוסף בהצלחה");
        } else {
          showToast(awardedQuantity + " ניקובים נוספו בהצלחה");
        }
      });
    }
  } else {
    codeInputEl.value = "";
    updatePunchButtonState();

    codeInputEl.classList.add("shake");

    showStatusMessage("קוד לא נכון, נסו שוב", "error");
  }
}

// ============================================================
// EVENT HANDLERS
// ============================================================

stepperMinusEl.addEventListener("click", function () {
  if (isAnimating) return;
  if (quantity > MIN_QUANTITY) {
    quantity--;
    renderStepper(TOTAL_PUNCHES);
  }
});

stepperPlusEl.addEventListener("click", function () {
  if (isAnimating) return;
  if (quantity < TOTAL_PUNCHES) {
    quantity++;
    renderStepper(TOTAL_PUNCHES);
  }
});

codeInputEl.addEventListener("input", function () {
  updatePunchButtonState();
  if (statusMessageEl.classList.contains("error")) {
    clearStatusMessage();
  }
});

punchBtnEl.addEventListener("click", function () {
  if (!punchBtnEl.disabled) {
    handlePunch();
  }
});

codeInputEl.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && codeInputEl.value.length > 0) {
    e.preventDefault();
    handlePunch();
  }
});

codeInputEl.addEventListener("animationend", function () {
  codeInputEl.classList.remove("shake");
});

celebrationCloseEl.addEventListener("click", function () {
  dismissCelebration();
});

// Cross-tab sync via storage event
window.addEventListener("storage", function (e) {
  if (e.key === LOCALSTORAGE_KEY) {
    if (isAnimating || celebrationEl.classList.contains("visible")) return;
    state = loadState();
    renderSVGSlots(state.shapeIndices);
    quantity = 1;
    render();
    if (state.celebrationPending) {
      lockUI();
      showCelebration();
    }
  }
});

// ============================================================
// TAB SWITCHING
// ============================================================

function switchTab(tab) {
  if (tab === "punch") {
    tabPunchEl.classList.add("tab-btn--active");
    tabPromoEl.classList.remove("tab-btn--active");
    punchSectionEl.classList.remove("hidden");
    promoSectionEl.classList.add("hidden");
  } else {
    tabPromoEl.classList.add("tab-btn--active");
    tabPunchEl.classList.remove("tab-btn--active");
    promoSectionEl.classList.remove("hidden");
    punchSectionEl.classList.add("hidden");
    // Restore active code if entry form is showing
    var activeCode = getActivePromo();
    if (activeCode && !promoEntryEl.classList.contains("hidden")) {
      showActiveCode(activeCode);
    }
    renderPromoHistory();
  }
}

tabPunchEl.addEventListener("click", function () { switchTab("punch"); });
tabPromoEl.addEventListener("click", function () { switchTab("promo"); });

// ============================================================
// PROMO CODE LOGIC
// ============================================================

function getActivePromo() {
  try { return localStorage.getItem(ACTIVE_PROMO_KEY) || null; } catch(e) { return null; }
}
function setActivePromo(code) {
  try { localStorage.setItem(ACTIVE_PROMO_KEY, code); } catch(e) {}
}
function clearActivePromo() {
  try { localStorage.removeItem(ACTIVE_PROMO_KEY); } catch(e) {}
}

function loadPromoData() {
  try {
    var raw = localStorage.getItem(PROMO_LOCALSTORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

function getPromoRemaining(code) {
  var data = loadPromoData();
  if (data[code] !== undefined) {
    return data[code].remaining;
  }
  return PROMO_CODES[code]; // never used yet — full amount
}

function savePromoRedemption(code, usedAmount) {
  try {
    var data = loadPromoData();
    var current = data[code] || { remaining: PROMO_CODES[code], history: [] };
    var newRemaining = current.remaining - usedAmount;
    var today = new Date().toISOString().split("T")[0];
    data[code] = {
      remaining: newRemaining,
      history: current.history.concat([{ used: usedAmount, date: today }])
    };
    localStorage.setItem(PROMO_LOCALSTORAGE_KEY, JSON.stringify(data));
    saveToCloud(state);
  } catch (e) {
    // ignore
  }
}

function showPromoStatus(text, type) {
  promoStatusEl.textContent = text;
  promoStatusEl.className = "status-message " + type;
}

function clearPromoStatus() {
  promoStatusEl.textContent = "";
  promoStatusEl.className = "status-message hidden";
}

function showPromoRedeemStatus(text, type) {
  promoRedeemStatusEl.textContent = text;
  promoRedeemStatusEl.className = "status-message " + type;
}

function clearPromoRedeemStatus() {
  promoRedeemStatusEl.textContent = "";
  promoRedeemStatusEl.className = "status-message hidden";
}

function updatePromoCheckBtnState() {
  promoCheckBtnEl.disabled = (promoInputEl.value.length === 0);
}

function updatePromoRedeemBtnState() {
  var val = promoUseAmountEl.value.trim();
  var num = parseFloat(val);
  promoRedeemBtnEl.disabled = (!val || isNaN(num) || num <= 0);
}

function showActiveCode(code) {
  var remaining = getPromoRemaining(code);
  if (remaining <= 0) {
    clearActivePromo();
    resetPromoTab();
    return;
  }
  currentPromo = { code: code, amount: remaining };
  promoAmountEl.textContent = remaining + " ₪";
  promoActiveCodeNameEl.textContent = code;
  promoUseAmountEl.value = "";
  promoUseAmountEl.max = remaining;
  clearPromoRedeemStatus();
  updatePromoRedeemBtnState();
  promoEntryEl.classList.add("hidden");
  promoResultEl.classList.remove("hidden");
  promoRedeemedEl.classList.add("hidden");
}

function renderPromoHistory() {
  var data = loadPromoData();
  var fullyUsed = [];
  Object.keys(data).forEach(function(code) {
    if (data[code].remaining === 0) {
      fullyUsed.push({ code: code, history: data[code].history });
    }
  });
  if (fullyUsed.length === 0) {
    promoHistoryEl.classList.add("hidden");
    return;
  }
  promoHistoryEl.classList.remove("hidden");
  promoHistoryListEl.innerHTML = "";
  fullyUsed.forEach(function(item) {
    var total = item.history.reduce(function(sum, h) { return sum + h.used; }, 0);
    var lastDate = item.history.length > 0 ? item.history[item.history.length - 1].date : "";
    var row = document.createElement("div");
    row.className = "promo-history-row";
    row.innerHTML =
      '<span class="promo-history-code">' + item.code + '</span>' +
      '<span class="promo-history-info">' + total + ' ₪ · ' + lastDate + '</span>';
    promoHistoryListEl.appendChild(row);
  });
}

function handlePromoCheck() {
  var enteredCode = promoInputEl.value.trim().toUpperCase();
  if (!enteredCode) return;

  if (PROMO_CODES[enteredCode] === undefined) {
    promoInputEl.classList.add("shake");
    showPromoStatus("קוד לא תקף", "error");
    promoInputEl.value = "";
    updatePromoCheckBtnState();
    return;
  }

  var remaining = getPromoRemaining(enteredCode);

  if (remaining <= 0) {
    promoInputEl.classList.add("shake");
    showPromoStatus("כרטיס המתנה אזל", "error");
    promoInputEl.value = "";
    updatePromoCheckBtnState();
    return;
  }

  setActivePromo(enteredCode);
  promoInputEl.value = "";
  clearPromoStatus();
  showActiveCode(enteredCode);
}

function handlePromoRedeem() {
  if (!currentPromo.code) return;

  var useAmount = Math.round(parseFloat(promoUseAmountEl.value));

  if (isNaN(useAmount) || useAmount <= 0) {
    showPromoRedeemStatus("הכניסו סכום תקין", "error");
    return;
  }

  if (useAmount > currentPromo.amount) {
    showPromoRedeemStatus("הסכום גבוה מהיתרה (" + currentPromo.amount + " ₪)", "error");
    return;
  }

  var redeemedCode = currentPromo.code;
  savePromoRedemption(redeemedCode, useAmount);
  var remaining = currentPromo.amount - useAmount;

  promoRedeemedUsedEl.textContent = useAmount + " ₪";

  if (remaining > 0) {
    promoRemainingAmountEl.textContent = remaining + " ₪";
    promoRemainingRowEl.classList.remove("hidden");
    promoNewBtnEl.textContent = "מימוש נוסף";
    currentPromo.amount = remaining;
  } else {
    promoRemainingRowEl.classList.add("hidden");
    promoNewBtnEl.textContent = "סגור";
    clearActivePromo();
    currentPromo = { code: null, amount: null };
    renderPromoHistory();
  }

  promoResultEl.classList.add("hidden");
  promoRedeemedEl.classList.remove("hidden");
}

function resetPromoTab() {
  clearActivePromo();
  currentPromo = { code: null, amount: null };
  promoInputEl.value = "";
  promoUseAmountEl.value = "";
  clearPromoStatus();
  clearPromoRedeemStatus();
  promoEntryEl.classList.remove("hidden");
  promoResultEl.classList.add("hidden");
  promoRedeemedEl.classList.add("hidden");
  updatePromoCheckBtnState();
  updatePromoRedeemBtnState();
  renderPromoHistory();
}

promoInputEl.addEventListener("input", function () {
  updatePromoCheckBtnState();
  if (promoStatusEl.classList.contains("error")) clearPromoStatus();
});

promoCheckBtnEl.addEventListener("click", function () {
  if (!promoCheckBtnEl.disabled) handlePromoCheck();
});

promoInputEl.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && promoInputEl.value.length > 0) {
    e.preventDefault();
    handlePromoCheck();
  }
});

promoInputEl.addEventListener("animationend", function () {
  promoInputEl.classList.remove("shake");
});

promoUseAmountEl.addEventListener("input", function () {
  updatePromoRedeemBtnState();
  if (promoRedeemStatusEl.classList.contains("error")) clearPromoRedeemStatus();
});

promoUseAmountEl.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !promoRedeemBtnEl.disabled) {
    e.preventDefault();
    handlePromoRedeem();
  }
});

promoRedeemBtnEl.addEventListener("click", handlePromoRedeem);

promoNewBtnEl.addEventListener("click", function () {
  promoRedeemedEl.classList.add("hidden");
  var activeCode = getActivePromo();
  if (activeCode) {
    showActiveCode(activeCode);
  } else {
    resetPromoTab();
  }
});

// ============================================================
// INITIALIZATION
// ============================================================

(function init() {
  // Set inputmode from config constant
  codeInputEl.setAttribute("inputmode", INPUT_MODE);

  // Check localStorage availability
  if (!checkLocalStorageAvailable()) {
    appEl.classList.add("hidden");
    storageErrorEl.classList.remove("hidden");
    return;
  }

  // Initialize Firebase
  initFirebase();

  // Load persisted state
  state = loadState();

  // Render SVG shapes
  renderSVGSlots(state.shapeIndices);

  // Initial render
  render();
  updatePunchButtonState();

  // Save state if shapes were newly generated (first load or migration)
  // (skip cloud save here — card ID not assigned yet)
  try { localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(state)); } catch(e) {}

  // Card ID / cloud sync
  cardId = getStoredCardId();
  if (!cardId) {
    // Show backup modal (migration if they already have punches)
    showCardBackupModal(state.punches);
  } else {
    showUtilityIcon(myCardBtnEl);
    updateCardIdDisplay();
    // Background sync: pull from cloud in case local was cleared or behind
    loadFromCloud(cardId, function(cloudData) {
      if (!cloudData || isAnimating || celebrationEl.classList.contains("visible")) return;
      var cloudState = validateCloudState(cloudData);
      if (cloudState.punches > state.punches) {
        state = cloudState;
        try { localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(state)); } catch(e) {}
        renderSVGSlots(state.shapeIndices);
        render();
      }
    });
  }

  // Install hint button
  (function() {
    var isStandalone = window.navigator.standalone || window.matchMedia("(display-mode: standalone)").matches;
    if (isStandalone) return;
    var ua = navigator.userAgent;
    var isIOS = /iPhone|iPad|iPod/.test(ua);
    var isAndroid = /Android/.test(ua);
    if (!isIOS && !isAndroid) return;

    var btn = document.getElementById("a2hs-btn");
    var popup = document.getElementById("a2hs-popup");
    var backdrop = document.getElementById("a2hs-backdrop");
    var textEl = document.getElementById("a2hs-popup-text");
    var closeBtn = document.getElementById("a2hs-popup-close");

    var step = isIOS
      ? "לחצו על כפתור השיתוף ⬆ בתחתית הדפדפן ואז \"הוסף למסך הבית\" ו\"התקן\""
      : "לחצו על שלוש הנקודות ⋮ למעלה ואז \"הוסף למסך הבית\" ו\"התקן\"";
    textEl.innerHTML = "מומלץ להוריד את האפליקציה למכשיר :)<br><br>" + step;
    showUtilityIcon(btn);

    btn.addEventListener("click", function() {
      popup.classList.remove("hidden");
      backdrop.classList.remove("hidden");
    });

    function closePopup() {
      popup.classList.add("hidden");
      backdrop.classList.add("hidden");
    }

    closeBtn.addEventListener("click", closePopup);
    backdrop.addEventListener("click", closePopup);
  })();

  // Check for pending celebration
  if (state.celebrationPending) {
    // Show full card behind celebration overlay
    for (var i = 0; i < slotGroups.length; i++) {
      slotGroups[i].classList.add("punched");
    }
    progressCountEl.textContent = TOTAL_PUNCHES;
    lockUI();
    showCelebration();
  }
})();
