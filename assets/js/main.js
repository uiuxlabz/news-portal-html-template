/* ============================================================
   NEWSROOM — Main Script
   Burger toggle, active nav, year, reveal, form validation,
   category filter, prefers-reduced-motion.
   ============================================================ */
(function () {
  'use strict';

  /* ── prefers-reduced-motion ─────────────────────────────── */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Burger Toggle ──────────────────────────────────────── */
  const burger = document.querySelector('.burger');
  const navList = document.querySelector('.nav__list');

  if (burger && navList) {
    burger.addEventListener('click', function () {
      burger.classList.toggle('open');
      navList.classList.toggle('open');
      const expanded = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!expanded));
    });

    // Close on link click (mobile)
    navList.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        burger.classList.remove('open');
        navList.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── Active Nav Highlight ───────────────────────────────── */
  function setActiveNav() {
    var path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav__link').forEach(function (link) {
      var href = link.getAttribute('href');
      if (href === path || (path === '' && href === 'index.html')) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }
  setActiveNav();

  /* ── Dynamic Year ───────────────────────────────────────── */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ── Dynamic Date Display ───────────────────────────────── */
  var dateEl = document.querySelector('.header__date');
  if (dateEl) {
    var now = new Date();
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateEl.textContent = now.toLocaleDateString('en-US', options);
  }

  /* ── IntersectionObserver — Reveal ──────────────────────── */
  if ('IntersectionObserver' in window && !prefersReduced) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show everything immediately
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ── Contact / Newsletter Form Handling ─────────────────── */
  document.querySelectorAll('[data-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var okMsg = form.querySelector('.form-ok');
      var errMsg = form.querySelector('.form-err');

      // Basic validation
      var valid = true;
      form.querySelectorAll('[required]').forEach(function (input) {
        if (!input.value.trim()) {
          valid = false;
          input.style.borderColor = '#DC2626';
        } else {
          input.style.borderColor = '';
        }
      });

      // Email validation
      var emailField = form.querySelector('input[type="email"]');
      if (emailField && emailField.value) {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
          valid = false;
          emailField.style.borderColor = '#DC2626';
        }
      }

      if (valid) {
        if (okMsg) okMsg.style.display = 'block';
        if (errMsg) errMsg.style.display = 'none';
        form.reset();
        // Scroll to success message
        if (okMsg) okMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        if (errMsg) errMsg.style.display = 'block';
        if (okMsg) okMsg.style.display = 'none';
      }
    });

    // Clear error on input
    form.querySelectorAll('input, textarea, select').forEach(function (input) {
      input.addEventListener('input', function () {
        this.style.borderColor = '';
      });
    });
  });

  /* ── Category Filter (category.html) ────────────────────── */
  var filterBtns = document.querySelectorAll('.cat-filters__btn');
  var cards = document.querySelectorAll('[data-category]');

  if (filterBtns.length && cards.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        // Update active state
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        var filter = btn.getAttribute('data-filter');

        cards.forEach(function (card) {
          if (prefersReduced) {
            card.style.display = (filter === 'all' || card.getAttribute('data-category') === filter) ? '' : 'none';
          } else {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
              card.style.display = '';
              card.style.opacity = '0';
              card.style.transform = 'translateY(16px)';
              requestAnimationFrame(function () {
                card.style.transition = 'opacity .3s ease, transform .3s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
              });
            } else {
              card.style.display = 'none';
            }
          }
        });

        // Update count
        var countEl = document.querySelector('.cat-hero__count');
        if (countEl) {
          var visible = filter === 'all'
            ? cards.length
            : document.querySelectorAll('[data-category="' + filter + '"]').length;
          countEl.textContent = visible + ' article' + (visible !== 1 ? 's' : '');
        }
      });
    });
  }

  /* ── Smooth Scroll for Anchor Links ─────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
      }
    });
  });

})();
