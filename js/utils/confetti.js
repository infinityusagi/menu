/* ===================================================
   CONFETTI.JS  –  Canvas confetti particle burst
   Called by scene4.js: Confetti.burst(x, y, count)
   =================================================== */

var Confetti = (function() {
  var canvas, ctx, particles = [], raf = null;
  var COLORS = ['#f43f5e','#fb7185','#facc15','#a855f7','#22c55e','#38bdf8','#fde047'];

  function init() {
    if (canvas) return;
    canvas = document.createElement('canvas');
    canvas.id = 'confetti-canvas';
    canvas.style.cssText =
      'position:fixed;inset:0;z-index:999;pointer-events:none;width:100%;height:100%';
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
  }

  function resize() {
    if (!canvas) return;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function burst(x, y, count) {
    init();
    count = count || 40;
    for (var i = 0; i < count; i++) {
      particles.push({
        x: x, y: y,
        vx: (Math.random() - 0.5) * 10,
        vy: -(Math.random() * 9 + 2),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: 1,
        w: Math.random() * 7 + 3,
        h: Math.random() * 4 + 2,
        rot: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 8
      });
    }
    if (!raf) loop();
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter(function(p) { return p.life > 0; });
    particles.forEach(function(p) {
      p.x  += p.vx;
      p.y  += p.vy;
      p.vy += 0.28;
      p.vx *= 0.98;
      p.life -= 0.018;
      p.rot  += p.rSpeed;

      ctx.save();
      ctx.globalAlpha = Math.max(p.life, 0);
      ctx.fillStyle   = p.color;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });

    if (particles.length > 0) {
      raf = requestAnimationFrame(loop);
    } else {
      raf = null;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  return { burst: burst };
})();
