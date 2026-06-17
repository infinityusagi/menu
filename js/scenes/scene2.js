/* ===================================================
   SCENE2.JS  –  The Invitation (envelope + letter)
   =================================================== */

function initScene2() {
  var envelopeWrap = document.getElementById('s2-env-wrap');
  var letter       = document.getElementById('s2-letter');
  var flap         = document.getElementById('s2-flap');
  var btns         = document.getElementById('s2-btns');
  var acceptBtn    = document.getElementById('s2-accept');
  var refuseBtn    = document.getElementById('s2-refuse');
  var opened       = false;
  var moveCount    = 0;

  if (!envelopeWrap) return;

  // Reset state each time scene is entered
  opened    = false;
  moveCount = 0;
  if (flap)       { flap.classList.remove('flap-open'); }
  if (letter)     { letter.style.display = 'none'; letter.classList.remove('letter-rise'); }
  if (btns)       { btns.style.display = 'none'; btns.style.opacity = '0'; }
  if (refuseBtn)  {
    refuseBtn.style.display  = '';
    refuseBtn.style.opacity  = '1';
    refuseBtn.style.position = '';
    refuseBtn.style.left     = '';
    refuseBtn.style.top      = '';
    refuseBtn.style.pointerEvents = '';
  }

  // --- Open envelope ---
  envelopeWrap.onclick = function() {
    if (opened) return;
    opened = true;

    if (flap) {
      void flap.offsetWidth;
      flap.classList.add('flap-open');
    }

    setTimeout(function() {
      if (letter) {
        letter.style.display = 'block';
        void letter.offsetWidth;
        letter.classList.add('letter-rise');
      }
      setTimeout(function() {
        // Collapse envelope to free vertical space for buttons
        if (envelopeWrap) {
          envelopeWrap.style.transition = 'height 0.4s ease, opacity 0.4s ease, margin 0.4s ease';
          envelopeWrap.style.height     = '0';
          envelopeWrap.style.opacity    = '0';
          envelopeWrap.style.margin     = '0';
          envelopeWrap.style.overflow   = 'hidden';
        }
        if (btns) {
          btns.style.display = 'flex';
          void btns.offsetWidth;
          btns.style.transition = 'opacity 0.5s';
          btns.style.opacity    = '1';
        }
      }, 200);
    }, 500);
  };

  // --- Accept ---
  if (acceptBtn) {
    acceptBtn.onclick = function() { navigateTo(3); };
  }

  // --- Refuse: runs away (max 150px from original position) ---
  var _originX = null, _originY = null;
  function moveRefuse() {
    moveCount++;
    if (moveCount >= 10) {
      refuseBtn.style.opacity       = '0';
      refuseBtn.style.pointerEvents = 'none';
      setTimeout(function() { refuseBtn.style.display = 'none'; }, 400);
      return;
    }

    // Capture original centre on first move
    if (_originX === null) {
      var r = refuseBtn.getBoundingClientRect();
      _originX = r.left + r.width  / 2;
      _originY = r.top  + r.height / 2;
    }

    var btnW = refuseBtn.offsetWidth  || 110;
    var btnH = refuseBtn.offsetHeight || 42;
    var MAX  = 150;

    // Random point inside a circle of radius MAX
    var angle = Math.random() * 2 * Math.PI;
    var dist  = Math.random() * MAX;
    var newCX = _originX + Math.cos(angle) * dist;
    var newCY = _originY + Math.sin(angle) * dist;

    // Clamp to viewport
    var newX = Math.max(8, Math.min(window.innerWidth  - btnW - 8, newCX - btnW / 2));
    var newY = Math.max(8, Math.min(window.innerHeight - btnH - 8, newCY - btnH / 2));

    refuseBtn.style.position = 'fixed';
    refuseBtn.style.right    = 'auto';
    refuseBtn.style.bottom   = 'auto';
    refuseBtn.style.left     = newX + 'px';
    refuseBtn.style.top      = newY + 'px';
  }

  if (refuseBtn) {
    refuseBtn.addEventListener('mouseenter', moveRefuse);
    refuseBtn.addEventListener('touchstart',  moveRefuse, { passive: true });
  }
}
