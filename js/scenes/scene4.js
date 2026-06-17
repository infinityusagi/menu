/* ===================================================
   SCENE4.JS  –  Appetizer Swipe (max 2 picks)
   Writes: AppState.appetizers = [{ id, name, img, superLiked }]
   =================================================== */

var APPETIZERS = [
  { id:1, name:'Fried Chicken',  desc:'Crispy & golden',        img:'Image%20Asset/Foods/Fried%20Chicken.png' },
  { id:2, name:'Hotpot',         desc:'Warm & comforting',      img:'Image%20Asset/Foods/Hotpot.png' },
  { id:3, name:'Korean BBQ',     desc:'Sizzling & smoky',       img:'Image%20Asset/Foods/Korean%20BBQ.png' },
  { id:4, name:'Japanese BBQ',   desc:'Refined & delicious',    img:'Image%20Asset/Foods/Japanese%20BBQ.png' },
  { id:5, name:'Noodles',        desc:'Slurp-worthy goodness',  img:'Image%20Asset/Foods/Noodles.png' },
  { id:6, name:'Pizza',          desc:'Cheesy & satisfying',    img:'Image%20Asset/Foods/Pizza.png' },
  { id:7, name:'Vegan Food',     desc:'Fresh & wholesome',      img:'Image%20Asset/Foods/Vegan%20Food.png' },
  { id:8, name:'Chicken Feet',   desc:'Bold & adventurous',     img:'Image%20Asset/Foods/Chicken%20Feet.png' },
  { id:9, name:'Surprise 😜', desc:'Ehehe...',        img:'Image%20Asset/Foods/Ehehe.png' }
];

var _s4 = { index: 0, picked: 0, engine: null };

function initScene4() {
  AppState.appetizers = [];
  _s4.index  = 0;
  _s4.picked = 0;
  if (_s4.engine) { _s4.engine.destroy(); _s4.engine = null; }
  updateS4Counter();
  renderS4Stack();
}

function updateS4Counter() {
  var el = document.getElementById('s4-counter');
  if (el) el.textContent = 'Selected: ' + _s4.picked + ' / 2';
}

function renderS4Stack() {
  var stack = document.getElementById('s4-stack');
  if (!stack) return;
  stack.innerHTML = '';

  var toRender = Math.min(3, APPETIZERS.length - _s4.index);
  for (var i = 0; i < toRender; i++) {
    var item = APPETIZERS[_s4.index + i];
    if (!item) continue;
    stack.appendChild(makeAppCard(item));
  }
  bindS4TopCard();
}

function makeAppCard(item) {
  var card       = document.createElement('div');
  card.className = 'swipe-card';
  card.dataset.id = item.id;
  card.innerHTML =
    '<div style="width:100%;height:100%;display:flex;flex-direction:column;background:#fff;border-radius:inherit;overflow:hidden">' +
      '<img src="' + item.img + '" style="width:100%;height:65%;object-fit:cover;flex-shrink:0" onerror="this.style.background=\'linear-gradient(145deg,#fce7f3,#fbcfe8)\';this.style.minHeight=\'65%\'"/>' +
      '<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:12px 16px;gap:6px;background:#fff">' +
        '<div style="font-size:1.25rem;font-weight:700;color:#1f0a16;text-align:center">' + item.name + '</div>' +
        '<div style="font-size:0.82rem;color:#6b2a3a;text-align:center;font-style:italic">' + item.desc + '</div>' +
      '</div>' +
      '<div class="overlay-like"><span class="overlay-label">LIKE 💚</span></div>' +
      '<div class="overlay-nope"><span class="overlay-label">PASS ✕</span></div>' +
      '<div class="overlay-super"><span class="overlay-label">SUPER LIKE ⭐</span></div>' +
      '<div style="display:flex;justify-content:space-around;align-items:center;padding:10px 18px;background:rgba(255,255,255,0.95);border-top:1px solid rgba(253,164,175,0.3)">' +
        '<div style="display:flex;flex-direction:column;align-items:center;gap:3px">' +
          '<div style="font-size:1.3rem">👈</div>' +
          '<span style="font-size:0.6rem;font-weight:700;color:#ef4444;font-family:sans-serif;letter-spacing:1px">PASS</span>' +
        '</div>' +
        '<div style="display:flex;flex-direction:column;align-items:center;gap:3px">' +
          '<div style="font-size:1.3rem">👉</div>' +
          '<span style="font-size:0.6rem;font-weight:700;color:#22c55e;font-family:sans-serif;letter-spacing:1px">LIKE</span>' +
        '</div>' +
      '</div>' +
    '</div>';
  return card;
}

function bindS4TopCard() {
  var stack = document.getElementById('s4-stack');
  if (!stack) return;
  var topCard = stack.querySelector('.swipe-card');
  if (!topCard) return;
  topCard.style.zIndex = '10';

  if (_s4.engine) _s4.engine.destroy();
  _s4.engine = new SwipeEngine(topCard, {
    onRight: function() { s4Pick(topCard, false); },
    onLeft:  function() { s4Dismiss(topCard); },
    onUp:    function() { s4Pick(topCard, true); }
  });

  var superBtn = document.getElementById('s4-super');
  var likeBtn  = document.getElementById('s4-like');
  var nopeBtn  = document.getElementById('s4-nope');

  if (superBtn) superBtn.onclick = function() { if (_s4.engine) _s4.engine.flyUpProgrammatic(); };
  if (likeBtn)  likeBtn.onclick  = function() { if (_s4.engine) { _s4.engine._flyOut('right'); } };
  if (nopeBtn)  nopeBtn.onclick  = function() { if (_s4.engine) { _s4.engine._flyOut('left');  } };
}

function s4Pick(card, superLike) {
  var id   = parseInt(card.dataset.id);
  var item = APPETIZERS.filter(function(a) { return a.id === id; })[0];
  if (!item) { nextS4Card(); return; }

  AppState.appetizers.push({ id: item.id, name: item.name, img: item.img, superLiked: superLike });
  _s4.picked++;
  updateS4Counter();

  if (superLike) {
    // 1. Stamp drops onto card
    var stamp = document.createElement('div');
    stamp.className = 'stamp-overlay';
    stamp.innerHTML = '<div class="stamp-inner">SUPER LIKE ⭐</div>';
    card.appendChild(stamp);
    // 2. After stamp lands (~550ms), fly card out slowly with stamp imprint visible
    setTimeout(function() {
      card.style.transition = 'transform 0.75s ease, opacity 0.75s ease';
      card.style.transform  = 'translateX(130vw) rotate(18deg)';
      card.style.opacity    = '0';
      setTimeout(nextS4Card, 800);
    }, 600);
  } else {
    var rect = card.getBoundingClientRect();
    Confetti.burst(rect.left + rect.width / 2, rect.top + rect.height / 3, 45);
    setTimeout(nextS4Card, 450);
  }
}

function s4Dismiss(card) {
  var nopeEl = card.querySelector('.overlay-nope');
  card.classList.add('card-shake');
  if (nopeEl) nopeEl.style.opacity = '0.9';
  setTimeout(function() {
    card.classList.remove('card-shake');
    if (nopeEl) nopeEl.style.opacity = '0';
    nextS4Card();
  }, 480);
}

function nextS4Card() {
  _s4.index++;
  if (_s4.picked >= 2) {
    setTimeout(function() { navigateTo(5); }, 650);
    return;
  }
  if (_s4.index >= APPETIZERS.length) _s4.index = 0;
  renderS4Stack();
}
