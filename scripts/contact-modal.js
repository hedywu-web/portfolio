/* ============================================================
   Contact Modal — Hedy's Portfolio
   Reusable popup that surfaces contact methods.
   Auto-wires every "Contact" nav link and "Get in touch" button.
   Drop  <script src="contact-modal.js"></script>  before </body>.
   ============================================================ */
(function () {
  'use strict';

  var EMAIL = 'heydesign01@gmail.com';
  var PHONE_DISPLAY = '0921 953 306';
  var PHONE_RAW = '0921953306';

  /* ---------- styles ---------- */
  var css = `
  .cm-overlay {
    position: fixed; inset: 0; z-index: 2000;
    display: flex; align-items: center; justify-content: center;
    padding: 24px;
    background: rgba(40, 40, 38, 0.42);
    -webkit-backdrop-filter: blur(7px); backdrop-filter: blur(7px);
    opacity: 0; visibility: hidden;
    transition: opacity .32s ease, visibility .32s ease;
  }
  .cm-overlay.open { opacity: 1; visibility: visible; }

  .cm-card {
    position: relative; overflow: hidden;
    width: 100%; max-width: 480px;
    background: #f6f5f0;
    border-radius: 34px;
    padding: 40px 38px 34px;
    box-shadow: 0 36px 90px rgba(40,40,38,.26);
    transform: translateY(26px) scale(.96);
    opacity: 0;
    transition: transform .42s cubic-bezier(.2,.85,.25,1), opacity .42s ease;
    font-family: 'Plus Jakarta Sans', 'Noto Sans TC', sans-serif;
    color: #363636;
  }
  .cm-overlay.open .cm-card { transform: none; opacity: 1; }

  .cm-blob {
    position: absolute; border-radius: 50%; pointer-events: none;
    filter: blur(10px); z-index: 0;
  }
  .cm-blob.green {
    width: 230px; height: 230px; top: -110px; right: -70px;
    background: radial-gradient(circle, rgba(168,213,140,.55) 0%, transparent 68%);
  }
  .cm-blob.peach {
    width: 210px; height: 210px; bottom: -120px; left: -80px;
    background: radial-gradient(circle, rgba(255,195,165,.5) 0%, transparent 68%);
  }

  .cm-card > :not(.cm-blob):not(.cm-close) { position: relative; z-index: 1; }

  .cm-close {
    position: absolute; top: 20px; right: 20px; z-index: 2;
    width: 40px; height: 40px; border: none; cursor: pointer;
    border-radius: 50%; background: rgba(54,54,54,.06);
    display: flex; align-items: center; justify-content: center;
    color: #363636; transition: background .2s, transform .2s;
  }
  .cm-close:hover { background: rgba(54,54,54,.12); transform: rotate(90deg); }
  .cm-close svg { width: 18px; height: 18px; }

  .cm-title {
    font-family: 'Clash Display', 'Plus Jakarta Sans', sans-serif;
    font-size: 30px; font-weight: 600; line-height: 1.05;
    letter-spacing: -.01em; margin-bottom: 22px;
  }
  .cm-sub {
    font-size: 15px; line-height: 1.5; color: rgba(54,54,54,.62);
    margin-bottom: 22px;
  }

  .cm-list { display: flex; flex-direction: column; gap: 14px; }

  .cm-item {
    display: flex; align-items: center; gap: 16px;
    background: #ffffff; border-radius: 20px;
    padding: 16px 18px;
    text-decoration: none; color: inherit;
    box-shadow: 0 2px 10px rgba(40,40,38,.04);
    transition: transform .22s ease, box-shadow .22s ease;
  }
  .cm-item:hover { transform: translateY(-2px); box-shadow: 0 10px 26px rgba(40,40,38,.1); }

  .cm-ic {
    flex-shrink: 0; width: 48px; height: 48px; border-radius: 15px;
    display: flex; align-items: center; justify-content: center;
  }
  .cm-ic.green { background: rgba(168,213,140,.4); }
  .cm-ic.peach { background: rgba(255,195,165,.42); }
  .cm-ic svg { width: 22px; height: 22px; }

  .cm-meta { flex: 1; min-width: 0; display: flex; align-items: baseline; gap: 8px; }
  .cm-label {
    flex-shrink: 0;
    font-size: 15px; font-weight: 400; letter-spacing: .08em;
    text-transform: uppercase; color: rgba(54,54,54,.45);
  }
  .cm-value {
    font-size: 15px; font-weight: 600; letter-spacing: -.01em;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  .cm-copy {
    flex-shrink: 0; border: none; cursor: pointer; background: transparent;
    width: 38px; height: 38px; border-radius: 11px; color: rgba(54,54,54,.5);
    display: flex; align-items: center; justify-content: center;
    transition: background .2s, color .2s;
  }
  .cm-copy:hover { background: rgba(54,54,54,.07); color: #363636; }
  .cm-copy svg { width: 18px; height: 18px; pointer-events: none; }
  .cm-copy.copied { color: #6fae4e; }

  .cm-toast {
    margin-top: 22px; text-align: center;
    font-size: 13px; font-weight: 600; color: #6fae4e;
    height: 16px; opacity: 0; transition: opacity .25s ease;
  }
  .cm-toast.show { opacity: 1; }

  @media (prefers-reduced-motion: reduce) {
    .cm-overlay, .cm-card, .cm-item, .cm-close { transition: none !important; }
  }
  @media (max-width: 480px) {
    .cm-card { padding: 40px 26px 30px; border-radius: 28px; }
    .cm-title { font-size: 28px; }
  }`;

  /* ---------- icons ---------- */
  var mailIcon = '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="3" stroke="#5a7a44" stroke-width="1.8"/><path d="m4 7 8 6 8-6" stroke="#5a7a44" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var phoneIcon = '<svg viewBox="0 0 24 24" fill="none"><path d="M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16 16 0 0 1 4.5 6.2 2 2 0 0 1 6.5 4Z" stroke="#b9682f" stroke-width="1.8" stroke-linejoin="round"/></svg>';
  var copyIcon = '<svg viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="11" height="11" rx="2.5" stroke="currentColor" stroke-width="1.8"/><path d="M5 15V6a2 2 0 0 1 2-2h9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  var checkIcon = '<svg viewBox="0 0 24 24" fill="none"><path d="m5 13 4 4 10-10" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var closeIcon = '<svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

  /* ---------- build DOM ---------- */
  function build() {
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var overlay = document.createElement('div');
    overlay.className = 'cm-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', '聯絡方式');
    overlay.innerHTML =
      '<div class="cm-card">' +
        '<div class="cm-blob green"></div>' +
        '<div class="cm-blob peach"></div>' +
        '<button class="cm-close" type="button" aria-label="關閉">' + closeIcon + '</button>' +
        '<h2 class="cm-title">聯絡方式</h2>' +
        '<div class="cm-list">' +
          '<a class="cm-item" href="mailto:' + EMAIL + '">' +
            '<span class="cm-ic green">' + mailIcon + '</span>' +
            '<span class="cm-meta"><span class="cm-label">信箱</span><span class="cm-value">' + EMAIL + '</span></span>' +
            '<button class="cm-copy" type="button" data-copy="' + EMAIL + '" aria-label="複製信箱">' + copyIcon + '</button>' +
          '</a>' +
          '<a class="cm-item" href="tel:' + PHONE_RAW + '">' +
            '<span class="cm-ic peach">' + phoneIcon + '</span>' +
            '<span class="cm-meta"><span class="cm-label">手機</span><span class="cm-value">' + PHONE_DISPLAY + '</span></span>' +
            '<button class="cm-copy" type="button" data-copy="' + PHONE_RAW + '" aria-label="複製電話">' + copyIcon + '</button>' +
          '</a>' +
        '</div>' +
        '<p class="cm-toast">已複製到剪貼簿 ✓</p>' +
      '</div>';
    document.body.appendChild(overlay);
    return overlay;
  }

  /* ---------- behaviour ---------- */
  function init() {
    var overlay = build();
    var card = overlay.querySelector('.cm-card');
    var toast = overlay.querySelector('.cm-toast');
    var lastFocus = null;
    var toastTimer = null;

    function open(e) {
      if (e) e.preventDefault();
      lastFocus = document.activeElement;
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      setTimeout(function () { overlay.querySelector('.cm-close').focus(); }, 60);
    }
    function close() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });
    overlay.querySelector('.cm-close').addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('open')) close();
    });

    /* copy buttons */
    card.addEventListener('click', function (e) {
      var btn = e.target.closest('.cm-copy');
      if (!btn) return;
      e.preventDefault();
      var text = btn.getAttribute('data-copy');
      var done = function () {
        btn.classList.add('copied');
        btn.innerHTML = checkIcon;
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () {
          btn.classList.remove('copied');
          btn.innerHTML = copyIcon;
          toast.classList.remove('show');
        }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, fallbackCopy);
      } else { fallbackCopy(); }
      function fallbackCopy() {
        var ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); } catch (err) {}
        document.body.removeChild(ta); done();
      }
    });

    /* wire triggers via event delegation — catches dynamically rendered links too */
    function isContactTrigger(a) {
      if (!a) return false;
      if (a.hasAttribute('data-contact')) return true;
      var href = (a.getAttribute('href') || '').toLowerCase();
      if (/#contact(\b|$)/.test(href)) return true;
      if (href.indexOf('email-protection') !== -1) return true;
      if (a.classList.contains('foot-btn')) return true;
      return false;
    }
    document.addEventListener('click', function (e) {
      var el = e.target.closest('a[href], button, [data-contact]');
      if (el && isContactTrigger(el)) open(e);
    }, true);

    /* expose for manual triggers */
    window.openContactModal = open;
    window.closeContactModal = close;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
