/**
 * Rizwan Ansari Portfolio Application Logic
 * Accessible Modal, Theme Switcher, Smooth Navigation & Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initProjectModal();
});

/* --------------------------------------------------------------------------
   Theme Switcher (System Preference + LocalStorage Override)
   -------------------------------------------------------------------------- */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const sunIcon = document.getElementById('theme-icon-sun');
  const moonIcon = document.getElementById('theme-icon-moon');
  const root = document.documentElement;

  // Retrieve stored theme or fall back to system
  const savedTheme = localStorage.getItem('theme-preference');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  let currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  applyTheme(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme-preference', currentTheme);
      applyTheme(currentTheme);
    });
  }

  // Listen for system theme changes if user has not set an explicit override
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme-preference')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }
    if (sunIcon && moonIcon) {
      if (theme === 'dark') {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
      } else {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
      }
    }
  }
}

/* --------------------------------------------------------------------------
   Navigation & Scroll Spy
   -------------------------------------------------------------------------- */
function initNavigation() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Mobile toggle
  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
    });

    // Close mobile menu on clicking a nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // IntersectionObserver for active link highlighting
  const sections = document.querySelectorAll('section[id]');
  if ('IntersectionObserver' in window && sections.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    });

    sections.forEach(section => observer.observe(section));
  }
}

/* --------------------------------------------------------------------------
   Case Study Modal Dialog (<dialog>)
   -------------------------------------------------------------------------- */
function initProjectModal() {
  const modal = document.getElementById('project-modal');
  if (!modal) return;

  const closeBtn = document.getElementById('modal-close-btn');
  const closeFooterBtn = document.getElementById('modal-footer-close-btn');

  // Read projects data embedded in HTML
  let projectsData = {};
  const dataScript = document.getElementById('projects-data');
  if (dataScript) {
    try {
      projectsData = JSON.parse(dataScript.textContent);
    } catch (err) {
      console.error('Failed to parse projects data JSON', err);
    }
  }

  // Bind click handlers to "View Case Study" buttons
  const triggerBtns = document.querySelectorAll('[data-project-id]');
  triggerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const projectId = btn.getAttribute('data-project-id');
      const project = projectsData[projectId];
      if (project) {
        populateAndOpenModal(project, btn);
      }
    });
  });

  function populateAndOpenModal(project, triggerElement) {
    const categoryEl = document.getElementById('modal-project-category');
    const titleEl = document.getElementById('modal-project-title');
    const problemEl = document.getElementById('modal-problem');
    const buildEl = document.getElementById('modal-what-built');
    const toolsEl = document.getElementById('modal-tools');
    const outcomeEl = document.getElementById('modal-outcome');
    const linkEl = document.getElementById('modal-external-link');

    if (categoryEl) categoryEl.textContent = project.category || 'Featured Project';
    if (titleEl) titleEl.textContent = project.title || '';
    if (problemEl) problemEl.textContent = project.caseStudy?.problem || '';
    if (buildEl) buildEl.textContent = project.caseStudy?.whatIBuilt || '';

    // Tools tags
    if (toolsEl) {
      toolsEl.innerHTML = '';
      (project.caseStudy?.tools || []).forEach(tool => {
        const span = document.createElement('span');
        span.className = 'badge badge-tag';
        span.textContent = tool;
        toolsEl.appendChild(span);
      });
    }

    // Outcome
    if (outcomeEl) {
      outcomeEl.textContent = project.caseStudy?.outcome || '';
    }

    // External link
    if (linkEl) {
      const url = project.caseStudy?.link;
      if (url && url.startsWith('http')) {
        linkEl.href = url;
        linkEl.style.display = 'inline-flex';
        linkEl.textContent = 'View Live Project';
      } else {
        linkEl.style.display = 'none';
      }
    }

    // Show native dialog modal
    if (typeof modal.showModal === 'function') {
      modal.showModal();
      document.body.style.overflow = 'hidden';
    } else {
      modal.setAttribute('open', '');
    }

    // Store trigger element to restore focus on close
    modal._triggerElement = triggerElement;
  }

  function closeModal() {
    if (typeof modal.close === 'function') {
      modal.close();
    } else {
      modal.removeAttribute('open');
    }
    document.body.style.overflow = '';
    if (modal._triggerElement) {
      modal._triggerElement.focus();
    }
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (closeFooterBtn) closeFooterBtn.addEventListener('click', closeModal);

  // Close when clicking on dialog backdrop
  modal.addEventListener('click', (event) => {
    const rect = modal.getBoundingClientRect();
    const isInDialog = (
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width
    );
    if (!isInDialog) {
      closeModal();
    }
  });

  // Re-enable body scroll if closed via Esc key
  modal.addEventListener('close', () => {
    document.body.style.overflow = '';
    if (modal._triggerElement) {
      modal._triggerElement.focus();
    }
  });
}
