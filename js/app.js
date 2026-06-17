/* ===================================================
   APP.JS  –  Global state + scene router
   =================================================== */

// ---------- GLOBAL STATE ----------
var AppState = {
  selectedDate:  null,   // { day, month, year, display }
  appetizers:    [],     // max 2  [{ id, name, superLiked }]
  movie:         null,   // { id, title, genre, date }
  cafe:          null,   // { id, name, address, vibe }
  currentScene:  1
};

// ---------- SCENE ROUTER ----------
function navigateTo(n) {
  var current = document.querySelector('.scene.active');
  var next    = document.getElementById('scene-' + n);
  if (!next || AppState.currentScene === n) return;

  if (current) {
    current.classList.add('leaving');
    setTimeout(function() {
      current.classList.remove('active', 'leaving');
    }, 380);
  }

  setTimeout(function() {
    next.classList.add('active');
    AppState.currentScene = n;
    updateProgressDots(n);
    var initFn = window['initScene' + n];
    if (typeof initFn === 'function') initFn();
  }, current ? 180 : 0);
}

// ---------- PROGRESS DOTS ----------
function updateProgressDots(n) {
  var dots = document.querySelectorAll('.progress-dot');
  dots.forEach(function(dot, i) {
    dot.classList.toggle('active', i + 1 === n);
  });
}

// ---------- BOOT ----------
document.addEventListener('DOMContentLoaded', function() {
  var s1 = document.getElementById('scene-1');
  if (s1) {
    s1.classList.add('active');
    updateProgressDots(1);
    if (typeof initScene1 === 'function') initScene1();
  }
});
