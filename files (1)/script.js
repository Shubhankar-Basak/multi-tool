/* ==========================================================================
   AdSense Toolkit — script.js
   Handles nav, animations, FAQ accordion, counters, and calculator logic.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initLucideIcons();
  initMobileNav();
  initAOS();
  initSmoothScroll();
  initActiveNav();
  initFAQAccordion();
  initCounters();
  initHeroAnimations();
  initBackToTop();
  initNewsletterForm();
  initCalculators();
});

/* ---------------------------- Icons ---------------------------- */
function initLucideIcons() {
  if (window.lucide) window.lucide.createIcons();
}

/* ---------------------------- Mobile nav ---------------------------- */
function initMobileNav() {
  const btn = document.querySelector('.btn-menu');
  const menu = document.querySelector('.mobile-menu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(isOpen));
    const icon = btn.querySelector('i');
    if (icon) icon.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
    if (window.lucide) window.lucide.createIcons();
  });
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------------------------- AOS init ---------------------------- */
function initAOS() {
  if (window.AOS) {
    window.AOS.init({ duration: 500, easing: 'ease-in-out', once: true, offset: 60 });
  }
}

/* ---------------------------- Smooth scroll ---------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* ---------------------------- Active nav link ---------------------------- */
function initActiveNav() {
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !navLinks.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });
  sections.forEach(s => observer.observe(s));
}

/* ---------------------------- FAQ accordion ---------------------------- */
function initFAQAccordion() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;
    question.setAttribute('aria-expanded', 'false');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // close siblings within the same faq list
      const parent = item.parentElement;
      if (parent) {
        parent.querySelectorAll('.faq-item.open').forEach(openItem => {
          if (openItem !== item) {
            openItem.classList.remove('open');
            openItem.querySelector('.faq-answer').style.maxHeight = null;
            openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          }
        });
      }
      item.classList.toggle('open', !isOpen);
      question.setAttribute('aria-expanded', String(!isOpen));
      answer.style.maxHeight = !isOpen ? `${answer.scrollHeight}px` : null;
    });
  });
}

/* ---------------------------- Animated counters ---------------------------- */
function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;
  const animate = (el) => {
    const target = parseFloat(el.dataset.counter);
    const suffix = el.dataset.suffix || '';
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals, 10) : 0;
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = decimals ? value.toFixed(decimals) + suffix : Math.round(value).toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
}

/* ---------------------------- Hero / GSAP entrance ---------------------------- */
function initHeroAnimations() {
  if (!window.gsap) return;
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('[data-hero-eyebrow]', { opacity: 0, y: 16, duration: 0.5 })
    .from('[data-hero-title]', { opacity: 0, y: 24, duration: 0.6 }, '-=0.3')
    .from('[data-hero-sub]', { opacity: 0, y: 20, duration: 0.5 }, '-=0.35')
    .from('[data-hero-cta]', { opacity: 0, y: 16, duration: 0.5 }, '-=0.3')
    .from('[data-hero-visual]', { opacity: 0, y: 30, scale: 0.96, duration: 0.7 }, '-=0.5');

  gsap.utils.toArray('[data-float]').forEach((el, i) => {
    gsap.to(el, {
      y: -14,
      duration: 3 + (i % 3),
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: i * 0.2,
    });
  });
}

/* ---------------------------- Back to top ---------------------------- */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ---------------------------- Newsletter form ---------------------------- */
function initNewsletterForm() {
  const form = document.querySelector('[data-newsletter-form]');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    if (!input || !input.value || !input.checkValidity()) {
      input && input.classList.add('error');
      return;
    }
    input.classList.remove('error');
    showToast('Subscribed! Check your inbox to confirm.');
    form.reset();
  });
}

/* ---------------------------- Toast ---------------------------- */
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('show'), 2600);
}

/* ---------------------------- Number formatting utils ---------------------------- */
function formatCurrency(value) {
  if (!isFinite(value)) return '$0.00';
  return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function formatNumber(value, decimals = 0) {
  if (!isFinite(value)) return '0';
  return value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
function formatPercent(value) {
  if (!isFinite(value)) return '0.00%';
  return value.toFixed(2) + '%';
}

/* ---------------------------- Input validation ---------------------------- */
function validateField(input, { min = 0, required = true } = {}) {
  const field = input.closest('.field');
  const errorMsg = field ? field.querySelector('.error-msg') : null;
  const value = parseFloat(input.value);
  let valid = true;
  let message = '';

  if (required && input.value.trim() === '') {
    valid = false;
    message = 'This field is required.';
  } else if (isNaN(value)) {
    valid = false;
    message = 'Enter a valid number.';
  } else if (value < min) {
    valid = false;
    message = `Value must be at least ${min}.`;
  }

  input.classList.toggle('error', !valid);
  if (field) field.classList.toggle('has-error', !valid);
  if (errorMsg) errorMsg.textContent = message;
  return valid;
}

/* ---------------------------- Copy result ---------------------------- */
function initCopyButtons() {
  document.querySelectorAll('[data-copy-results]').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = document.querySelector('[data-results-card]');
      if (!card) return;
      const items = card.querySelectorAll('.result-item');
      const lines = Array.from(items).map(item => {
        const label = item.querySelector('.label')?.textContent.trim();
        const value = item.querySelector('.value')?.textContent.trim();
        return `${label}: ${value}`;
      });
      const text = lines.join('\n');
      navigator.clipboard?.writeText(text).then(() => {
        showToast('Results copied to clipboard.');
      }).catch(() => {
        showToast('Could not copy results.');
      });
    });
  });
}

/* ---------------------------- Reveal results w/ GSAP ---------------------------- */
function revealResults() {
  const card = document.querySelector('[data-results-card]');
  if (!card) return;
  card.hidden = false;
  if (window.gsap) {
    gsap.fromTo(card, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
    gsap.utils.toArray('[data-results-card] .value').forEach(el => {
      gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.4 });
    });
  } else {
    card.style.opacity = 1;
  }
  card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ==========================================================================
   Calculator Engines
   Each calculator is wired via [data-calculator="name"] on its <form>.
   ========================================================================== */
function initCalculators() {
  initCopyButtons();

  wireCalculator('earnings', (get) => {
    const pageviews = get('pageviews', { min: 0 });
    const ctr = get('ctr', { min: 0 });
    const cpc = get('cpc', { min: 0 });
    if (pageviews === null || ctr === null || cpc === null) return null;
    const clicks = pageviews * (ctr / 100);
    const daily = clicks * cpc;
    return {
      clicks: { label: 'Estimated Clicks', value: formatNumber(clicks, 0) },
      daily: { label: 'Daily Earnings', value: formatCurrency(daily), primary: true },
      monthly: { label: 'Monthly Earnings', value: formatCurrency(daily * 30) },
      yearly: { label: 'Yearly Earnings', value: formatCurrency(daily * 365) },
    };
  });

  wireCalculator('ctr', (get) => {
    const impressions = get('impressions', { min: 1 });
    const clicks = get('clicks', { min: 0 });
    if (impressions === null || clicks === null) return null;
    const ctr = (clicks / impressions) * 100;
    return { ctr: { label: 'Click-Through Rate', value: formatPercent(ctr), primary: true } };
  });

  wireCalculator('cpc', (get) => {
    const earnings = get('earnings', { min: 0 });
    const clicks = get('clicks', { min: 1 });
    if (earnings === null || clicks === null) return null;
    const cpc = earnings / clicks;
    return { cpc: { label: 'Average CPC', value: formatCurrency(cpc), primary: true } };
  });

  wireCalculator('rpm', (get) => {
    const earnings = get('earnings', { min: 0 });
    const pageviews = get('pageviews', { min: 1 });
    if (earnings === null || pageviews === null) return null;
    const rpm = (earnings / pageviews) * 1000;
    return { rpm: { label: 'RPM', value: formatCurrency(rpm), primary: true } };
  });

  wireCalculator('page-rpm', (get) => {
    const earnings = get('earnings', { min: 0 });
    const impressions = get('impressions', { min: 1 });
    if (earnings === null || impressions === null) return null;
    const pageRpm = (earnings / impressions) * 1000;
    return { pageRpm: { label: 'Page RPM', value: formatCurrency(pageRpm), primary: true } };
  });

  wireCalculator('target-earnings', (get) => {
    const target = get('target', { min: 0 });
    const ctr = get('ctr', { min: 0.01 });
    const cpc = get('cpc', { min: 0.01 });
    if (target === null || ctr === null || cpc === null) return null;
    const requiredClicks = target / cpc;
    const requiredPageviews = requiredClicks / (ctr / 100);
    return {
      clicks: { label: 'Required Clicks', value: formatNumber(requiredClicks, 0), primary: true },
      pageviews: { label: 'Required Pageviews', value: formatNumber(requiredPageviews, 0) },
    };
  });

  wireCalculator('traffic-needed', (get) => {
    const target = get('target', { min: 0 });
    const rpm = get('rpm', { min: 0.01 });
    if (target === null || rpm === null) return null;
    const pageviews = (target / rpm) * 1000;
    return { pageviews: { label: 'Required Pageviews', value: formatNumber(pageviews, 0), primary: true } };
  });

  wireCalculator('clicks-needed', (get) => {
    const target = get('target', { min: 0 });
    const cpc = get('cpc', { min: 0.01 });
    if (target === null || cpc === null) return null;
    const clicks = target / cpc;
    return { clicks: { label: 'Required Clicks', value: formatNumber(clicks, 0), primary: true } };
  });

  wireCalculator('impressions-needed', (get) => {
    const clicks = get('clicks', { min: 0 });
    const ctr = get('ctr', { min: 0.01 });
    if (clicks === null || ctr === null) return null;
    const impressions = clicks / (ctr / 100);
    return { impressions: { label: 'Required Impressions', value: formatNumber(impressions, 0), primary: true } };
  });

  wireCalculator('monthly-revenue', (get) => {
    const daily = get('daily', { min: 0 });
    if (daily === null) return null;
    return {
      weekly: { label: 'Weekly Revenue', value: formatCurrency(daily * 7) },
      monthly: { label: 'Monthly Revenue', value: formatCurrency(daily * 30), primary: true },
      yearly: { label: 'Yearly Revenue', value: formatCurrency(daily * 365) },
    };
  });
}

function wireCalculator(name, computeFn) {
  const form = document.querySelector(`[data-calculator="${name}"]`);
  if (!form) return;

  const getValue = (fieldName, opts) => {
    const input = form.querySelector(`[name="${fieldName}"]`);
    if (!input) return null;
    if (!validateField(input, opts)) return null;
    return parseFloat(input.value);
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputs = form.querySelectorAll('input[type="number"]');
    let allValid = true;
    inputs.forEach(input => {
      const min = input.dataset.min !== undefined ? parseFloat(input.dataset.min) : 0;
      if (!validateField(input, { min })) allValid = false;
    });
    if (!allValid) return;

    const results = computeFn(getValue);
    if (!results) return;

    const card = document.querySelector('[data-results-card]');
    if (!card) return;
    Object.entries(results).forEach(([key, data]) => {
      const item = card.querySelector(`[data-result="${key}"]`);
      if (item) {
        const valueEl = item.querySelector('.value');
        if (valueEl) valueEl.textContent = data.value;
      }
    });
    revealResults();
  });

  form.addEventListener('reset', () => {
    setTimeout(() => {
      form.querySelectorAll('input').forEach(input => {
        input.classList.remove('error');
        input.closest('.field')?.classList.remove('has-error');
      });
      const card = document.querySelector('[data-results-card]');
      if (card) card.hidden = true;
    }, 0);
  });
}
