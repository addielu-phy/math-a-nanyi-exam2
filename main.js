(function () {
  var OPTS = {
    delimiters: [
      { left: '$$', right: '$$', display: true },
      { left: '$', right: '$', display: false }
    ],
    throwOnError: false
  };
  function render(el) {
    if (window.renderMathInElement) window.renderMathInElement(el, OPTS);
  }
  function setOpen(btn, open) {
    var panel = document.getElementById(btn.getAttribute('aria-controls'));
    if (!panel) return;
    panel.hidden = !open;
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.textContent = open ? '隱藏答案與詳解' : '顯示答案與詳解';
    if (open && !panel.dataset.rendered) {
      render(panel);
      panel.dataset.rendered = '1';
    }
  }
  // 行間公式太寬時等比例縮小，避免在手機上被截斷（最小 62%）
  function contentWidth(k) {
    var bases = k.querySelectorAll('.katex-html > .base, .katex-html > .tag');
    var l = Infinity, r = -Infinity;
    bases.forEach(function (b) {
      var rc = b.getBoundingClientRect();
      if (rc.left < l) l = rc.left;
      if (rc.right > r) r = rc.right;
    });
    return r > l ? r - l : 0;
  }
  function fitDisplays() {
    document.querySelectorAll('.display-math').forEach(function (box) {
      var k = box.querySelector('.katex-display > .katex');
      if (!k) return;
      box.style.fontSize = '';
      var size = 1;
      for (var i = 0; i < 5; i++) {
        var avail = box.clientWidth, need = contentWidth(k);
        if (need <= avail - 2 || avail <= 0 || size <= 0.62) break;
        size = Math.max(0.62, size * (avail - 6) / need);
        box.style.fontSize = size + 'em';
      }
    });
  }
  function init() {
    // 只渲染可見內容；隱藏的詳解在展開時才渲染
    document.querySelectorAll('.hero, .point-body, .q-stem').forEach(render);
    fitDisplays();
    var t;
    window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(fitDisplays, 150); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitDisplays);
    var buttons = document.querySelectorAll('.toggle');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        setOpen(btn, btn.getAttribute('aria-expanded') !== 'true');
      });
    });
    var all = document.getElementById('collapse-all');
    if (all) all.addEventListener('click', function () {
      buttons.forEach(function (btn) { setOpen(btn, false); });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
