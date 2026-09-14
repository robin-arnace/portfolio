/**
 * script.js — Portfolio BTS SIO SLAM
 * 
 * Rôle : Logique native Vanilla JS
 * 1. Suivi de souris & feedback au clic (lueur réactive)
 * 2. Progression dynamique de la barre latérale (indicateur à puce mobile)
 * 3. Menu mobile burger
 * 4. Validation et retour utilisateur du formulaire
 */

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // 1. LUEUR SUIVEUSE DE SOURIS
  // --------------------------------------------------------------------------
  const cursorGlow = document.getElementById('cursor-glow');

  if (cursorGlow) {
    // Déplacement fluide
    window.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    });

    // Rétroaction visuelle au clic (intensification)
    window.addEventListener('mousedown', () => {
      cursorGlow.classList.add('clicking');
    });

    window.addEventListener('mouseup', () => {
      cursorGlow.classList.remove('clicking');
    });
  }

  // --------------------------------------------------------------------------
  // 2. BARRE LATÉRALE : SCROLLSPY & DÉPLACEMENT DE LA PUCE DE PROGRESSION
  // --------------------------------------------------------------------------
  const menuLinks = document.querySelectorAll('.menu-link');
  const sections = document.querySelectorAll('section[id]');
  const indicatorDot = document.getElementById('nav-indicator-dot');
  const sidebarNav = document.querySelector('.sidebar-nav');

  /**
   * Repositionne la puce défilante en face du lien actif dans la barre
   */
  const updateIndicatorPosition = (activeLink) => {
    if (!indicatorDot || !sidebarNav || !activeLink) return;
    
    // Calcul de la distance relative du lien par rapport au conteneur de navigation
    const navRect = sidebarNav.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();
    const relativeTop = linkRect.top - navRect.top + (linkRect.height / 2) - (indicatorDot.offsetHeight / 2);

    indicatorDot.style.transform = `translateY(${Math.max(0, relativeTop)}px)`;
  };

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -55% 0px', // Détection équilibrée sur grand et petit écran
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          
          menuLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.classList.add('active');
              updateIndicatorPosition(link);
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));
  }

  // --------------------------------------------------------------------------
  // 3. BARRE LATÉRALE SUR MOBILE (BURGER)
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
  // 4. FORMULAIRE DE CONTACT (FEEDBACK VISUEL)
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const formAlert = document.getElementById('form-alert');

  if (contactForm && formAlert) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      submitBtn.disabled = true;
      submitBtn.textContent = 'Transmission...';

      // Simulation d'envoi réseau
      setTimeout(() => {
        formAlert.className = 'form-alert success';
        formAlert.textContent = 'Message envoyé avec succès. Je vous répondrai sous 24h.';
        
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;

        setTimeout(() => {
          formAlert.textContent = '';
          formAlert.className = 'form-alert';
        }, 5000);
      }, 700);
    });
  }

  // --------------------------------------------------------------------------
  // 5. ANNÉE DU FOOTER
  // --------------------------------------------------------------------------
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

});