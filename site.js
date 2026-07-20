/* Beard's Home Services — shared site behavior (progressive enhancement).
   Everything here is additive: with JS disabled the site still works, it just
   loses the slide-out menu, the sticky call bar, and offline support. */
(function () {
  'use strict';

  var PHONE_TEL = 'tel:+18703211072';
  var PHONE_SMS = 'sms:+18703211072';
  var PHONE_DISPLAY = '(870) 321-1072';

  /* ---------------------------------------------------------------------- */
  /* Mobile navigation drawer                                                */
  /* ---------------------------------------------------------------------- */
  function buildMobileNav() {
    var nav = document.querySelector('nav');
    if (!nav) return;
    var list = nav.querySelector('ul');
    if (!list) return;

    // Hamburger toggle button (shown only on small screens via CSS).
    var toggle = document.createElement('button');
    toggle.className = 'nav-toggle';
    toggle.setAttribute('aria-label', 'Open menu');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'mobile-drawer');
    toggle.innerHTML = '<span></span><span></span><span></span>';
    nav.appendChild(toggle);

    // Backdrop.
    var backdrop = document.createElement('div');
    backdrop.className = 'drawer-backdrop';
    document.body.appendChild(backdrop);

    // Drawer.
    var drawer = document.createElement('div');
    drawer.className = 'mobile-drawer';
    drawer.id = 'mobile-drawer';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    drawer.setAttribute('aria-label', 'Site menu');

    var head = document.createElement('div');
    head.className = 'drawer-head';
    head.innerHTML = '<span class="drawer-title">Menu</span>' +
      '<button class="drawer-close" aria-label="Close menu">&times;</button>';
    drawer.appendChild(head);

    // Clone the page's own nav links so each page keeps its correct hrefs.
    var cloned = list.cloneNode(true);
    cloned.className = 'drawer-links';
    drawer.appendChild(cloned);

    // Prominent contact actions at the bottom of the drawer.
    var actions = document.createElement('div');
    actions.className = 'drawer-actions';
    actions.innerHTML =
      '<a href="' + PHONE_TEL + '" class="drawer-btn call">📞 Call ' + PHONE_DISPLAY + '</a>' +
      '<a href="' + PHONE_SMS + '" class="drawer-btn text">💬 Text a Photo</a>' +
      '<a href="' + quoteHref() + '" class="drawer-btn quote">📝 Get a Free Quote</a>';
    drawer.appendChild(actions);

    document.body.appendChild(drawer);

    var lastFocus = null;
    function open() {
      lastFocus = document.activeElement;
      document.body.classList.add('drawer-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
      var first = drawer.querySelector('a, button');
      if (first) first.focus();
    }
    function close() {
      document.body.classList.remove('drawer-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    function isOpen() { return document.body.classList.contains('drawer-open'); }

    toggle.addEventListener('click', function () { isOpen() ? close() : open(); });
    backdrop.addEventListener('click', close);
    head.querySelector('.drawer-close').addEventListener('click', close);
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a')) close(); // close after tapping a link
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) close();
    });
    // Close if the viewport grows back to desktop width.
    window.addEventListener('resize', function () {
      if (isOpen() && window.innerWidth > 820) close();
    });
  }

  function quoteHref() {
    return document.getElementById('contact') ? '#contact' : '/#contact';
  }

  /* ---------------------------------------------------------------------- */
  /* Sticky mobile action bar                                                */
  /* ---------------------------------------------------------------------- */
  function buildActionBar() {
    var bar = document.createElement('div');
    bar.className = 'mobile-actionbar';
    bar.innerHTML =
      '<a href="' + PHONE_TEL + '" data-action="call"><span class="ico">📞</span>Call</a>' +
      '<a href="' + PHONE_SMS + '"><span class="ico">💬</span>Text</a>' +
      '<a href="' + quoteHref() + '"><span class="ico">📝</span>Quote</a>';
    document.body.appendChild(bar);
  }

  /* ---------------------------------------------------------------------- */
  /* Back-to-top button                                                      */
  /* ---------------------------------------------------------------------- */
  function buildBackToTop() {
    var btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '↑';
    document.body.appendChild(btn);
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        btn.classList.toggle('show', window.scrollY > 600);
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------------------------------------------------------------------- */
  /* Highlight the current page in the nav                                   */
  /* ---------------------------------------------------------------------- */
  function markActiveNav() {
    var path = location.pathname.replace(/\/$/, '') || '/';
    document.querySelectorAll('nav ul a, .drawer-links a').forEach(function (a) {
      var href = (a.getAttribute('href') || '').split('#')[0].replace(/\/$/, '');
      if (href && href === path) a.classList.add('active');
    });
  }

  /* ---------------------------------------------------------------------- */
  /* PWA shortcut: /?action=call opens the dialer                            */
  /* ---------------------------------------------------------------------- */
  function handleCallShortcut() {
    if (new URLSearchParams(location.search).get('action') === 'call') {
      window.location.href = PHONE_TEL;
    }
  }

  /* ---------------------------------------------------------------------- */
  /* Service worker registration                                             */
  /* ---------------------------------------------------------------------- */
  function registerSW() {
    if (!('serviceWorker' in navigator)) return;
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').catch(function () { /* offline support optional */ });
    });
  }

  /* ---------------------------------------------------------------------- */
  function init() {
    buildMobileNav();
    buildActionBar();
    buildBackToTop();
    markActiveNav();
    handleCallShortcut();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  registerSW();
})();
