/* ============================================================
   Fer Alcaraz — Jungle Session
   Vanilla JS. No build step. Mobile first.
   ============================================================ */

(() => {
  'use strict';

  // ---------- Config ----------
  const PRICE_SINGLE = 10000;
  const PRICE_GROUP  = 7000;
  const MIN_QTY = 1;
  const MAX_QTY = 4;

  // Real Mercado Pago links per quantity
  const MP_LINKS = {
    1: 'https://mpago.la/1K9EB21', // $10.000
    2: 'https://mpago.la/1kc98TN', // $14.000
    3: 'https://mpago.la/1XXrqcH', // $21.000
    4: 'https://mpago.la/1DNuDuK', // $28.000
  };

  // ---------- Helpers ----------
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const formatARS = (n) =>
    '$' + n.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  // ---------- Navigation: blur on scroll ----------
  const nav = $('#nav');
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 24) {
        nav.classList.add('is-scrolled');
      } else {
        nav.classList.remove('is-scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---------- Sticky mobile CTA (show after hero) ----------
  const sticky = $('#stickyCta');
  const hero = $('.hero');
  if (sticky && hero && 'IntersectionObserver' in window) {
    const heroObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            sticky.classList.remove('is-visible');
            sticky.setAttribute('aria-hidden', 'true');
          } else {
            sticky.classList.add('is-visible');
            sticky.setAttribute('aria-hidden', 'false');
          }
        });
      },
      { threshold: 0.2 }
    );
    heroObserver.observe(hero);
  }

  // Hide sticky when buy section is in view (avoid duplication)
  const buySection = $('#comprar');
  if (sticky && buySection && 'IntersectionObserver' in window) {
    const buyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            sticky.classList.remove('is-visible');
            sticky.setAttribute('aria-hidden', 'true');
          }
        });
      },
      { threshold: 0.35 }
    );
    buyObserver.observe(buySection);
  }

  // ---------- Scroll reveal ----------
  const revealEls = $$('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-in'));
  }

  // ---------- Quantity selector + price calculation ----------
  const qtyCountEl = $('#qtyCount');
  const qtyMinus   = $('#qtyMinus');
  const qtyPlus    = $('#qtyPlus');

  const brkLine     = $('#brkLine');
  const brkUnit     = $('#brkUnit');
  const brkSubtotal = $('#brkSubtotal');
  const brkTotal    = $('#brkTotal');
  const brkHint     = $('#brkHint');
  const buyBtn      = $('#buyBtn');

  let qty = 1;

  function unitPrice(q) {
    return q >= 2 ? PRICE_GROUP : PRICE_SINGLE;
  }

  function buildMPUrl(q) {
    return MP_LINKS[q] || MP_LINKS[1];
  }

  function render(q, animate = false) {
    const unit = unitPrice(q);
    const subtotal = unit * q;

    if (qtyCountEl) {
      qtyCountEl.textContent = String(q);
      if (animate) {
        qtyCountEl.classList.remove('bump');
        // force reflow for restart
        void qtyCountEl.offsetWidth;
        qtyCountEl.classList.add('bump');
      }
    }

    if (brkLine)     brkLine.textContent     = q === 1 ? '1 entrada' : `${q} entradas`;
    if (brkUnit)     brkUnit.textContent     = formatARS(unit);
    if (brkSubtotal) brkSubtotal.textContent = formatARS(subtotal);
    if (brkTotal)    brkTotal.textContent    = formatARS(subtotal);

    if (brkHint) {
      if (q === 1) {
        brkHint.textContent = 'Sumá una entrada más y pasás al precio promo: $7.000 c/u.';
        brkHint.style.opacity = '1';
      } else {
        const saved = (PRICE_SINGLE - PRICE_GROUP) * q;
        brkHint.textContent = `Ahorrás ${formatARS(saved)} con el precio promo.`;
        brkHint.style.opacity = '1';
      }
    }

    if (qtyMinus) qtyMinus.disabled = q <= MIN_QTY;
    if (qtyPlus)  qtyPlus.disabled  = q >= MAX_QTY;

    if (buyBtn) {
      buyBtn.href = buildMPUrl(q);
    }
  }

  if (qtyMinus && qtyPlus && qtyCountEl) {
    qtyMinus.addEventListener('click', () => {
      if (qty > MIN_QTY) {
        qty -= 1;
        render(qty, true);
      }
    });
    qtyPlus.addEventListener('click', () => {
      if (qty < MAX_QTY) {
        qty += 1;
        render(qty, true);
      }
    });
    render(qty);
  }

  // ---------- Smooth scroll for in-page anchors ----------
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id && id.length > 1 && id !== '#top') {
        const target = $(id);
        if (target) {
          e.preventDefault();
          const top = target.getBoundingClientRect().top + window.scrollY - 48;
          window.scrollTo({ top, behavior: 'smooth' });
          // Keep URL clean but reflect anchor
          history.replaceState(null, '', id);
        }
      } else if (id === '#top') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        history.replaceState(null, '', '/');
      }
    });
  });

  // ---------- FAQ: ensure only one open (optional UX polish) ----------
  $$('.faq__item').forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        $$('.faq__item').forEach((other) => {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  // ---------- CTA tracking hook (placeholder for analytics) ----------
  $$('[data-cta]').forEach((el) => {
    el.addEventListener('click', () => {
      // Placeholder: integrate Plausible / GA4 / Meta Pixel here
      // window.dataLayer && window.dataLayer.push({ event: 'cta_click', cta_id: el.dataset.cta });
    });
  });

  // ---------- Persist qty for gracias.html if user comes back ----------
  try {
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('js_qty', String(qty));
      sessionStorage.setItem('js_total', String(unitPrice(qty) * qty));
    });
  } catch (_) { /* sessionStorage might be blocked */ }
})();
