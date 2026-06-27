/* ==========================================================================
   PONNI DEVELOPERS — Site Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------------------
     0. Footer year
  --------------------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ---------------------------------------------------------------------
     1. Active nav link on scroll — sections/navLinks declared up front so
        onScroll() can safely call updateActiveNav() below.
  --------------------------------------------------------------------- */
  const sections = ['home', 'about', 'projects', 'journey', 'amenities', 'contact']
    .map(id => document.getElementById(id))
    .filter(Boolean);
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));

  function updateActiveNav() {
    const scrollPos = window.scrollY + 140;
    let currentId = sections[0]?.id;
    for (const sec of sections) {
      if (sec.offsetTop <= scrollPos) currentId = sec.id;
    }
    navLinks.forEach(link => {
      const matches = link.getAttribute('href') === `#${currentId}`;
      link.classList.toggle('active-link', matches);
    });
  }


  /* ---------------------------------------------------------------------
     2. Sticky header state on scroll
  --------------------------------------------------------------------- */
  const header = document.getElementById('siteHeader');
  const backToTop = document.getElementById('backToTop');

  const onScroll = () => {
    const scrolled = window.scrollY > 20;
    header.classList.toggle('scrolled', scrolled);
    backToTop.classList.toggle('show', window.scrollY > 600);
    updateActiveNav();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ---------------------------------------------------------------------
     2. Mobile nav toggle
  --------------------------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mainNav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });


  /* ---------------------------------------------------------------------
     4. Animated hero counters (count up when visible)
  --------------------------------------------------------------------- */
  const counters = document.querySelectorAll('.hero-stat-num');
  let countersStarted = false;

  function animateCounters() {
    if (countersStarted) return;
    countersStarted = true;
    counters.forEach(el => {
      const target = parseInt(el.dataset.count, 10) || 0;
      const duration = 1400;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      }
      requestAnimationFrame(tick);
    });
  }

  const heroStatsEl = document.querySelector('.hero-stats');
  if (heroStatsEl && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          io.disconnect();
        }
      });
    }, { threshold: 0.4 });
    io.observe(heroStatsEl);
  } else {
    animateCounters();
  }


  /* ---------------------------------------------------------------------
     5. Scroll-reveal for sections/cards
  --------------------------------------------------------------------- */
  const revealTargets = document.querySelectorAll(
    '.about-grid, .course-step, .amenity-card, .project-card, .testimonial-card'
  );
  if ('IntersectionObserver' in window) {
    const revealIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          revealIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealTargets.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity .6s cubic-bezier(.22,.61,.36,1), transform .6s cubic-bezier(.22,.61,.36,1)';
      revealIO.observe(el);
    });
  }


  /* ---------------------------------------------------------------------
     6. Project data + render + filter
  --------------------------------------------------------------------- */
  const PROJECTS = [
    {
      name: 'Ponni Riverview',
      location: 'Saravanampatti',
      status: 'ongoing',
      plots: '210 Plots',
      size: '1200 – 2400 sq.ft',
      type: 'Residential Plots',
      gradientSeed: 0
    },
    {
      name: 'Ponni Meadow Court',
      location: 'Kovaipudur',
      status: 'ongoing',
      plots: '168 Plots',
      size: '1100 – 2850 sq.ft',
      type: 'Residential Plots',
      gradientSeed: 1
    },
    {
      name: 'Ponni Green Banks',
      location: 'Vadavalli',
      status: 'ongoing',
      plots: '142 Plots',
      size: '1400 – 3100 sq.ft',
      type: 'Villa Plots',
      gradientSeed: 2
    },
    {
      name: 'Ponni Northgate',
      location: 'Kalapatti',
      status: 'upcoming',
      plots: '256 Plots',
      size: '1000 – 2200 sq.ft',
      type: 'Residential Plots',
      gradientSeed: 3
    },
    {
      name: 'Ponni Hill Crest',
      location: 'Thondamuthur',
      status: 'upcoming',
      plots: '98 Plots',
      size: '1800 – 4000 sq.ft',
      type: 'Villa Plots',
      gradientSeed: 4
    },
    {
      name: 'Ponni Garden Row',
      location: 'Neelambur',
      status: 'completed',
      plots: '120 Plots',
      size: '1150 – 2000 sq.ft',
      type: 'Residential Plots',
      gradientSeed: 5
    }
  ];

  const grid = document.getElementById('projectGrid');

  function projectCardMarkup(p) {
    return `
      <article class="project-card" data-status="${p.status}">
        <div class="project-media">
          <image src="RiversiteImage.jpg" alt="${p.name}" class="project-image"/>
          <svg class="project-bg" width="300" height="200" viewBox="0 0 300 200" fill="none">
            <defs>
              <linearGradient id="pg${p.gradientSeed}" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#0E84BD"/>
                <stop offset="50%" stop-color="#9AA68F"/>
                <stop offset="100%" stop-color="#F2A52C"/>
              </linearGradient>
            </defs>
            <rect width="300" height="200" fill="url(#pg${p.gradientSeed})"/>
            <path d="M0 150 Q 75 110 150 140 T 300 130 V 200 H 0 Z" fill="rgba(255,255,255,0.14)"/>
            <path d="M0 170 Q 80 145 150 165 T 300 160 V 200 H 0 Z" fill="rgba(255,255,255,0.18)"/>
          </svg>
          <span class="project-badge ${p.status}">${p.status}</span>
        </div>
        <div class="project-body">
          <h3 class="project-name">${p.name}</h3>
          <p class="project-loc">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 22s7-7.5 7-13a7 7 0 10-14 0c0 5.5 7 13 7 13z" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="9" r="2.4" stroke="currentColor" stroke-width="1.6"/></svg>
            ${p.location}
          </p>
          <div class="project-stats">
            <div class="project-stat">
              <span class="num">${p.plots}</span>
              <span class="lbl">Total Plots</span>
            </div>
            <div class="project-stat">
              <span class="num">${p.type}</span>
              <span class="lbl">Property Type</span>
            </div>
          </div>
          <p class="project-stat" style="margin-bottom:18px;">
            <span class="num" style="display:block;">${p.size}</span>
            <span class="lbl">Available Size</span>
          </p>
          <a href="#contact" class="project-link">
            Enquire Now
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </a>
        </div>
      </article>
    `;
  }

  function renderProjects(filter = 'all') {
    if (!grid) return;
    const filtered = filter === 'all' ? PROJECTS : PROJECTS.filter(p => p.status === filter);
    grid.innerHTML = filtered.map(projectCardMarkup).join('');

    // re-observe newly injected cards for reveal animation
    if ('IntersectionObserver' in window) {
      const cards = grid.querySelectorAll('.project-card');
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      cards.forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity .5s cubic-bezier(.22,.61,.36,1) ${i * 0.06}s, transform .5s cubic-bezier(.22,.61,.36,1) ${i * 0.06}s`;
        io.observe(card);
        requestAnimationFrame(() => requestAnimationFrame(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }));
      });
    }
  }

  renderProjects('all');

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      renderProjects(btn.dataset.filter);
    });
  });

  const ctaViewAll = document.getElementById('ctaViewAll');
  if (ctaViewAll) {
    ctaViewAll.addEventListener('click', () => {
      document.querySelector('.tab-btn[data-filter="all"]')?.click();
      grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }


  /* ---------------------------------------------------------------------
     7. Testimonial carousel (scroll-snap track + dots + autoplay)
  --------------------------------------------------------------------- */
  const track = document.getElementById('testimonialTrack');
  const dotsWrap = document.getElementById('testimonialDots');

  if (track && dotsWrap) {
    const cards = Array.from(track.children);
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 't-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      dot.addEventListener('click', () => {
        track.scrollTo({ left: cards[i].offsetLeft, behavior: 'smooth' });
      });
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function setActiveDot() {
      const idx = Math.round(track.scrollLeft / track.clientWidth);
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    }
    track.addEventListener('scroll', () => {
      window.requestAnimationFrame(setActiveDot);
    }, { passive: true });

    // gentle autoplay, pauses on hover/touch
    let autoplayTimer = null;
    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(() => {
        const idx = Math.round(track.scrollLeft / track.clientWidth);
        const next = (idx + 1) % cards.length;
        track.scrollTo({ left: cards[next].offsetLeft, behavior: 'smooth' });
      }, 5500);
    }
    function stopAutoplay() {
      if (autoplayTimer) clearInterval(autoplayTimer);
    }
    track.addEventListener('mouseenter', stopAutoplay);
    track.addEventListener('mouseleave', startAutoplay);
    track.addEventListener('touchstart', stopAutoplay, { passive: true });
    startAutoplay();
  }


  /* ---------------------------------------------------------------------
     8. Form validation helpers
  --------------------------------------------------------------------- */
  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }
  function isValidPhone(value) {
    return /^[6-9]\d{9}$/.test(value.trim().replace(/\D/g, '').slice(-10));
  }

  function setError(input, msgEl, message) {
    input.classList.toggle('invalid', Boolean(message));
    if (msgEl) msgEl.textContent = message || '';
  }


  /* ---------------------------------------------------------------------
     9. Main enquiry form (in CTA band)
  --------------------------------------------------------------------- */
  const enquiryForm = document.getElementById('enquiryForm');
  const formSuccess = document.getElementById('formSuccess');

  if (enquiryForm) {
    const nameInput = document.getElementById('fName');
    const emailInput = document.getElementById('fEmail');
    const phoneInput = document.getElementById('fPhone');
    const projectInput = document.getElementById('fProject');

    enquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      if (!nameInput.value.trim()) {
        setError(nameInput, document.getElementById('err-name'), 'Please enter your name.');
        valid = false;
      } else {
        setError(nameInput, document.getElementById('err-name'), '');
      }

      if (!isValidEmail(emailInput.value)) {
        setError(emailInput, document.getElementById('err-email'), 'Enter a valid email address.');
        valid = false;
      } else {
        setError(emailInput, document.getElementById('err-email'), '');
      }

      if (!isValidPhone(phoneInput.value)) {
        setError(phoneInput, document.getElementById('err-phone'), 'Enter a valid 10-digit mobile number.');
        valid = false;
      } else {
        setError(phoneInput, document.getElementById('err-phone'), '');
      }

      if (!projectInput.value) {
        setError(projectInput, document.getElementById('err-project'), 'Please select a project.');
        valid = false;
      } else {
        setError(projectInput, document.getElementById('err-project'), '');
      }

      if (!valid) return;

      // Simulate submission (no backend wired up — replace with real endpoint)
      const submitBtn = document.getElementById('formSubmitBtn');
      submitBtn.querySelector('.btn-text').textContent = 'Sending…';
      submitBtn.disabled = true;

      setTimeout(() => {
        formSuccess.classList.add('show');
        enquiryForm.reset();
        submitBtn.querySelector('.btn-text').textContent = 'Request a Callback';
        submitBtn.disabled = false;
        setTimeout(() => formSuccess.classList.remove('show'), 6000);
      }, 700);
    });

    // live-clear errors as user types/selects
    [nameInput, emailInput, phoneInput, projectInput].forEach(input => {
      input.addEventListener('input', () => input.classList.remove('invalid'));
      input.addEventListener('change', () => input.classList.remove('invalid'));
    });
  }


  /* ---------------------------------------------------------------------
     10. Modal (mobile-friendly quick enquiry)
  --------------------------------------------------------------------- */
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  const modalForm = document.getElementById('modalForm');
  const modalSuccess = document.getElementById('modalSuccess');
  const openers = [document.getElementById('ctaOpenForm'), document.getElementById('ctaHeroVisit')];

  function openModal() {
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    modalOverlay.querySelector('input')?.focus();
  }
  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  openers.forEach(btn => btn && btn.addEventListener('click', openModal));
  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal();
  });

  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = modalForm.querySelector('[name="name"]');
      const phone = modalForm.querySelector('[name="phone"]');
      const project = modalForm.querySelector('[name="project"]');
      let valid = true;

      [name, phone, project].forEach(el => el.classList.remove('invalid'));

      if (!name.value.trim()) { name.classList.add('invalid'); valid = false; }
      if (!isValidPhone(phone.value)) { phone.classList.add('invalid'); valid = false; }
      if (!project.value) { project.classList.add('invalid'); valid = false; }

      if (!valid) return;

      modalSuccess.classList.add('show');
      modalForm.reset();
      setTimeout(() => {
        modalSuccess.classList.remove('show');
        closeModal();
      }, 1800);
    });
  }

});
