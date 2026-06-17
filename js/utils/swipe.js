/* ===================================================
   SWIPE.JS  –  Drag/touch swipe engine for card stacks
   Used by scene4.js, scene5.js, scene6.js
   =================================================== */

function SwipeEngine(cardEl, opts) {
  opts = opts || {};
  this.el        = cardEl;
  this.threshold = opts.threshold || 90;
  this.onRight   = opts.onRight   || function() {};
  this.onLeft    = opts.onLeft    || function() {};
  this.onUp      = opts.onUp      || function() {};

  this._startX   = 0;
  this._startY   = 0;
  this._curX     = 0;
  this._curY     = 0;
  this._dragging = false;

  this._onStart = this._onStart.bind(this);
  this._onMove  = this._onMove.bind(this);
  this._onEnd   = this._onEnd.bind(this);

  cardEl.addEventListener('mousedown',  this._onStart);
  cardEl.addEventListener('touchstart', this._onStart, { passive: true });
  document.addEventListener('mousemove',  this._onMove);
  document.addEventListener('touchmove',  this._onMove, { passive: true });
  document.addEventListener('mouseup',    this._onEnd);
  document.addEventListener('touchend',   this._onEnd);
}

SwipeEngine.prototype._onStart = function(e) {
  if (e.type === 'mousedown') e.preventDefault(); // stop browser native image drag
  this._dragging = true;
  var pt = e.touches ? e.touches[0] : e;
  this._startX = pt.clientX;
  this._startY = pt.clientY;
  this._curX   = 0;
  this._curY   = 0;
  this.el.style.transition = 'none';
};

SwipeEngine.prototype._onMove = function(e) {
  if (!this._dragging) return;
  var pt = e.touches ? e.touches[0] : e;
  this._curX = pt.clientX - this._startX;
  this._curY = pt.clientY - this._startY;
  var rot = this._curX * 0.07;

  this.el.style.transform =
    'translateX(' + this._curX + 'px) ' +
    'translateY(' + (this._curY * 0.25) + 'px) ' +
    'rotate(' + rot + 'deg)';

  var likeEl = this.el.querySelector('.overlay-like');
  var nopeEl = this.el.querySelector('.overlay-nope');
  var ratio  = Math.abs(this._curX) / this.threshold;

  if (likeEl) likeEl.style.opacity = this._curX > 20  ? Math.min(ratio, 1) : 0;
  if (nopeEl) nopeEl.style.opacity = this._curX < -20 ? Math.min(ratio, 1) : 0;
};

SwipeEngine.prototype._onEnd = function() {
  if (!this._dragging) return;
  this._dragging = false;

  if      (this._curX >  this.threshold) this._flyOut('right');
  else if (this._curX < -this.threshold) this._flyOut('left');
  else                                   this._snapBack();
};

SwipeEngine.prototype._flyOut = function(dir) {
  var self = this;
  this.el.style.transition = 'none';

  if (dir === 'right') this.el.classList.add('fly-right');
  else                 this.el.classList.add('fly-left');

  var likeEl = this.el.querySelector('.overlay-like');
  var nopeEl = this.el.querySelector('.overlay-nope');
  if (likeEl) likeEl.style.opacity = 0;
  if (nopeEl) nopeEl.style.opacity = 0;

  setTimeout(function() {
    if (dir === 'right') self.onRight();
    else                 self.onLeft();
  }, 400);
};

SwipeEngine.prototype.flyUpProgrammatic = function() {
  var self = this;
  this.el.classList.add('fly-up');
  var superEl = this.el.querySelector('.overlay-super');
  if (superEl) superEl.style.opacity = 1;
  setTimeout(function() { self.onUp(); }, 400);
};

SwipeEngine.prototype._snapBack = function() {
  var self = this;
  this.el.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)';
  this.el.style.transform  = 'translateX(0) translateY(0) rotate(0deg)';
  this._curX = 0; this._curY = 0;
  var likeEl = this.el.querySelector('.overlay-like');
  var nopeEl = this.el.querySelector('.overlay-nope');
  if (likeEl) likeEl.style.opacity = 0;
  if (nopeEl) nopeEl.style.opacity = 0;
  setTimeout(function() { self.el.style.transition = 'none'; }, 400);
};

SwipeEngine.prototype.destroy = function() {
  this.el.removeEventListener('mousedown',  this._onStart);
  this.el.removeEventListener('touchstart', this._onStart);
  document.removeEventListener('mousemove', this._onMove);
  document.removeEventListener('touchmove', this._onMove);
  document.removeEventListener('mouseup',   this._onEnd);
  document.removeEventListener('touchend',  this._onEnd);
};
