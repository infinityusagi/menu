/* ===================================================
   SCENE1.JS  –  The Match (Bumble-style intro)
   =================================================== */

function initScene1() {
  var icon = document.getElementById('s1-icon');
  if (!icon) return;
  icon.onclick     = function() { navigateTo(2); };
  icon.ontouchend  = function(e) { e.preventDefault(); navigateTo(2); };
}
