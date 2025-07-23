// === MAIN JAVASCRIPT FILE ===

class MetaScopeApp {
  constructor() {
    this.data = null;
    this.searchModal = null;
    this.generateModal = null;
    this.currentTheme = localStorage.getItem('theme') || 'light';
    this.isLoading = false;

    this.init();
  }

  // Initialize the application
  async init() {
    this.setupEventListeners();
    this.setupTheme();
    this.setupMobileMenu();
    this.setupModals();
    this.setupSearch();

    // Load data and render content
    await this.loadData();
    this.renderFeaturedArticles();
    this.renderDossiers();

    // Initialize animations after content is loaded
    setTimeout(() => {
      this.initScrollAnimations();
      this.animateHero();
      this.animateStats();
    }, 100);
  }

  // Setup all event listeners
  setupEventListeners() {
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    // Search modal
    const searchBtn = document.getElementById('search-btn');
    const searchClose = document.getElementById('search-close');
    const searchModal = document.getElementById('search-modal');

    if (searchBtn) searchBtn.addEventListener('click', () => this.openSearchModal());
    if (searchClose) searchClose.addEventListener('click', () => this.closeSearchModal());
    if (searchModal) {
      searchModal.addEventListener('click', (e) => {
        if (e.target === searchModal) this.closeSearchModal();
      });
    }

    // Generate analysis modal
    const generateBtn = document.getElementById('generate-analysis-btn');
    const modalClose = document.getElementById('modal-close');
    const generateModal = document.getElementById('generate-modal');

    if (generateBtn) generateBtn.addEventListener('click', () => this.openGenerateModal());
    if (modalClose) modalClose.addEventListener('click', () => this.closeGenerateModal());
    if (generateModal) {
      generateModal.addEventListener('click', (e) => {
        if (e.target === generateModal) this.closeGenerateModal();
      });
    }

    // Form submission
    const analysisForm = document.getElementById('analysis-form');
    if (analysisForm) {
      analysisForm.addEventListener('submit', (e) => this.handleFormSubmission(e));
    }

    // Search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => this.handleSmoothScroll(e));
    });

    // Header scroll effect
    window.addEventListener('scroll', () => this.handleHeaderScroll());
  }

  // Theme management
  setupTheme() {
    document.documentElement.setAttribute('data-theme', this.currentTheme);
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    localStorage.setItem('theme', this.currentTheme);

    // Add smooth transition
    document.documentElement.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      document.documentElement.style.transition = '';
    }, 300);
  }

  // Mobile menu setup
  setupMobileMenu() {
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileToggle && navMenu) {
      mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileToggle.classList.toggle('active');
      });

      // Close menu when clicking on a link
      navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('active');
          mobileToggle.classList.remove('active');
        });
      });
    }
  }

  // Modal management
  setupModals() {
    this.searchModal = document.getElementById('search-modal');
    this.generateModal = document.getElementById('generate-modal');
  }

  openSearchModal() {
    if (this.searchModal) {
      this.searchModal.classList.add('active');
      document.body.style.overflow = 'hidden';

      // Focus search input
      setTimeout(() => {
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.focus();
      }, 100);
    }
  }

  closeSearchModal() {
    if (this.searchModal) {
      this.searchModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  openGenerateModal() {
    if (this.generateModal) {
      this.generateModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  closeGenerateModal() {
    if (this.generateModal) {
      this.generateModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Search functionality
  setupSearch() {
    this.searchResults = document.getElementById('search-results');
  }

  handleSearch(query) {
    if (!query.trim()) {
      this.searchResults.innerHTML = '';
      return;
    }

    const results = this.searchArticles(query);
    this.renderSearchResults(results);
  }

  searchArticles(query) {
    if (!this.data) return [];

    const searchQuery = query.toLowerCase();
    const results = [];

    // Search in featured articles
    this.data.featured.forEach(article => {
      if (this.matchesSearch(article, searchQuery)) {
        results.push({ ...article, type: 'article' });
      }
    });

    // Search in dossiers (including their articles)
    this.data.dossiers.forEach(dossier => {
      if (this.matchesSearch(dossier, searchQuery)) {
        results.push({ ...dossier, type: 'dossier' });
      }

      // Search in dossier articles
      if (dossier.articles) {
        dossier.articles.forEach(article => {
          if (this.matchesSearch(article, searchQuery)) {
            results.push({ ...article, type: 'article', dossier: dossier.title });
          }
        });
      }
    });

    return results.slice(0, 10); // Limit to 10 results
  }

  matchesSearch(item, query) {
    const searchFields = [
      item.title,
      item.excerpt || item.description,
      ...(item.tags || [])
    ].map(field => field?.toLowerCase() || '');

    return searchFields.some(field => field.includes(query));
  }

  renderSearchResults(results) {
    if (results.length === 0) {
      this.searchResults.innerHTML = '<p class="no-results">Aucun résultat trouvé</p>';
      return;
    }

    const resultsHTML = results.map(result => `
            <div class="search-result-item">
                <div class="result-type">${result.type === 'article' ? 'Article' : 'Dossier'}</div>
                <h4 class="result-title">${result.title}</h4>
                <p class="result-excerpt">${result.excerpt || result.description || ''}</p>
                ${result.dossier ? `<div class="result-dossier">Dans: ${result.dossier}</div>` : ''}
                <div class="result-tags">
                    ${(result.tags || []).map(tag => `<span class="result-tag">${tag}</span>`).join('')}
                </div>
            </div>
        `).join('');

    this.searchResults.innerHTML = resultsHTML;
  }

  // Data loading
  async loadData() {
    try {
      const response = await fetch('data/articles.json');
      this.data = await response.json();
    } catch (error) {
      console.error('Error loading data:', error);
      // Fallback to mock data
      this.data = this.getMockData();
    }
  }

  getMockData() {
    return {
      featured: [
        {
          id: 1,
          title: "Acétamipride en France : Entre science et politique",
          excerpt: "Analyse complète de la controverse autour de la réautorisation de l'acétamipride par la loi Duplomb du 8 juillet 2025.",
          tags: ["Pesticides", "Santé publique", "Agriculture"],
          date: "2025-07-23",
          readTime: "15 min",
          image: "acetamipride.jpg"
        },
        {
          id: 2,
          title: "Intelligence Artificielle et Emploi : Que dit la recherche ?",
          excerpt: "Meta-analyse des études récentes sur l'impact de l'IA sur le marché du travail et les transformations sectorielles.",
          tags: ["IA", "Emploi", "Économie"],
          date: "2025-07-20",
          readTime: "12 min",
          image: "ai-employment.jpg"
        },
        {
          id: 3,
          title: "Changement climatique : Consensus scientifique 2025",
          excerpt: "Synthèse des dernières publications du GIEC et analyse des modèles climatiques actuels.",
          tags: ["Climat", "Environnement", "Politique"],
          date: "2025-07-18",
          readTime: "18 min",
          image: "climate-change.jpg"
        }
      ],
      dossiers: [
        {
          id: 1,
          title: "Santé Publique",
          description: "Analyses des enjeux sanitaires contemporains basées sur les données épidémiologiques les plus récentes.",
          icon: "🏥",
          articleCount: 12,
          lastUpdate: "2025-07-23",
          articles: []
        },
        {
          id: 2,
          title: "Environnement & Climat",
          description: "Comprendre les défis environnementaux actuels à travers le prisme de la recherche scientifique.",
          icon: "🌱",
          articleCount: 8,
          lastUpdate: "2025-07-22",
          articles: []
        },
        {
          id: 3,
          title: "Technologies & Société",
          description: "Impact des innovations technologiques sur nos modes de vie et l'organisation sociale.",
          icon: "🤖",
          articleCount: 15,
          lastUpdate: "2025-07-21",
          articles: []
        },
        {
          id: 4,
          title: "Économie & Politique",
          description: "Analyse des politiques publiques et des mécanismes économiques basée sur les données factuelles.",
          icon: "📊",
          articleCount: 9,
          lastUpdate: "2025-07-20",
          articles: []
        }
      ]
    };
  }

  // Content rendering
  renderFeaturedArticles() {
    const container = document.getElementById('featured-articles');
    if (!container || !this.data?.featured) return;

    const articlesHTML = this.data.featured.map(article => `
            <article class="article-card" data-aos="fade-up">
                <div class="article-image">
                    <div class="image-placeholder" style="background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));"></div>
                </div>
                <div class="article-content">
                    <div class="article-meta">
                        ${article.tags.map(tag => `<span class="article-tag">${tag}</span>`).join('')}
                    </div>
                    <h3 class="article-title">${article.title}</h3>
                    <p class="article-excerpt">${article.excerpt}</p>
                    <div class="article-footer">
                        <span class="article-date">${this.formatDate(article.date)}</span>
                        <a href="article.html?id=${article.id}" class="read-more">
                            Lire l'article
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M5 12h14m-7-7l7 7-7 7"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </article>
        `).join('');

    container.innerHTML = articlesHTML;
  }

  renderDossiers() {
    const container = document.getElementById('dossiers-grid');
    if (!container || !this.data?.dossiers) return;

    const dossiersHTML = this.data.dossiers.map(dossier => `
            <div class="dossier-card" data-aos="fade-up">
                <div class="dossier-content">
                    <div class="dossier-icon">${dossier.icon}</div>
                    <h3 class="dossier-title">${dossier.title}</h3>
                    <p class="dossier-description">${dossier.description}</p>
                    <div class="dossier-stats">
                        <span>${dossier.articleCount} articles</span>
                        <span>Mis à jour le ${this.formatDate(dossier.lastUpdate)}</span>
                    </div>
                </div>
            </div>
        `).join('');

    container.innerHTML = dossiersHTML;
  }

  // Utility functions
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Animation functions
  animateHero() {
    const titleLines = document.querySelectorAll('.title-line');
    const subtitle = document.querySelector('.hero-subtitle');
    const actions = document.querySelector('.hero-actions');

    // Animate title lines
    titleLines.forEach((line, index) => {
      gsap.to(line, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: index * 0.2,
        ease: "power3.out"
      });
    });

    // Animate subtitle
    gsap.to(subtitle, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: 0.6,
      ease: "power3.out"
    });

    // Animate actions
    gsap.to(actions, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: 0.8,
      ease: "power3.out"
    });
  }

  animateStats() {
    const stats = document.querySelectorAll('.stat-number');

    stats.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'));

      ScrollTrigger.create({
        trigger: stat,
        start: "top 80%",
        onEnter: () => {
          gsap.to(stat, {
            innerHTML: target,
            duration: 2,
            ease: "power2.out",
            snap: { innerHTML: 1 },
            onUpdate: function() {
              stat.innerHTML = Math.ceil(stat.innerHTML);
            }
          });
        }
      });
    });
  }

  initScrollAnimations() {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Section titles
    gsap.utils.toArray('.section-title').forEach(title => {
      gsap.to(title, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: title,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      });
    });

    // Article cards
    gsap.utils.toArray('.article-card').forEach((card, index) => {
      gsap.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: index * 0.1,
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play none none reverse"
        }
      });
    });

    // Dossier cards
    gsap.utils.toArray('.dossier-card').forEach((card, index) => {
      gsap.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: index * 0.1,
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play none none reverse"
        }
      });
    });

    // Stats
    gsap.utils.toArray('.stat-item').forEach((item, index) => {
      gsap.to(item, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: index * 0.1,
        scrollTrigger: {
          trigger: item,
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play none none reverse"
        }
      });
    });

    // Methodology steps
    gsap.utils.toArray('.step-item').forEach((step, index) => {
      gsap.to(step, {
        opacity: 1,
        x: 0,
        duration: 0.6,
        delay: index * 0.2,
        scrollTrigger: {
          trigger: step,
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play none none reverse"
        }
      });
    });

    // Methodology graphic
    const graphic = document.querySelector('.methodology-graphic');
    if (graphic) {
      gsap.to(graphic, {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        scrollTrigger: {
          trigger: graphic,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      });
    }
  }

  // Event handlers
  handleSmoothScroll(e) {
    const href = e.currentTarget.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offsetTop = target.offsetTop - 80; // Account for fixed header
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    }
  }

  handleHeaderScroll() {
    const header = document.getElementById('main-header');
    if (header) {
      if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
      } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
      }
    }
  }

  handleFormSubmission(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const topic = formData.get('topic-input') || document.getElementById('topic-input').value;
    const context = formData.get('context-input') || document.getElementById('context-input').value;
    const scope = Array.from(document.getElementById('scope-input').selectedOptions).map(option => option.value);

    // Simulate analysis generation
    this.simulateAnalysisGeneration(topic, context, scope);
  }

  simulateAnalysisGeneration(topic, context, scope) {
    // Show loading state
    const submitBtn = document.querySelector('#analysis-form button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = `
            <div class="loading-spinner"></div>
            Génération en cours...
        `;
    submitBtn.disabled = true;

    // Simulate API call delay
    setTimeout(() => {
      // Reset button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;

      // Close modal
      this.closeGenerateModal();

      // Show success message
      this.showNotification('Analyse générée avec succès ! Vous serez redirigé vers le brouillon.', 'success');

      // Simulate redirect to article page
      setTimeout(() => {
        window.location.href = `article.html?generated=true&topic=${encodeURIComponent(topic)}`;
      }, 2000);
    }, 3000);
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">×</button>
            </div>
        `;

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);

    // Auto remove
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 5000);

    // Manual close
    notification.querySelector('.notification-close').addEventListener('click', () => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    });
  }
}

// CSS for notifications (add to your CSS file)
const notificationStyles = `
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    background: var(--bg-primary);
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-heavy);
    border-left: 4px solid var(--primary-color);
    transform: translateX(400px);
    transition: transform 0.3s ease;
    max-width: 400px;
}

.notification.show {
    transform: translateX(0);
}

.notification-success {
    border-left-color: #10b981;
}

.notification-error {
    border-left-color: #ef4444;
}

.notification-content {
    padding: var(--spacing-lg);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-md);
}

.notification-message {
    color: var(--text-primary);
    font-size: var(--font-size-sm);
    line-height: 1.5;
}

.notification-close {
    color: var(--text-muted);
    font-size: var(--font-size-lg);
    padding: var(--spacing-xs);
    border-radius: 50%;
    transition: var(--transition);
}

.notification-close:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
}

.loading-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    display: inline-block;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.search-result-item {
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--border-color);
    cursor: pointer;
    transition: var(--transition);
}

.search-result-item:hover {
    background: var(--bg-secondary);
}

.search-result-item:last-child {
    border-bottom: none;
}

.result-type {
    font-size: var(--font-size-xs);
    color: var(--primary-color);
    font-weight: 500;
    text-transform: uppercase;
    margin-bottom: var(--spacing-xs);
}

.result-title {
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--spacing-sm);
}

.result-excerpt {
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
    line-height: 1.5;
    margin-bottom: var(--spacing-sm);
}

.result-dossier {
    font-size: var(--font-size-xs);
    color: var(--text-muted);
    margin-bottom: var(--spacing-sm);
}

.result-tags {
    display: flex;
    gap: var(--spacing-xs);
    flex-wrap: wrap;
}

.result-tag {
    padding: 2px var(--spacing-xs);
    background: var(--bg-tertiary);
    color: var(--text-muted);
    border-radius: var(--border-radius);
    font-size: var(--font-size-xs);
}

.no-results {
    padding: var(--spacing-2xl);
    text-align: center;
    color: var(--text-muted);
}
`;

// Add notification styles to the document
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new MetaScopeApp();
});

// Export for potential use in other files
window.MetaScopeApp = MetaScopeApp;
