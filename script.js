/**
 * script.js — Portfolio BTS SIO SLAM
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Lueur souris & trame hexagonale interactive
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

  // 2. Contours & séparateurs réactifs (.glow-border-card)
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

  // 3. Remontée en haut & liens Accueil (#top)
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

  // 4. Fenêtre modale (Popup) pour les projets professionnels
  const modalBackdrop = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('project-modal-close');
  const modalTitle = document.getElementById('modal-project-title');
  const modalText = document.getElementById('modal-project-text');
  const modalTriggers = document.querySelectorAll('.project-modal-trigger');

  const openModal = (title, text) => {
    if (modalBackdrop && modalTitle && modalText) {
      modalTitle.textContent = title;
      modalText.textContent = text;
      modalBackdrop.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = () => {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  };

  modalTriggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-modal-title');
      const text = btn.getAttribute('data-modal-text');
      openModal(title, text);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeModal();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  // 5. Apparition au défilement (Scroll reveal répétable)
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

  // 6. Parcours : focus de survol ciblé sur les cartes
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

  // 7. Barre latérale : scrollspy & puce de progression
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

  // 8. Menu mobile (burger)
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

  // 9. Formulaire de contact connecté à Formspree (via Fetch AJAX)
  const contactForm = document.getElementById('contact-form');
  const feedbackMsg = document.getElementById('form-feedback-msg');

  if (contactForm && feedbackMsg) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = contactForm.querySelector('button[type="submit"]');
      const defaultText = btn.textContent;

      btn.disabled = true;
      btn.textContent = 'Transmission...';

      try {
        const response = await fetch(contactForm.action, {
          method: contactForm.method,
          body: new FormData(contactForm),
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          feedbackMsg.className = 'form-feedback-msg success';
          feedbackMsg.textContent = 'Message envoyé avec succès ! Je vous répondrai rapidement.';
          contactForm.reset();
        } else {
          const data = await response.json();
          feedbackMsg.className = 'form-feedback-msg error';
          feedbackMsg.textContent = data.error || 'Une erreur est survenue lors de l\'envoi.';
        }
      } catch (error) {
        feedbackMsg.className = 'form-feedback-msg error';
        feedbackMsg.textContent = 'Erreur réseau. Vérifiez votre connexion.';
      } finally {
        btn.disabled = false;
        btn.textContent = defaultText;

        setTimeout(() => {
          feedbackMsg.textContent = '';
          feedbackMsg.className = 'form-feedback-msg';
        }, 6000);
      }
    });
  }

  // 10. Année du footer
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

});