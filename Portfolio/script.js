/**
 * Portfolio Interactive JavaScript Logic
 * Padarthi Lokesh Sai Vishnu Vardhan
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. DOM Element References
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const navItems = document.querySelectorAll('.nav-item');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const contactForm = document.getElementById('contact-form');
  const formToast = document.getElementById('form-toast');
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const copyCodeBtn = document.getElementById('copy-code-btn');
  const typingTextEl = document.getElementById('typing-text');

  // Project Modal Elements
  const projectModal = document.getElementById('project-modal');
  const modalClose = document.getElementById('project-modal-close');
  const modalCategory = document.getElementById('modal-category');
  const modalTitle = document.getElementById('modal-title');
  const modalDescription = document.getElementById('modal-description');
  const modalHighlights = document.getElementById('modal-highlights');
  const modalTech = document.getElementById('modal-tech');
  const modalGithubLink = document.getElementById('modal-github-link');

  // 2. Dynamic Typing Effect
  const roles = [
    "Full-Stack MERN Developer",
    "AI & ML Undergraduate",
    "Python & Flask Specialist",
    "SRM IST CSE Student"
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const typeEffect = () => {
    if (!typingTextEl) return;
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingTextEl.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingTextEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    let speed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentRole.length) {
      speed = 2200; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      speed = 400;
    }

    setTimeout(typeEffect, speed);
  };

  typeEffect();

  // 3. Dark / Light Theme Toggle Switcher
  const savedTheme = localStorage.getItem('lokesh-portfolio-theme') || 'dark';
  if (savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    if (themeToggleBtn) themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      if (currentTheme === 'light') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('lokesh-portfolio-theme', 'dark');
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('lokesh-portfolio-theme', 'light');
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
      }
    });
  }

  // 4. Copy Code Snippet Button
  if (copyCodeBtn) {
    copyCodeBtn.addEventListener('click', () => {
      const codeSnippet = `const developer = {
  name: 'Padarthi Lokesh',
  degree: 'B.Tech CSE (AI & ML)',
  institution: 'SRM IST',
  cgpa: '9.47 / 10',
  stack: ['MERN', 'Python', 'Flask', 'REST APIs', 'SQLite', 'AI/ML']
};`;
      navigator.clipboard.writeText(codeSnippet).then(() => {
        const orig = copyCodeBtn.innerHTML;
        copyCodeBtn.innerHTML = '<i class="fa-solid fa-check" style="color:#10b981;"></i> Copied!';
        setTimeout(() => {
          copyCodeBtn.innerHTML = orig;
        }, 2000);
      });
    });
  }

  // 5. Navbar Scroll Effect & Active Link Highlight
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navItems.forEach((item) => {
          item.classList.remove('active');
          if (item.getAttribute('href') === `#${sectionId}`) {
            item.classList.add('active');
          }
        });
      }
    });
  });

  // 6. Mobile Hamburger Menu
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
  });

  navItems.forEach((item) => {
    item.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
    });
  });

  // 7. Project Category Filtering
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');

        if (filterValue === 'all' || filterValue === category) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // 8. Project Details Modal Logic
  const projectDetailsMap = {
    "Stock-AI-Pro — AI Stock Predictor": {
      category: "Python & SQLite",
      description: "Developed a comprehensive financial web application using Python, Flask, HTML, CSS, JavaScript, and SQLite to analyze historical stock market trends and display prediction-based insights.",
      highlights: [
        "Integrated statistical and prediction models to process raw historical stock ticker data.",
        "Built responsive UI dashboards displaying price trends, market indicators, and search tools.",
        "Connected Flask routing logic with SQLite database tables for historical data persistence."
      ],
      tech: ["Python", "Flask", "SQLite", "JavaScript", "HTML5", "CSS3"],
      github: "https://github.com/lokeshpadarthi07-collab/Stock-AI-Pro---AI-Stock-Predictor"
    },
    "Hospital Bed ICU Allocation System": {
      category: "Python & Flask",
      description: "A specialized healthcare resource allocation platform built with Python and Flask to streamline real-time hospital bed and ICU room management during high demand scenarios.",
      highlights: [
        "Designed real-time tracking logic for emergency bed availability and allocation status.",
        "Engineered clean REST endpoints connecting frontend form inputs with backend allocation algorithms.",
        "Implemented intuitive administrative controls for hospital staff to manage occupancy."
      ],
      tech: ["Python", "Flask", "HTML5", "CSS3", "REST Logic"],
      github: "https://github.com/lokeshpadarthi07-collab"
    },
    "Chase the Number": {
      category: "JavaScript Web App",
      description: "An interactive, logic-focused web game application built using pure vanilla JavaScript, DOM APIs, and CSS3 animations to challenge users with sequential pattern challenges.",
      highlights: [
        "Constructed dynamic game loops and state tracking algorithms in pure JavaScript.",
        "Created responsive visual feedback animations for sequential number selections.",
        "Optimized user interactions and DOM manipulation speed for zero latency."
      ],
      tech: ["JavaScript", "DOM API", "HTML5", "CSS3"],
      github: "https://github.com/lokeshpadarthi07-collab"
    }
  };

  projectCards.forEach((card) => {
    const titleEl = card.querySelector('.project-title');
    if (!titleEl) return;
    const titleText = titleEl.textContent.trim();

    card.addEventListener('click', (e) => {
      // Don't open modal if clicking direct github external link button
      if (e.target.closest('.project-footer a')) return;

      const details = projectDetailsMap[titleText];
      if (details && projectModal) {
        modalCategory.textContent = details.category;
        modalTitle.textContent = titleText;
        modalDescription.textContent = details.description;

        modalHighlights.innerHTML = details.highlights
          .map((item) => `<li>${item}</li>`)
          .join('');

        modalTech.innerHTML = details.tech
          .map((t) => `<span>${t}</span>`)
          .join('');

        modalGithubLink.href = details.github;
        projectModal.classList.add('show');
      }
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      projectModal.classList.remove('show');
    });
  }

  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        projectModal.classList.remove('show');
      }
    });
  }

  // 9. Contact Form Validation & Submission
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const subjectInput = document.getElementById('subject');
      const messageInput = document.getElementById('message');

      const validateField = (input, group, condition) => {
        if (!condition) {
          group.classList.add('error');
          isValid = false;
        } else {
          group.classList.remove('error');
        }
      };

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      validateField(nameInput, nameInput.closest('.form-group'), nameInput.value.trim() !== '');
      validateField(emailInput, emailInput.closest('.form-group'), emailRegex.test(emailInput.value.trim()));
      validateField(subjectInput, subjectInput.closest('.form-group'), subjectInput.value.trim() !== '');
      validateField(messageInput, messageInput.closest('.form-group'), messageInput.value.trim() !== '');

      if (isValid) {
        const submitBtn = document.getElementById('submit-btn');
        const originalText = submitBtn.innerHTML;

        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Sending...`;

        setTimeout(() => {
          contactForm.reset();
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;

          formToast.classList.add('show');
          setTimeout(() => {
            formToast.classList.remove('show');
          }, 5000);
        }, 1200);
      }
    });
  }

  // 10. Scroll Observer
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('appear');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in, .timeline-item, .project-card, .stat-card, .cert-card').forEach((el) => {
    observer.observe(el);
  });
});
