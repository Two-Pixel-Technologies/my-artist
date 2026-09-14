// =========================================================
// myartist.in — Launching Soon
// Navbar behavior + scroll reveal animations
// =========================================================

// EmailJS configuration
const EMAILJS_CONFIG = {
  publicKey: 's1jaOI0OwCIYTJJwr',
  serviceId: 'service_rbls36n',
  templateId: 'template_rhmvim7',
};

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScrollState();
  initMobileNav();
  initMobileContactAnchor();
  initScrollReveal();
  initNotifyForm();
});

/* Add a background/border to the navbar once the page scrolls */
function initNavbarScrollState() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('is-scrolled', window.scrollY > 12);
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* Mobile hamburger menu toggle */
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('is-open');
    toggle.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu after a link is tapped
  links.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      links.classList.remove('is-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* Contact only: offset the mobile navigation target by the live fixed-navbar height. */
function initMobileContactAnchor() {
  const contactLink = document.querySelector('#navLinks a[href="#contact"]');
  const contactSection = document.getElementById('contact');
  const navbar = document.getElementById('navbar');
  const mobileQuery = window.matchMedia('(max-width: 767px)');

  if (!contactLink || !contactSection || !navbar) return;

  contactLink.addEventListener('click', (event) => {
    if (!mobileQuery.matches) return;

    event.preventDefault();

    const targetTop = Math.max(
      0,
      window.scrollY + contactSection.getBoundingClientRect().top - navbar.getBoundingClientRect().height
    );
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

    window.history.pushState(null, '', '#contact');
    window.scrollTo({ top: targetTop, behavior });
  });
}

/* Contact section "Notify Me" form — sends the submitted email via EmailJS */
function initNotifyForm() {
  const form = document.getElementById('notifyForm');
  const emailInput = document.getElementById('notifyEmail');
  const status = document.getElementById('notifyFormStatus');
  const button = form ? form.querySelector('button[type="submit"]') : null;

  if (!form || !emailInput || !status || !button) return;
  if (typeof emailjs === 'undefined') return;

  emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });

  const setStatus = (message, variant) => {
    status.textContent = message;
    status.classList.remove('notify__form-status--success', 'notify__form-status--error');
    if (variant) status.classList.add(`notify__form-status--${variant}`);
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    if (!email || !emailInput.checkValidity()) {
      setStatus('Please enter a valid email address.', 'error');
      emailInput.focus();
      return;
    }

    const originalLabel = button.textContent;
    button.disabled = true;
    button.textContent = 'Sending...';
    setStatus('');

    emailjs
      .sendForm(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, form)
      .then(() => {
        setStatus('You’re on the list!', 'success');
        form.reset();
      })
      .catch(() => {
        setStatus('Something went wrong. Please try again.', 'error');
      })
      .finally(() => {
        button.disabled = false;
        button.textContent = originalLabel;
      });
  });
}

/* Subtle fade-up reveal for elements marked with [data-reveal] */
function initScrollReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = Array.from(items).indexOf(el) * 90;
          setTimeout(() => el.classList.add('is-visible'), delay);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach((el) => observer.observe(el));
}
