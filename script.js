/* =========================================================
   THE ART HOUSE BY AMBER SHAW — script.js
   ========================================================= */

// ── HERO SLIDESHOW ─────────────────────────────────────────
const heroSlides = document.querySelectorAll('.hero-slide');
let currentSlide = 0;
if (heroSlides.length > 1) {
  setInterval(() => {
    heroSlides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % heroSlides.length;
    heroSlides[currentSlide].classList.add('active');
  }, 5500);
}

// ── HAMBURGER MENU ────────────────────────────────────────
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Close menu on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ── ACTIVE NAV LINK ON SCROLL ─────────────────────────────
const sections    = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      allNavLinks.forEach(link => {
        link.classList.remove('active-nav');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active-nav');
        }
      });
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => sectionObserver.observe(s));

// ── REVEAL ON SCROLL ──────────────────────────────────────
const reveals = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, Number(delay));
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

reveals.forEach((el) => {
  // Stagger siblings
  const siblings = el.parentElement.querySelectorAll('.reveal');
  const idx = Array.from(siblings).indexOf(el);
  el.dataset.delay = idx * 90;
  revealObserver.observe(el);
});

// ── GALLERY FILTER ────────────────────────────────────────
const filterBtns   = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    const filter = btn.dataset.filter;

    galleryItems.forEach(item => {
      if (filter === 'all' || item.classList.contains(filter)) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

// ── LIGHTBOX ─────────────────────────────────────────────
const lightbox     = document.getElementById('lightbox');
const lbBackdrop   = document.getElementById('lightbox-backdrop');
const lbClose      = document.getElementById('lightbox-close');
const lbImg        = document.getElementById('lightbox-img');
const lbTitle      = document.getElementById('lightbox-title');
const lbMedium     = document.getElementById('lightbox-medium');
const lbEnquireBtn = document.getElementById('lightbox-enquire-btn');
const lbBackBtn    = document.getElementById('lightbox-back-btn');

function openLightbox(imgSrc, title, medium, year) {
  lbImg.src = imgSrc;
  lbImg.alt = title;
  lbTitle.textContent = title;
  lbMedium.textContent = medium ? `${medium}${year ? ' · ' + year : ''}` : '';
  lbEnquireBtn.onclick = () => {
    closeLightbox();
    openEnquiry(title);
  };
  lightbox.classList.add('open');
  lbBackdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lbBackdrop.classList.remove('open');
  document.body.style.overflow = '';
  lbImg.src = '';
}

lbClose.addEventListener('click', closeLightbox);
if (lbBackBtn) lbBackBtn.addEventListener('click', closeLightbox);
lbBackdrop.addEventListener('click', closeLightbox);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

// Click on gallery image wraps opens lightbox
galleryItems.forEach(item => {
  const wrap = item.querySelector('.gallery-img-wrap');
  if (!wrap) return;
  const img  = item.querySelector('img');
  const cap  = item.querySelector('.gallery-caption h3');

  wrap.addEventListener('click', e => {
    // Don't trigger if clicking enquire button
    if (e.target.classList.contains('btn-enquire') || e.target.closest('.btn-enquire')) return;
    openLightbox(
      img ? img.src : '',
      cap ? cap.textContent : (item.dataset.title || ''),
      item.dataset.medium || '',
      item.dataset.year || ''
    );
  });
});

// ── ENQUIRY SYSTEM ────────────────────────────────────────
function openEnquiry(artworkTitle) {
  const subject = document.getElementById('cf-subject');
  const message = document.getElementById('cf-message');
  const contactSection = document.getElementById('contact');

  if (subject) subject.value = 'Artwork Enquiry';
  if (message) message.value = `Hello,\n\nI am interested in enquiring about the work: "${artworkTitle}".\n\nPlease could you share pricing and availability?\n\nThank you.`;

  contactSection.scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => {
    const nameInput = document.getElementById('cf-name');
    if (nameInput) nameInput.focus();
  }, 650);
}

// ── CONTACT FORM ─────────────────────────────────────────
function handleFormSubmit(e) {
  e.preventDefault();
  const form    = document.getElementById('contact-form');
  const name    = document.getElementById('cf-name').value.trim();
  const email   = document.getElementById('cf-email').value.trim();
  const subject = document.getElementById('cf-subject').value;
  const message = document.getElementById('cf-message').value.trim();

  const to  = 'ambershaw36@hotmail.com';
  const body = encodeURIComponent(
    `From: ${name} <${email}>\n\n${message}\n\n---\nSent via The Art House by Amber Shaw website.`
  );
  const mailtoUrl = `mailto:${to}?subject=${encodeURIComponent(subject + ' — The Art House by Amber Shaw')}&body=${body}`;

  window.location.href = mailtoUrl;
  showToast('✓ Opening your email client to send message to Amber…');
  form.reset();
}

// ── TOAST NOTIFICATION ───────────────────────────────────
const toast    = document.getElementById('toast');
const toastMsg = document.getElementById('toast-msg');
let toastTimer = null;

function showToast(msg, duration = 4000) {
  toastMsg.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), duration);
}

// ── SMOOTH ANCHOR SCROLL WITH OFFSET ─────────────────────
const siteHeader = document.getElementById('site-header');
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const headerH = siteHeader ? siteHeader.offsetHeight : 130;
    const top = target.getBoundingClientRect().top + window.scrollY - headerH - 12;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── VIDEO AUTOPLAY ON SCROLL ──────────────────────────────
const studioVideo = document.getElementById('studio-video');
if (studioVideo) {
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        studioVideo.play().catch(() => {});
      } else {
        studioVideo.pause();
      }
    });
  }, { threshold: 0.35 });
  videoObserver.observe(studioVideo);
}
