/**
 * script.js — Portfolio Développeur BTS SIO SLAM
 * 
 * Rôle : Logique d'interaction front-end native (Vanilla JavaScript).
 * Aucune dépendance externe.
 * 
 * Fonctionnalités gérées :
 * 1. Menu burger responsive (ouverture / fermeture accessible)
 * 2. Scrollspy (détection automatique de la section active dans le menu)
 * 3. Fermeture automatique du menu lors d'un clic sur une ancre
 * 4. Démonstration de validation et retour visuel du formulaire de contact
 * 5. Année dynamique dans le copyright du footer
 */

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // 1. GESTION DU MENU MOBILE (BURGER)
  // --------------------------------------------------------------------------
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    // Écouteur de clic sur le bouton toggle
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('is-open');
      
      // Bascule des classes et des attributs d'accessibilité ARIA
      navMenu.classList.toggle('is-open');
      navToggle.classList.toggle('is-active');
      navToggle.setAttribute('aria-expanded', !isOpen);
    });

    // Fermeture du menu mobile au clic sur n'importe quel lien interne
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('is-open')) {
          navMenu.classList.remove('is-open');
          navToggle.classList.remove('is-active');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 2. SCROLLSPY AVANCÉ (INTERSECTION OBSERVER)
  // --------------------------------------------------------------------------
  // Met en surbrillance automatique le bon lien de menu lors du défilement
  const sections = document.querySelectorAll('section[id]');

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -60% 0px', // Seuil optimisé pour déclencher au bon moment
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.classList.add('active');
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
  // 3. GESTION DU FORMULAIRE DE CONTACT
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault(); // Empêche le rechargement standard de la page

      // Vérification basique des champs requis (validation HTML5 native)
      if (!contactForm.checkValidity()) {
        formFeedback.className = 'form-feedback error';
        formFeedback.textContent = 'Veuillez remplir correctement tous les champs requis.';
        return;
      }

      // Simulation d'envoi (placeholder en l'absence d'un backend actif)
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      submitBtn.disabled = true;
      submitBtn.textContent = 'Envoi en cours...';

      // Simulation d'un délai réseau de 800ms
      setTimeout(() => {
        formFeedback.className = 'form-feedback success';
        formFeedback.textContent = 'Merci pour votre message ! Je vous répondrai dans les plus brefs délais.';
        
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;

        // Effacement automatique du message de succès après 6 secondes
        setTimeout(() => {
          formFeedback.textContent = '';
          formFeedback.className = 'form-feedback';
        }, 6000);
      }, 800);
    });
  }

  // --------------------------------------------------------------------------
  // 4. MISE À JOUR DYNAMIQUE DE L'ANNÉE DU FOOTER
  // --------------------------------------------------------------------------
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

});