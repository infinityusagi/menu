/* ===================================================
   SCENE6.JS  –  Dessert Activity Swipe (max 1 pick)
   Writes: AppState.cafe = { id, name, img }
   =================================================== */

var ACTIVITIES = [
  { id:1, name:'Coffee Time',   desc:'Chill at a cozy café',   img:'Image%20Asset/Dessert/Coffee.png' },
  { id:2, name:'Drinks',        desc:'Cocktails & good vibes', img:'Image%20Asset/Dessert/Drinks.png' },
  { id:3, name:'Boardgame',     desc:'Fun & competitive',      img:'Image%20Asset/Dessert/Boardgame.png' },
  { id:4, name:'Karaoke',       desc:'Sing your heart out',    img:'Image%20Asset/Dessert/Karaoke.png' },
  { id:5, name:'Tarot Reading', desc:'Mystical & romantic',    img:'Image%20Asset/Dessert/Tarot.png' }
];

var _s6 = { index: 0, engine: null };

function initScene6() {
  AppState.cafe = null;
  _s6.index = 0;
  if (_s6.engine) { _s6.engine.destroy(); _s6.engine = null; }
  renderS6Stack();
}

function renderS6Stack() {
  var stack = document.getElementById('s6-stack');
  if (!stack) return;
  stack.innerHTML = '';
  var toRender = Math.min(3, ACTIVITIES.length - _s6.index);
  for (var i = 0; i < toRender; i++) {
    var item = ACTIVITIES[_s6.index + i];
    if (!item) continue;
    stack.appendChild(makeActivityCard(item));
  }
  bindS6TopCard();
}

function makeActivityCard(item) {
  var card = document.createElement('div');
  card.className  = 'swipe-card';
  card.dataset.id = item.id;
  card.innerHTML =
    '<div style="width:100%;height:100%;display:flex;flex-direction:column;background:#fff;border-radius:inherit;overflow:hidden">' +
      '<img src="' + item.img + '" draggable="false" style="width:100%;height:70%;object-fit:cover;flex-shrink:0" onerror="this.style.background=\'linear-gradient(145deg,#0f172a,#334155)\';this.style.minHeight=\'70%\'"/>' +
      '<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:12px 16px;gap:6px;background:#fff">' +
        '<div style="font-size:1.3rem;font-weight:700;color:#1f0a16;text-align:center">' + item.name + '</div>' +
        '<div style="font-size:0.88rem;color:#6b2a3a;text-align:center;font-style:italic">' + item.desc + '</div>' +
      '</div>' +
      '<div class="overlay-like"><span class="overlay-label">LET\'S GO 💕</span></div>' +
      '<div class="overlay-nope"><span class="overlay-label">PASS ✕</span></div>' +
      '<div class="overlay-super"><span class="overlay-label">YES PLEASE ⭐</span></div>' +
      '<div style="padding:10px;background:rgba(255,255,255,0.85);text-align:center;font-size:0.72rem;color:#9f1239;font-family:sans-serif">' +
        "← Pass · Let's Go → · ↑ Yes Please" +
      '</div>' +
    '</div>';
  return card;
}

function bindS6TopCard() {
  var stack = document.getElementById('s6-stack');
  if (!stack) return;
  var topCard = stack.querySelector('.swipe-card');
  if (!topCard) return;
  topCard.style.zIndex = '10';

  if (_s6.engine) _s6.engine.destroy();
  _s6.engine = new SwipeEngine(topCard, {
    onRight: function() { s6Pick(topCard, false); },
    onLeft:  function() { s6Dismiss(topCard); },
    onUp:    function() { s6Pick(topCard, true); }
  });

  var superBtn = document.getElementById('s6-super');
  var likeBtn  = document.getElementById('s6-like');
  var nopeBtn  = document.getElementById('s6-nope');
  if (superBtn) superBtn.onclick = function() { if (_s6.engine) _s6.engine.flyUpProgrammatic(); };
  if (likeBtn)  likeBtn.onclick  = function() { if (_s6.engine) _s6.engine._flyOut('right'); };
  if (nopeBtn)  nopeBtn.onclick  = function() { if (_s6.engine) _s6.engine._flyOut('left'); };
}

function s6Pick(card, superLike) {
  var id   = parseInt(card.dataset.id);
  var item = ACTIVITIES.filter(function(a) { return a.id === id; })[0];
  if (!item) { nextS6Card(); return; }

  AppState.cafe = { id: item.id, name: item.name, img: item.img };

  if (superLike) {
    var stamp = document.createElement('div');
    stamp.className = 'stamp-overlay';
    stamp.innerHTML = '<div class="stamp-inner">YES PLEASE ⭐</div>';
    card.appendChild(stamp);
    setTimeout(function() {
      card.style.transition = 'transform 0.75s ease, opacity 0.75s ease';
      card.style.transform  = 'translateX(130vw) rotate(18deg)';
      card.style.opacity    = '0';
      setTimeout(function() { navigateTo(7); }, 800);
    }, 600);
  } else {
    var rect = card.getBoundingClientRect();
    Confetti.burst(rect.left + rect.width / 2, rect.top + rect.height / 3, 35);
    setTimeout(function() { navigateTo(7); }, 600);
  }
}

function s6Dismiss(card) {
  var nopeEl = card.querySelector('.overlay-nope');
  card.classList.add('card-shake');
  if (nopeEl) nopeEl.style.opacity = '0.9';
  setTimeout(function() {
    card.classList.remove('card-shake');
    if (nopeEl) nopeEl.style.opacity = '0';
    nextS6Card();
  }, 480);
}

function nextS6Card() {
  _s6.index++;
  if (_s6.index >= ACTIVITIES.length) _s6.index = 0;
  renderS6Stack();
}
