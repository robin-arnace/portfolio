/**
 * script.js — Portfolio BTS SIO SLAM
 * 
 * Rôle :
 * 1. Lueur souris & trame hexagonale interactive
 * 2. Gestion universelle et homogène des bordures et séparateurs (.glow-border-card)
 * 3. Bouton flottant "Remonter en haut" ciblant le sommet (#top)
 * 4. Apparition fluide au défilement (Scroll reveal) répétable
 * 5. Puce de progression de la barre latérale et navigation responsive
 */

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // 1. LUEUR SOURIS & TRACE HEXAGONALE INTERACTIVE
  // --------------------------------------------------------------------------
  const cursorGlow = document.getElementById('cursor-glow');
  const hexInteractive = document.getElementById('hex-bg-interactive');

  window.addEventListener('mousemove', (e) => {
    if (cursorGlow) {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    }

    if (hexInteractive) {
      hexInteractive.style.setProperty('--screen-x', `${e.clientX}px`);
      hexInteractive.style.setProperty('--screen-y', `${e.clientY}px`);
    }
  });

  if (cursorGlow) {
    window.addEventListener('mousedown', (e) => {
      if (e.button === 0) {
        cursorGlow.classList.add('clicking');
      }
    });

    window.addEventListener('mouseup', (e) => {
      if (e.button === 0) {
        cursorGlow.classList.remove('clicking');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 2. CONTOURS & SÉPARATEURS RÉACTIFS STRICTEMENT HOMOGÈNES (.glow-border-card)
  // --------------------------------------------------------------------------
  const glowBorderCards = document.querySelectorAll('.glow-border-card');

  if (glowBorderCards.length > 0) {
    let ticking = false;

    window.addEventListener('mousemove', (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          glowBorderCards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
          });
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // --------------------------------------------------------------------------
  // 3. REMONTÉE TOUT EN HAUT (BOUTON HAUT ET LIEN ACCUEIL / LOGO)
  // --------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('back-to-top');
  const topLinks = document.querySelectorAll('a[href="#top"]');

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('is-visible');
      } else {
        backToTopBtn.classList.remove('is-visible');
      }
    }, { passive: true });
  }

  topLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  });

  // --------------------------------------------------------------------------
  // 4. APPARITION AU DÉFILEMENT (SCROLL REVEAL RÉPÉTABLE)
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal-item');

  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
        } else {
          entry.target.classList.remove('is-revealed');
        }
      });
    }, {
      root: null,
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // --------------------------------------------------------------------------
  // 5. PARCOURS : FOCUS DE SURVOL CIBLÉ SUR LES CARTES
  // --------------------------------------------------------------------------
  const centerTimeline = document.getElementById('center-timeline');
  const timelineCards = document.querySelectorAll('.center-timeline .entry-card');

  if (centerTimeline && timelineCards.length > 0) {
    timelineCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        centerTimeline.classList.add('has-entry-hover');
      });
      card.addEventListener('mouseleave', () => {
        centerTimeline.classList.remove('has-entry-hover');
      });
    });
  }

  // --------------------------------------------------------------------------
  // 6. BARRE FLOTTANTE : SCROLLSPY & PUCE DE PROGRESSION
  // --------------------------------------------------------------------------
  const menuLinks = document.querySelectorAll('.menu-link');
  const sections = document.querySelectorAll('section[id]');
  const indicatorDot = document.getElementById('nav-indicator-dot');
  const navTrack = document.querySelector('.nav-track');

  const updateIndicator = (activeLink) => {
    if (!indicatorDot || !navTrack || !activeLink) return;

    const trackRect = navTrack.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();

    const relativePosition = linkRect.top - trackRect.top + (linkRect.height / 2) - (indicatorDot.offsetHeight / 2);
    indicatorDot.style.transform = `translateY(${Math.max(0, relativePosition)}px)`;
  };

  if ('IntersectionObserver' in window && sections.length > 0) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');

          menuLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${id}` || (id === 'hero' && href === '#top')) {
              link.classList.add('active');
              updateIndicator(link);
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      root: null,
      rootMargin: '-30% 0px -50% 0px',
      threshold: 0
    });

    sections.forEach(section => sectionObserver.observe(section));
  }

  // --------------------------------------------------------------------------
  // 7. MENU MOBILE (BURGER)
  // --------------------------------------------------------------------------
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      const isOpen = sidebar.classList.contains('is-open');
      sidebar.classList.toggle('is-open');
      sidebarToggle.setAttribute('aria-expanded', !isOpen);
    });

    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (sidebar.classList.contains('is-open')) {
          sidebar.classList.remove('is-open');
          sidebarToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 8. FORMULAIRE DE CONTACT
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const feedbackMsg = document.getElementById('form-feedback-msg');

  if (contactForm && feedbackMsg) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = contactForm.querySelector('button[type="submit"]');
      const defaultText = btn.textContent;

      btn.disabled = true;
      btn.textContent = 'Transmission...';

      setTimeout(() => {
        feedbackMsg.className = 'form-feedback-msg success';
        feedbackMsg.textContent = 'Message envoyé avec succès.';
        
        contactForm.reset();
        btn.disabled = false;
        btn.textContent = defaultText;

        setTimeout(() => {
          feedbackMsg.textContent = '';
          feedbackMsg.className = 'form-feedback-msg';
        }, 5000);
      }, 700);
    });
  }

  // --------------------------------------------------------------------------
  // 9. ANNÉE DU FOOTER
  // --------------------------------------------------------------------------
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

});