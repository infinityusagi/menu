/* ===================================================
   SCENE7.JS  –  The Set Menu (summary + save to Google Sheets)
   Reads:  AppState.{ selectedDate, appetizers[], movie, cafe }
   POSTs:  { timestamp, date, appetizer1, appetizer2, movie, activity }
           → Google Apps Script Web App URL (fire-and-forget)
   =================================================== */

// ── PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE ──────────────────────
var SHEETS_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL';
// ─────────────────────────────────────────────────────────────────────────

function initScene7() {
  saveToSheets();
  renderSetMenu();
}

function saveToSheets() {
  if (!SHEETS_URL || SHEETS_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL') return;

  var params = new URLSearchParams({
    timestamp:  new Date().toLocaleString('en-US'),
    date:       AppState.selectedDate ? AppState.selectedDate.display : '(not selected)',
    appetizer1: AppState.appetizers[0]
      ? AppState.appetizers[0].name + (AppState.appetizers[0].superLiked ? ' ⭐' : '') : '',
    appetizer2: AppState.appetizers[1]
      ? AppState.appetizers[1].name + (AppState.appetizers[1].superLiked ? ' ⭐' : '') : '',
    movie:    AppState.movie ? AppState.movie.title : '(not selected)',
    activity: AppState.cafe  ? AppState.cafe.name  : '(not selected)'
  });

  // GET request avoids all CORS/redirect issues with Google Apps Script
  fetch(SHEETS_URL + '?' + params.toString(), {
    method: 'GET',
    mode:   'no-cors'
  }).catch(function(err) {
    console.warn('[scene7] Sheets save failed (non-critical):', err);
  });
}

function renderSetMenu() {
  var container = document.getElementById('s7-menu');
  if (!container) return;

  var date = AppState.selectedDate
    ? AppState.selectedDate.display
    : '<span style="opacity:0.5">—</span>';

  var apps = '';
  if (AppState.appetizers.length === 0) {
    apps = '<span style="opacity:0.5">—</span>';
  } else {
    AppState.appetizers.forEach(function(a) {
      apps += '<div>' + a.name
        + (a.superLiked ? ' <span style="color:#fde047;font-size:0.8em"> ⭐ Super Like</span>' : '')
        + '</div>';
    });
  }

  var movie = AppState.movie
    ? AppState.movie.title
    : '<span style="opacity:0.5">—</span>';

  var activity = AppState.cafe
    ? AppState.cafe.name
    : '<span style="opacity:0.5">—</span>';

  container.innerHTML = [
    '<div style="text-align:center;margin-bottom:10px">',
      '<svg width="130" height="22" viewBox="0 0 130 22" xmlns="http://www.w3.org/2000/svg">',
        '<line x1="0" y1="11" x2="48" y2="11" stroke="#facc15" stroke-width="0.8" stroke-opacity="0.5"/>',
        '<circle cx="65" cy="11" r="5" fill="none" stroke="#facc15" stroke-width="1" stroke-opacity="0.7"/>',
        '<circle cx="65" cy="11" r="2" fill="#facc15" fill-opacity="0.6"/>',
        '<circle cx="53" cy="11" r="2" fill="#facc15" fill-opacity="0.35"/>',
        '<circle cx="77" cy="11" r="2" fill="#facc15" fill-opacity="0.35"/>',
        '<line x1="82" y1="11" x2="130" y2="11" stroke="#facc15" stroke-width="0.8" stroke-opacity="0.5"/>',
      '</svg>',
    '</div>',

    '<div style="text-align:center;margin-bottom:18px">',
      '<div style="color:#fde047;font-size:0.58rem;letter-spacing:4px;text-transform:uppercase;font-family:sans-serif;opacity:0.7;margin-bottom:5px">Our Special</div>',
      '<div style="color:#fef9c3;font-size:1.55rem;font-family:Georgia,serif;font-weight:700;letter-spacing:1px">Set Menu</div>',
      '<div style="color:#fde047;font-size:0.58rem;letter-spacing:4px;text-transform:uppercase;font-family:sans-serif;opacity:0.7;margin-top:5px">For Two 💖</div>',
    '</div>',

    '<hr class="menu-divider"/>',

    '<div style="padding:6px 0 10px">',
      '<div class="menu-section-title">📅 Date</div>',
      '<div class="menu-section-value">' + date + '</div>',
    '</div>',

    '<hr class="menu-divider"/>',

    '<div style="padding:6px 0 10px">',
      '<div class="menu-section-title">🥗 Starter</div>',
      '<div class="menu-section-value">' + apps + '</div>',
    '</div>',

    '<hr class="menu-divider"/>',

    '<div style="padding:6px 0 10px">',
      '<div class="menu-section-title">🎬 Main Course – Movie</div>',
      '<div class="menu-section-value">' + movie + '</div>',
    '</div>',

    '<hr class="menu-divider"/>',

    '<div style="padding:6px 0 14px">',
      '<div class="menu-section-title">🌙 Dessert & Chill</div>',
      '<div class="menu-section-value">' + activity + '</div>',
    '</div>',

    '<hr class="menu-divider"/>',

    '<div style="text-align:center;padding-top:10px;color:#fde047;font-size:0.8rem;font-style:italic;opacity:0.8">',
      "✨ Can't wait to see you 💖 ✨",
    '</div>'
  ].join('');

  container.classList.add('menu-reveal');
}
