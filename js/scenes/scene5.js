/* ===================================================
   SCENE5.JS  –  Movie Swipe / Main Course (max 1 pick)
   Writes: AppState.movie = { id, title, genre, date, posterUrl }
   =================================================== */

var MOVIES = [
  { id:1, title:'Toy Story 5',                  genre:'Animation · Adventure · Family',  date:'19/06/2026', posterUrl:'https://cdn.moveek.com/storage/media/cache/tall/69141784c0170991162232.jpg' },
  { id:2, title:'Bạch Xà: Một Kiếp Nhân Gian', genre:'Animation · Mythology · Romance', date:'19/06/2026', posterUrl:'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/3/5/350x495-bachxa.jpg' },
  { id:3, title:'Minions & Quái Vật',           genre:'Animation · Comedy',              date:'01/07/2026', posterUrl:'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/m/n/mn3_henryposter_470x700.jpg' },
  { id:4, title:'Moana (Live Action)',           genre:'Family · Adventure · Action',     date:'10/07/2026', posterUrl:'https://cdn2.tuoitre.vn/thumb_w/480/471584752817336320/2026/3/24/edit-moana-17743207484761232356580.jpeg' },
  { id:5, title:'Evil Dead: Burn',              genre:'Horror',                          date:'10/07/2026', posterUrl:'https://upload.wikimedia.org/wikipedia/vi/thumb/0/08/EvilDeadBurnPoster.jpeg/250px-EvilDeadBurnPoster.jpeg' },
  { id:6, title:'The Odyssey',                  genre:'Action · Fantasy',                date:'17/07/2026', posterUrl:'https://upload.wikimedia.org/wikipedia/vi/8/84/TheOdyssey.jpg' }
];

var _s5 = { index: 0, engine: null };

function initScene5() {
  AppState.movie = null;
  _s5.index = 0;
  if (_s5.engine) { _s5.engine.destroy(); _s5.engine = null; }
  renderS5Stack();
}

function renderS5Stack() {
  var stack = document.getElementById('s5-stack');
  if (!stack) return;
  stack.innerHTML = '';
  var toRender = Math.min(3, MOVIES.length - _s5.index);
  for (var i = 0; i < toRender; i++) {
    var item = MOVIES[_s5.index + i];
    if (!item) continue;
    stack.appendChild(makeMovieCard(item));
  }
  bindS5TopCard();
}

function makeMovieCard(item) {
  var card = document.createElement('div');
  card.className  = 'swipe-card';
  card.dataset.id = item.id;
  card.innerHTML =
    '<div style="position:relative;width:100%;height:100%;background:#111;border-radius:inherit;overflow:hidden">' +
      '<img src="' + item.posterUrl + '" draggable="false" style="width:100%;height:100%;object-fit:cover;display:block" onerror="this.style.background=\'linear-gradient(145deg,#1e1b4b,#4c1d95)\'"/>' +
      '<div style="position:absolute;bottom:0;left:0;right:0;padding:32px 18px 14px;background:linear-gradient(to top,rgba(0,0,0,0.92) 0%,rgba(0,0,0,0) 100%)">' +
        '<div style="display:inline-block;background:rgba(255,255,255,0.18);color:#fef9c3;font-size:0.65rem;letter-spacing:1.5px;text-transform:uppercase;padding:2px 10px;border-radius:20px;font-family:sans-serif;margin-bottom:6px">' + item.genre + '</div>' +
        '<div style="font-size:1.1rem;font-weight:700;color:#fff;line-height:1.3;margin-bottom:4px">' + item.title + '</div>' +
        '<div style="font-size:0.82rem;color:rgba(255,255,255,0.7);font-family:sans-serif">🎬 CGV · ' + item.date + '</div>' +
      '</div>' +
      '<div class="overlay-like"><span class="overlay-label">WATCH 🎬</span></div>' +
      '<div class="overlay-nope"><span class="overlay-label">PASS ✕</span></div>' +
      '<div class="overlay-super"><span class="overlay-label">MUST WATCH ⭐</span></div>' +
    '</div>';
  return card;
}

function bindS5TopCard() {
  var stack = document.getElementById('s5-stack');
  if (!stack) return;
  var topCard = stack.querySelector('.swipe-card');
  if (!topCard) return;
  topCard.style.zIndex = '10';

  if (_s5.engine) _s5.engine.destroy();
  _s5.engine = new SwipeEngine(topCard, {
    onRight: function() { s5Pick(topCard, false); },
    onLeft:  function() { s5Dismiss(topCard); },
    onUp:    function() { s5Pick(topCard, true); }
  });

  var superBtn = document.getElementById('s5-super');
  var likeBtn  = document.getElementById('s5-like');
  var nopeBtn  = document.getElementById('s5-nope');
  if (superBtn) superBtn.onclick = function() { if (_s5.engine) _s5.engine.flyUpProgrammatic(); };
  if (likeBtn)  likeBtn.onclick  = function() { if (_s5.engine) _s5.engine._flyOut('right'); };
  if (nopeBtn)  nopeBtn.onclick  = function() { if (_s5.engine) _s5.engine._flyOut('left'); };
}

function s5Pick(card, superLike) {
  var id   = parseInt(card.dataset.id);
  var item = MOVIES.filter(function(m) { return m.id === id; })[0];
  if (!item) { nextS5Card(); return; }

  AppState.movie = { id: item.id, title: item.title, genre: item.genre, date: item.date, posterUrl: item.posterUrl };

  if (superLike) {
    var stamp = document.createElement('div');
    stamp.className = 'stamp-overlay';
    stamp.innerHTML = '<div class="stamp-inner">MUST WATCH ⭐</div>';
    card.appendChild(stamp);
    setTimeout(function() {
      card.style.transition = 'transform 0.75s ease, opacity 0.75s ease';
      card.style.transform  = 'translateX(130vw) rotate(18deg)';
      card.style.opacity    = '0';
      setTimeout(function() { navigateTo(6); }, 800);
    }, 600);
  } else {
    var rect = card.getBoundingClientRect();
    Confetti.burst(rect.left + rect.width / 2, rect.top + rect.height / 3, 35);
    setTimeout(function() { navigateTo(6); }, 600);
  }
}

function s5Dismiss(card) {
  var nopeEl = card.querySelector('.overlay-nope');
  card.classList.add('card-shake');
  if (nopeEl) nopeEl.style.opacity = '0.9';
  setTimeout(function() {
    card.classList.remove('card-shake');
    if (nopeEl) nopeEl.style.opacity = '0';
    nextS5Card();
  }, 480);
}

function nextS5Card() {
  _s5.index++;
  if (_s5.index >= MOVIES.length) _s5.index = 0;
  renderS5Stack();
}
