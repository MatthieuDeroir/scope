// === ADVANCED ANIMATIONS ===

class AnimationController {
  constructor() {
    this.isLoaded = false;
    this.scrollElements = [];
    this.parallaxElements = [];
    this.init();
  }

  init() {
    this.setupParallaxEffects();
    this.setupHoverAnimations();
    this.setupScrollAnimations();
    this.setupLoadingAnimations();
    this.setupCursorEffects();

    // Initialize after DOM is fully loaded
    window.addEventListener('load', () => {
      this.isLoaded = true;
      this.startAnimations();
    });
  }

  // Parallax effects for hero section
  setupParallaxEffects() {
    const heroParticles = document.querySelector('.hero-particles');
    if (heroParticles) {
      window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        heroParticles.style.transform = `translateY(${rate}px)`;
      });
    }

    // Parallax for methodology graphic
    const methodologyGraphic = document.querySelector('.methodology-graphic');
    if (methodologyGraphic) {
      window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const element = methodologyGraphic.getBoundingClientRect();
        const rate = (scrolled - element.top) * 0.2;
        methodologyGraphic.style.transform = `translateY(${rate}px) scale(${1 + rate * 0.001})`;
      });
    }
  }

  // Enhanced hover animations
  setupHoverAnimations() {
    // Article cards
    document.querySelectorAll('.article-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          scale: 1.02,
          y: -10,
          duration: 0.3,
          ease: "power2.out"
        });

        // Animate image
        const image = card.querySelector('.article-image');
        if (image) {
          gsap.to(image, {
            scale: 1.1,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out"
        });

        const image = card.querySelector('.article-image');
        if (image) {
          gsap.to(image, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      });
    });

    // Dossier cards
    document.querySelectorAll('.dossier-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        const icon = card.querySelector('.dossier-icon');
        gsap.to(icon, {
          scale: 1.2,
          rotation: 10,
          duration: 0.3,
          ease: "back.out(1.7)"
        });
      });

      card.addEventListener('mouseleave', () => {
        const icon = card.querySelector('.dossier-icon');
        gsap.to(icon, {
          scale: 1,
          rotation: 0,
          duration: 0.3,
          ease: "back.out(1.7)"
        });
      });
    });

    // Button hover effects
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        gsap.to(btn, {
          scale: 1.05,
          duration: 0.2,
          ease: "power2.out"
        });
      });

      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          scale: 1,
          duration: 0.2,
          ease: "power2.out"
        });
      });
    });

    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('mouseenter', () => {
        gsap.to(link, {
          y: -2,
          duration: 0.2,
          ease: "power2.out"
        });
      });

      link.addEventListener('mouseleave', () => {
        gsap.to(link, {
          y: 0,
          duration: 0.2,
          ease: "power2.out"
        });
      });
    });
  }

  // Advanced scroll animations
  setupScrollAnimations() {
    // Stagger animation for cards
    this.createStaggerAnimation('.article-card', 0.1);
    this.createStaggerAnimation('.dossier-card', 0.15);
    this.createStaggerAnimation('.step-item', 0.2);

    // Text reveal animations
    this.setupTextRevealAnimations();

    // Progress bar animation
    this.setupProgressBar();

    // Section transitions
    this.setupSectionTransitions();
  }

  createStaggerAnimation(selector, stagger) {
    const elements = document.querySelectorAll(selector);

    elements.forEach(element => {
      gsap.set(element, {
        opacity: 0,
        y: 50,
        scale: 0.9
      });
    });

    ScrollTrigger.batch(elements, {
      onEnter: (elements) => {
        gsap.to(elements, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: stagger,
          ease: "back.out(1.2)"
        });
      },
      onLeave: (elements) => {
        gsap.to(elements, {
          opacity: 0,
          y: -50,
          scale: 0.9,
          duration: 0.3,
          stagger: stagger / 2
        });
      },
      onEnterBack: (elements) => {
        gsap.to(elements, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: stagger,
          ease: "back.out(1.2)"
        });
      }
    });
  }

  setupTextRevealAnimations() {
    // Split text animation for titles
    document.querySelectorAll('.section-title').forEach(title => {
      const text = title.textContent;
      title.innerHTML = '';

      text.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        span.style.transform = 'translateY(50px)';
        title.appendChild(span);
      });

      ScrollTrigger.create({
        trigger: title,
        start: "top 80%",
        onEnter: () => {
          gsap.to(title.children, {
            opacity: 1,
            y: 0,
            duration: 0.05,
            stagger: 0.02,
            ease: "power2.out"
          });
        }
      });
    });
  }

  setupProgressBar() {
    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.innerHTML = '<div class="progress-fill"></div>';
    document.body.appendChild(progressBar);

    const progressFill = progressBar.querySelector('.progress-fill');

    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;

      progressFill.style.width = `${scrollPercent}%`;
    });
  }

  setupSectionTransitions() {
    // Smooth section transitions
    const sections = document.querySelectorAll('section');

    sections.forEach((section, index) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        onEnter: () => {
          section.classList.add('active-section');
          this.updateNavigation(section);
        },
        onLeave: () => {
          section.classList.remove('active-section');
        },
        onEnterBack: () => {
          section.classList.add('active-section');
          this.updateNavigation(section);
        }
      });
    });
  }

  updateNavigation(activeSection) {
    const navLinks = document.querySelectorAll('.nav-link');
    const sectionId = activeSection.id;

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${sectionId}`) {
        link.classList.add('active');
      }
    });
  }

  // Loading animations
  setupLoadingAnimations() {
    // Page load animation
    const loadingOverlay = this.createLoadingOverlay();

    window.addEventListener('load', () => {
      setTimeout(() => {
        this.hideLoadingOverlay(loadingOverlay);
        this.startPageAnimations();
      }, 1000);
    });
  }

  createLoadingOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
            <div class="loading-content">
                <div class="loading-logo">MetaScope</div>
                <div class="loading-progress">
                    <div class="loading-bar"></div>
                </div>
                <div class="loading-text">Chargement des analyses...</div>
            </div>
        `;
    document.body.appendChild(overlay);

    // Animate loading bar
    const loadingBar = overlay.querySelector('.loading-bar');
    gsap.to(loadingBar, {
      width: '100%',
      duration: 2,
      ease: "power2.inOut"
    });

    return overlay;
  }

  hideLoadingOverlay(overlay) {
    gsap.to(overlay, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
      onComplete: () => {
        overlay.remove();
      }
    });
  }

  startPageAnimations() {
    // Animate header
    gsap.from('.main-header', {
      y: -100,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    });

    // Start hero animations (these are handled in main.js)
    this.triggerHeroAnimations();
  }

  triggerHeroAnimations() {
    // This method can be called from main.js
    const event = new CustomEvent('heroAnimationStart');
    document.dispatchEvent(event);
  }

  // Cursor effects
  setupCursorEffects() {
    // Custom cursor
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    cursor.appendChild(cursorDot);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Smooth cursor follow
    const animateCursor = () => {
      cursorX += (mouseX - cursorX) * 0.1;
      cursorY += (mouseY - cursorY) * 0.1;

      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // Cursor interactions
    const interactiveElements = document.querySelectorAll('a, button, .article-card, .dossier-card');

    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-hover');
      });

      element.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-hover');
      });
    });
  }

  // Magnetic effect for buttons
  setupMagneticEffects() {
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(btn, {
          x: x * 0.2,
          y: y * 0.2,
          duration: 0.3,
          ease: "power2.out"
        });
      });

      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "elastic.out(1, 0.5)"
        });
      });
    });
  }

  // Scroll-triggered animations for specific elements
  setupSpecialAnimations() {
    // Floating elements
    this.createFloatingAnimation('.methodology-graphic');

    // Rotate on scroll
    this.createRotateAnimation('.dossier-icon');

    // Scale on scroll
    this.createScaleAnimation('.stat-number');
  }

  createFloatingAnimation(selector) {
    const elements = document.querySelectorAll(selector);

    elements.forEach(element => {
      gsap.to(element, {
        y: -20,
        duration: 3,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1
      });
    });
  }

  createRotateAnimation(selector) {
    const elements = document.querySelectorAll(selector);

    elements.forEach(element => {
      ScrollTrigger.create({
        trigger: element,
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1,
        onUpdate: (self) => {
          const rotation = self.progress * 360;
          element.style.transform = `rotate(${rotation}deg)`;
        }
      });
    });
  }

  createScaleAnimation(selector) {
    const elements = document.querySelectorAll(selector);

    elements.forEach(element => {
      ScrollTrigger.create({
        trigger: element,
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1,
        onUpdate: (self) => {
          const scale = 1 + (self.progress * 0.2);
          element.style.transform = `scale(${scale})`;
        }
      });
    });
  }

  // Performance optimizations
  startAnimations() {
    // Only start heavy animations if the user hasn't indicated preference for reduced motion
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.setupMagneticEffects();
      this.setupSpecialAnimations();
    }
  }

  // Public methods for external control
  pauseAnimations() {
    ScrollTrigger.getAll().forEach(trigger => trigger.disable());
  }

  resumeAnimations() {
    ScrollTrigger.getAll().forEach(trigger => trigger.enable());
  }

  refreshAnimations() {
    ScrollTrigger.refresh();
  }
}

// Animation styles are now in animations.css

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize if GSAP is available
  if (typeof gsap !== 'undefined') {
    window.animationController = new AnimationController();
  } else {
    console.warn('GSAP not loaded, advanced animations disabled');
  }
});

// Export for external use
window.AnimationController = AnimationController;
