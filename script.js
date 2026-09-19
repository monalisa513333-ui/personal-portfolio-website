/* ============================================================
   MONALISA PATRA - PORTFOLIO JAVASCRIPT
   File: js/script.js
   ============================================================ */

'use strict';

/* ──────────────────────────────────────────
   1. HAMBURGER / MOBILE MENU
   ────────────────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close mobile menu when any link is clicked
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
}

// Close when clicking outside
document.addEventListener('click', (e) => {
  if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
    closeMobileMenu();
  }
});

/* ──────────────────────────────────────────
   2. NAVBAR – scroll shadow + active link
   ────────────────────────────────────────── */
const navbar   = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

function onScroll() {
  // Shadow on scroll
  navbar.classList.toggle('scrolled', window.scrollY > 10);

  // Active link highlight
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 90) {
      current = sec.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // Run once on load

/* ──────────────────────────────────────────
   3. SCROLL-REVEAL ANIMATION
   ────────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger by index within the same batch
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 90);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

/* ──────────────────────────────────────────
   4. SKILL BAR ANIMATION (CSS transition triggered by JS)
   ────────────────────────────────────────── */
const skillBars = document.querySelectorAll('.skill-bar-fill');

const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = entry.target;
      const width  = target.getAttribute('data-width') || '0';
      // Small delay so the reveal animation finishes first
      setTimeout(() => {
        target.style.width = width + '%';
      }, 200);
      barObserver.unobserve(target);
    }
  });
}, { threshold: 0.3 });

skillBars.forEach(bar => barObserver.observe(bar));

/* ──────────────────────────────────────────
   5. CONTACT FORM + TOAST
   ────────────────────────────────────────── */
const contactForm = document.getElementById('contactForm');
const toast       = document.getElementById('toast');
let   toastTimer  = null;

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Basic validation
  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) {
    showToast('Please fill in all required fields.', 'error');
    return;
  }

  if (!isValidEmail(email)) {
    showToast('Please enter a valid email address.', 'error');
    return;
  }

  // Success
  contactForm.reset();
  showToast('\u2713 Message sent! I will get back to you soon.', 'success');
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showToast(message, type) {
  toast.textContent = message;
  toast.style.background = type === 'error' ? '#ef4444' : '#10b981';
  toast.style.display = 'block';

  // Reset animation
  toast.style.animation = 'none';
  // Force reflow
  void toast.offsetHeight;
  toast.style.animation = 'slide-up 0.35s ease';

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.style.display = 'none';
  }, 3800);
}

/* ──────────────────────────────────────────
   6. SMOOTH SCROLL POLYFILL for older browsers
   ────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
