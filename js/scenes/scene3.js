/* ===================================================
   SCENE3.JS  –  Pick a Date (3D flip calendar)
   Writes: AppState.selectedDate = { day, month, year, display }
   =================================================== */

var _cal = { year: new Date().getFullYear(), month: new Date().getMonth() };

var MONTHS_EN = ['January','February','March','April','May','June',
                 'July','August','September','October','November','December'];
var DAYS_EN   = ['Su','Mo','Tu','We','Th','Fr','Sa'];

function initScene3() {
  _cal.year  = new Date().getFullYear();
  _cal.month = new Date().getMonth();

  var arrow = document.getElementById('s3-next-arrow');
  if (arrow) { arrow.style.display = 'none'; arrow.style.opacity = '0'; }

  renderCalendar();

  var prevBtn = document.getElementById('s3-prev');
  var nextBtn = document.getElementById('s3-next');
  if (prevBtn) prevBtn.onclick = function() { changeMonth(-1); };
  if (nextBtn) nextBtn.onclick = function() { changeMonth(1); };

  if (arrow) {
    arrow.onclick = function() { navigateTo(4); };
  }
}

function changeMonth(delta) {
  var grid = document.getElementById('s3-grid');
  if (!grid) return;
  grid.classList.add('flip-out');
  setTimeout(function() {
    _cal.month += delta;
    if (_cal.month < 0)  { _cal.month = 11; _cal.year--; }
    if (_cal.month > 11) { _cal.month = 0;  _cal.year++; }
    renderCalendar();
    grid.classList.remove('flip-out');
    void grid.offsetWidth;
    grid.classList.add('flip-in');
    setTimeout(function() { grid.classList.remove('flip-in'); }, 270);
  }, 270);
}

function renderCalendar() {
  var titleEl     = document.getElementById('s3-month-title');
  var grid        = document.getElementById('s3-grid');
  if (!grid) return;

  if (titleEl) titleEl.textContent = MONTHS_EN[_cal.month] + ' ' + _cal.year;

  var firstDay    = new Date(_cal.year, _cal.month, 1).getDay();
  var daysInMonth = new Date(_cal.year, _cal.month + 1, 0).getDate();
  var today       = new Date();
  var todayStamp  = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

  var html = '<div class="grid grid-cols-7 gap-0.5 mb-1">';
  DAYS_EN.forEach(function(d) {
    html += '<div class="text-center text-xs font-semibold py-1" style="color:#fb7185">' + d + '</div>';
  });
  html += '</div><div class="grid grid-cols-7 gap-1">';

  for (var i = 0; i < firstDay; i++) html += '<div></div>';

  for (var d = 1; d <= daysInMonth; d++) {
    var stamp   = new Date(_cal.year, _cal.month, d).getTime();
    var isPast  = stamp < todayStamp;
    var isToday = stamp === todayStamp;
    var style   = '';
    var cls     = 'relative flex items-center justify-center w-8 h-8 mx-auto rounded-full text-sm select-none transition-all ';

    if (isPast) {
      cls   += 'cursor-not-allowed ';
      style  = 'color:#d1d5db';
    } else if (isToday) {
      cls   += 'cursor-pointer font-bold ';
      style  = 'color:#e11d48; outline: 2px solid #fb7185; outline-offset: 2px;';
    } else {
      cls   += 'cursor-pointer font-medium hover:bg-rose-100 ';
      style  = 'color:#374151';
    }

    html += '<div class="' + cls + '" style="' + style + '" data-day="' + d + '" data-past="' + isPast + '">' + d + '</div>';
  }
  html += '</div>';
  grid.innerHTML = html;

  grid.querySelectorAll('[data-day]').forEach(function(cell) {
    if (cell.dataset.past === 'true') return;
    cell.addEventListener('click', function() { selectDay(cell, parseInt(cell.dataset.day)); });
  });
}

function selectDay(cell, day) {
  var m = String(_cal.month + 1).padStart(2, '0');
  AppState.selectedDate = {
    day: day, month: _cal.month + 1, year: _cal.year,
    display: day + '/' + m + '/' + _cal.year
  };

  document.querySelectorAll('.ink-circle-svg').forEach(function(el) { el.remove(); });

  var svgNS = 'http://www.w3.org/2000/svg';
  var svg   = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('class', 'ink-circle-svg');
  svg.setAttribute('viewBox', '0 0 42 42');
  var path = document.createElementNS(svgNS, 'path');
  path.setAttribute('d', 'M21 3 C35 3 39 11 39 21 C39 32 32 39 21 39 C10 39 3 32 3 21 C3 10 10 3 21 2 Z');
  path.setAttribute('class', 'ink-path');
  svg.appendChild(path);
  cell.style.position = 'relative';
  cell.appendChild(svg);

  var existing = document.querySelector('.float-text');
  if (existing) existing.remove();
  var rect = cell.getBoundingClientRect();
  var ft   = document.createElement('div');
  ft.className   = 'float-text';
  ft.textContent = 'Good choice, honey! 💖';
  ft.style.cssText = 'position:fixed;left:' + (rect.left + rect.width/2) + 'px;top:' + (rect.top - 10) + 'px;z-index:200;pointer-events:none';
  document.body.appendChild(ft);
  setTimeout(function() { ft.remove(); }, 2100);

  setTimeout(function() {
    var arrow = document.getElementById('s3-next-arrow');
    if (arrow) {
      arrow.style.display = 'flex';
      void arrow.offsetWidth;
      arrow.style.transition = 'opacity 0.5s';
      arrow.style.opacity    = '1';
    }
  }, 1300);
}
