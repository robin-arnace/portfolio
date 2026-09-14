/**
 * script.js — Portfolio BTS SIO SLAM
 * 
 * Rôle :
 * 1. Suivi de souris adouci & isolation de l'effet clic sur le bouton gauche
 * 2. Positionnement dynamique de la puce de progression dans la barre flottante centrée
 * 3. Menu responsive mobile
 * 4. Traitement et retour visuel du formulaire
 */

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // 1. LUEUR SUIVEUSE DE SOURIS (RÉDUITE, MONO-ROSE, CLIC GAUCHE ISOLÉ)
  // --------------------------------------------------------------------------
  const cursorGlow = document.getElementById('cursor-glow');

  if (cursorGlow) {
    // Déplacement fluide
    window.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    });

    // Intensification réservée exclusivement au clic gauche (e.button === 0)
    window.addEventListener('mousedown', (e) => {
      if (e.button === 0) {
        cursorGlow.classList.add('clicking');
      }
    });

    // Relâchement amorti (géré par la transition CSS)
    window.addEventListener('mouseup', (e) => {
      if (e.button === 0) {
        cursorGlow.classList.remove('clicking');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 2. BARRE FLOTTANTE : SCROLLSPY & PUCE DE PROGRESSION CENTRÉE
  // --------------------------------------------------------------------------
  const menuLinks = document.querySelectorAll('.menu-link');
  const sections = document.querySelectorAll('section[id]');
  const indicatorDot = document.getElementById('nav-indicator-dot');
  const navTrack = document.querySelector('.nav-track');

  /**
   * Repositionne précisément la puce défilante en face du lien de section actif
   */
  const updateIndicator = (activeLink) => {
    if (!indicatorDot || !navTrack || !activeLink) return;

    const trackRect = navTrack.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();

    // Position relative du centre du lien par rapport à la piste
    const relativePosition = linkRect.top - trackRect.top + (linkRect.height / 2) - (indicatorDot.offsetHeight / 2);
    indicatorDot.style.transform = `translateY(${Math.max(0, relativePosition)}px)`;
  };

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -50% 0px', // Détection équilibrée
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');

          menuLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${id}`) {
              link.classList.add('active');
              updateIndicator(link);
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
  }

  // --------------------------------------------------------------------------
  // 3. MENU MOBILE (BURGER)
  // --------------------------------------------------------------------------
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      const isOpen = sidebar.classList.contains('is-open');
      sidebar.classList.toggle('is-open');
      sidebarToggle.setAttribute('aria-expanded', !isOpen);
    });

    // Fermeture automatique lors d'un clic sur une ancre
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
  // 4. FORMULAIRE DE CONTACT
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const feedbackMsg = document.getElementById('form-feedback-msg');

  if (contactForm && feedbackMsg) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = contactForm.querySelector('button[type="submit"]');
      const defaultText = btn.textContent;

      btn.disabled = true;
      btn.textContent = 'Envoi...';

      // Simulation d'envoi réseau
      setTimeout(() => {
        feedbackMsg.className = 'form-feedback-msg success';
        feedbackMsg.textContent = 'Message envoyé avec succès. Je vous répondrai sous 24h.';
        
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
  // 5. ANNÉE DYNAMIQUE DU FOOTER
  // --------------------------------------------------------------------------
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

});