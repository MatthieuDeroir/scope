// === ARTICLE PAGE CONTROLLER ===

class ArticleController {
  constructor() {
    this.currentChapter = 1;
    this.totalChapters = 0;
    this.articleData = null;
    this.isScrolling = false;
    this.touchStartY = 0;
    this.touchEndY = 0;
    this.currentTheme = localStorage.getItem('theme') || 'light';

    this.init();
  }

  async init() {
    // Setup theme first
    this.setupTheme();

    // Load article data
    await this.loadArticleData();

    // Setup all components
    this.setupEventListeners();
    this.setupTableOfContents();
    this.setupChapterNavigation();
    this.setupProgressBar();
    this.setupSwipeGestures();
    this.setupKeyboardNavigation();
    this.setupShareModal();

    // Initialize animations
    this.initializeAnimations();

    // Start the article experience
    this.startArticle();
  }

  // Theme management
  setupTheme() {
    document.documentElement.setAttribute('data-theme', this.currentTheme);

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);

        // Smooth transition
        document.documentElement.style.transition = 'all 0.3s ease';
        setTimeout(() => {
          document.documentElement.style.transition = '';
        }, 300);
      });
    }
  }

  // Load article data from URL parameters or default
  async loadArticleData() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id') || '1';
    const isGenerated = urlParams.get('generated') === 'true';
    const generatedTopic = urlParams.get('topic');

    try {
      if (isGenerated && generatedTopic) {
        this.articleData = this.generateMockArticle(generatedTopic);
      } else {
        // Load from JSON file
        const response = await fetch('data/articles.json');
        const data = await response.json();
        this.articleData = data.featured.find(article => article.id == articleId) || data.featured[0];
      }

      this.renderArticle();
    } catch (error) {
      console.error('Error loading article:', error);
      this.articleData = this.getDefaultArticle();
      this.renderArticle();
    }
  }

  generateMockArticle(topic) {
    return {
      id: 'generated',
      title: `Analyse générée : ${topic}`,
      excerpt: `Cette méta-analyse examine ${topic} à travers le prisme de la recherche scientifique récente. L'analyse a été générée automatiquement par Claude 4 et nécessite une révision éditoriale avant publication.`,
      tags: ["IA Générée", "Brouillon", "En révision"],
      date: new Date().toISOString().split('T')[0],
      readTime: "10 min",
      author: "Claude 4 (IA)",
      chapters: [
        {
          id: 1,
          title: "Introduction et contexte",
          content: `Cette analyse de ${topic} s'appuie sur les dernières recherches disponibles. L'intelligence artificielle a identifié les enjeux principaux et synthétisé les données pertinentes pour offrir une vue d'ensemble équilibrée du sujet.`
        },
        {
          id: 2,
          title: "État de la recherche actuelle",
          content: `Les études récentes sur ${topic} révèlent une complexité qui nécessite une approche multidisciplinaire. Cette section présente les méthodologies employées et les principaux résultats documentés dans la littérature scientifique.`
        },
        {
          id: 3,
          title: "Analyse des données",
          content: `L'examen des données disponibles sur ${topic} met en évidence plusieurs tendances significatives. Les corrélations identifiées suggèrent des liens causaux qui méritent une investigation approfondie.`
        },
        {
          id: 4,
          title: "Implications et perspectives",
          content: `Les implications de cette analyse de ${topic} s'étendent à plusieurs domaines. Les recommandations formulées s'appuient sur les preuves les plus robustes disponibles dans la littérature scientifique actuelle.`
        },
        {
          id: 5,
          title: "Conclusion",
          content: `Cette analyse préliminaire de ${topic} offre un cadre de compréhension basé sur les données scientifiques. Des recherches supplémentaires sont nécessaires pour affiner certains aspects et valider les hypothèses proposées.`
        }
      ],
      sources: [
        {
          title: "Analyse générée par Claude 4",
          url: "#",
          date: new Date().toISOString().split('T')[0]
        }
      ]
    };
  }

  getDefaultArticle() {
    return {
      id: 1,
      title: "Article non trouvé",
      excerpt: "L'article demandé n'a pas pu être chargé. Voici un exemple d'article de démonstration.",
      tags: ["Démonstration"],
      date: "2025-07-23",
      readTime: "5 min",
      author: "Équipe MetaScope",
      chapters: [
        {
          id: 1,
          title: "Article de démonstration",
          content: "Ceci est un exemple d'article pour démontrer les fonctionnalités de navigation par chapitres de MetaScope."
        }
      ],
      sources: []
    };
  }

  // Render article content
  renderArticle() {
    if (!this.articleData) return;

    // Update meta information
    document.title = `${this.articleData.title} - MetaScope`;

    // Update article header
    document.getElementById('article-title').textContent = this.articleData.title;
    document.getElementById('article-excerpt').textContent = this.articleData.excerpt;
    document.getElementById('article-author').textContent = this.articleData.author;
    document.getElementById('article-date').textContent = this.formatDate(this.articleData.date);
    document.getElementById('article-read-time').innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12,6 12,12 16,14"></polyline>
            </svg>
            ${this.articleData.readTime}
        `;

    // Update author initial
    const authorInitial = this.articleData.author.charAt(0).toUpperCase();
    document.getElementById('author-initial').textContent = authorInitial;

    // Update tags
    const tagsContainer = document.getElementById('article-tags');
    tagsContainer.innerHTML = this.articleData.tags.map(tag =>
      `<span class="article-tag">${tag}</span>`
    ).join('');

    // Update chapter count
    this.totalChapters = this.articleData.chapters.length;
    document.getElementById('total-chapters').textContent = this.totalChapters;

    // Render chapters
    this.renderChapters();

    // Render sources
    this.renderSources();
  }

  renderChapters() {
    const chaptersContainer = document.getElementById('article-chapters');

    const chaptersHTML = this.articleData.chapters.map((chapter, index) => `
            <section class="chapter" id="chapter-${chapter.id}" data-chapter="${chapter.id}">
                <div class="container">
                    <div class="chapter-content">
                        <div class="chapter-number">Chapitre ${index + 1}</div>
                        <h2 class="chapter-title">${chapter.title}</h2>
                        <div class="chapter-text">
                            ${this.formatChapterContent(chapter.content)}
                        </div>
                    </div>
                </div>
            </section>
        `).join('');

    chaptersContainer.innerHTML = chaptersHTML;

    // Activate first chapter if not already done
    if (!document.querySelector('.chapter.active')) {
      this.activateChapter(1);
    }
  }

  formatChapterContent(content) {
    // Simple formatting for demo - in real app, this would be more sophisticated
    return content
      .split('\n\n')
      .map(paragraph => paragraph.trim())
      .filter(paragraph => paragraph.length > 0)
      .map(paragraph => `<p>${paragraph}</p>`)
      .join('');
  }

  renderSources() {
    const sourcesContainer = document.getElementById('sources-list');

    if (!this.articleData.sources || this.articleData.sources.length === 0) {
      sourcesContainer.innerHTML = '<p>Aucune source spécifique pour cet article.</p>';
      return;
    }

    const sourcesHTML = this.articleData.sources.map(source => `
            <div class="source-item">
                <div class="source-title">${source.title}</div>
                <a href="${source.url}" class="source-link" target="_blank" rel="noopener">${source.url}</a>
                <div class="source-date">Consulté le ${this.formatDate(source.date)}</div>
            </div>
        `).join('');

    sourcesContainer.innerHTML = sourcesHTML;
  }

  // Setup event listeners
  setupEventListeners() {
    // Table of contents toggle
    const tocToggle = document.getElementById('toc-toggle');
    const tocClose = document.getElementById('toc-close');
    const toc = document.getElementById('table-of-contents');

    if (tocToggle) {
      tocToggle.addEventListener('click', () => {
        toc.classList.toggle('active');
      });
    }

    if (tocClose) {
      tocClose.addEventListener('click', () => {
        toc.classList.remove('active');
      });
    }

    // Close TOC when clicking outside
    document.addEventListener('click', (e) => {
      if (!toc.contains(e.target) && !tocToggle.contains(e.target)) {
        toc.classList.remove('active');
      }
    });

    // Chapter navigation buttons
    const prevBtn = document.getElementById('prev-chapter');
    const nextBtn = document.getElementById('next-chapter');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.goToPreviousChapter());
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.goToNextChapter());
    }

    // Scroll listener for progress and chapter detection
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      this.updateProgressBar();

      // Debounce chapter detection
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.detectCurrentChapter();
      }, 100);
    });

    // Share functionality
    document.getElementById('share-btn')?.addEventListener('click', () => {
      this.openShareModal();
    });

    // Print functionality
    document.getElementById('print-btn')?.addEventListener('click', () => {
      window.print();
    });
  }

  // Table of contents setup
  setupTableOfContents() {
    const tocList = document.getElementById('toc-list');

    if (!this.articleData?.chapters) return;

    const tocHTML = this.articleData.chapters.map((chapter, index) => `
            <li class="toc-item">
                <a href="#chapter-${chapter.id}" class="toc-link" data-chapter="${chapter.id}">
                    ${index + 1}. ${chapter.title}
                </a>
            </li>
        `).join('');

    tocList.innerHTML = tocHTML;

    // Add click handlers for TOC links
    tocList.querySelectorAll('.toc-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const chapterId = parseInt(link.dataset.chapter);
        this.goToChapter(chapterId);
        document.getElementById('table-of-contents').classList.remove('active');
      });
    });
  }

  // Chapter navigation
  setupChapterNavigation() {
    this.updateChapterNavigation();
  }

  updateChapterNavigation() {
    const prevBtn = document.getElementById('prev-chapter');
    const nextBtn = document.getElementById('next-chapter');
    const currentChapterSpan = document.getElementById('current-chapter');

    if (currentChapterSpan) {
      currentChapterSpan.textContent = this.currentChapter;
    }

    if (prevBtn) {
      prevBtn.disabled = this.currentChapter <= 1;
    }

    if (nextBtn) {
      nextBtn.disabled = this.currentChapter >= this.totalChapters;
    }
  }

  goToChapter(chapterNumber) {
    if (chapterNumber < 1 || chapterNumber > this.totalChapters || this.isScrolling) {
      return;
    }

    this.isScrolling = true;
    this.currentChapter = chapterNumber;

    const targetChapter = document.getElementById(`chapter-${chapterNumber}`);
    if (targetChapter) {
      // Smooth scroll to chapter
      targetChapter.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      // Update UI after scroll
      setTimeout(() => {
        this.activateChapter(chapterNumber);
        this.updateChapterNavigation();
        this.updateTableOfContents();
        this.isScrolling = false;
      }, 800);
    }
  }

  goToNextChapter() {
    if (this.currentChapter < this.totalChapters) {
      this.goToChapter(this.currentChapter + 1);
    }
  }

  goToPreviousChapter() {
    if (this.currentChapter > 1) {
      this.goToChapter(this.currentChapter - 1);
    }
  }

  activateChapter(chapterNumber) {
    // Remove active class from all chapters
    document.querySelectorAll('.chapter').forEach(chapter => {
      chapter.classList.remove('active');
    });

    // Add active class to current chapter
    const currentChapter = document.getElementById(`chapter-${chapterNumber}`);
    if (currentChapter) {
      currentChapter.classList.add('active');
    }
  }

  updateTableOfContents() {
    // Update active TOC link
    document.querySelectorAll('.toc-link').forEach(link => {
      link.classList.remove('active');
    });

    const activeLink = document.querySelector(`.toc-link[data-chapter="${this.currentChapter}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }

  // Progress bar
  setupProgressBar() {
    this.updateProgressBar();
  }

  updateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    if (!progressBar) return;

    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.min((scrollTop / docHeight) * 100, 100);

    progressBar.style.width = `${scrollPercent}%`;
  }

  // Detect current chapter based on scroll position
  detectCurrentChapter() {
    if (this.isScrolling) return;

    const chapters = document.querySelectorAll('.chapter');
    const scrollTop = window.pageYOffset + window.innerHeight / 2;

    let currentChapterNumber = 1;

    chapters.forEach((chapter, index) => {
      const chapterTop = chapter.offsetTop;
      const chapterBottom = chapterTop + chapter.offsetHeight;

      if (scrollTop >= chapterTop && scrollTop < chapterBottom) {
        currentChapterNumber = index + 1;
      }
    });

    if (currentChapterNumber !== this.currentChapter) {
      this.currentChapter = currentChapterNumber;
      this.updateChapterNavigation();
      this.updateTableOfContents();
      this.activateChapter(currentChapterNumber);
    }
  }

  // Swipe gestures for mobile
  setupSwipeGestures() {
    document.addEventListener('touchstart', (e) => {
      this.touchStartY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      this.touchEndY = e.changedTouches[0].clientY;
      this.handleSwipe();
    }, { passive: true });
  }

  handleSwipe() {
    const swipeThreshold = 50;
    const deltaY = this.touchStartY - this.touchEndY;

    if (Math.abs(deltaY) > swipeThreshold) {
      if (deltaY > 0) {
        // Swipe up - next chapter
        this.goToNextChapter();
      } else {
        // Swipe down - previous chapter
        this.goToPreviousChapter();
      }
    }
  }

  // Keyboard navigation
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Only handle if no input is focused
      if (document.activeElement.tagName === 'INPUT' ||
        document.activeElement.tagName === 'TEXTAREA') {
        return;
      }

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
          e.preventDefault();
          this.goToNextChapter();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          this.goToPreviousChapter();
          break;
        case 'Home':
          e.preventDefault();
          this.goToChapter(1);
          break;
        case 'End':
          e.preventDefault();
          this.goToChapter(this.totalChapters);
          break;
        case 'Escape':
          document.getElementById('table-of-contents').classList.remove('active');
          this.closeShareModal();
          break;
      }
    });
  }

  // Share modal
  setupShareModal() {
    const shareModal = document.getElementById('share-modal');
    const shareModalClose = document.getElementById('share-modal-close');
    const copyLinkBtn = document.getElementById('copy-link-btn');
    const shareUrlInput = document.getElementById('share-url');

    // Set current URL
    if (shareUrlInput) {
      shareUrlInput.value = window.location.href;
    }

    // Close modal
    if (shareModalClose) {
      shareModalClose.addEventListener('click', () => {
        this.closeShareModal();
      });
    }

    // Close on backdrop click
    if (shareModal) {
      shareModal.addEventListener('click', (e) => {
        if (e.target === shareModal) {
          this.closeShareModal();
        }
      });
    }

    // Copy link
    if (copyLinkBtn) {
      copyLinkBtn.addEventListener('click', () => {
        this.copyLinkToClipboard();
      });
    }

    // Share platform buttons
    document.querySelectorAll('.share-option').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const platform = e.currentTarget.dataset.platform;
        this.shareToplatform(platform);
      });
    });
  }

  openShareModal() {
    const shareModal = document.getElementById('share-modal');
    if (shareModal) {
      shareModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  closeShareModal() {
    const shareModal = document.getElementById('share-modal');
    if (shareModal) {
      shareModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  async copyLinkToClipboard() {
    const shareUrlInput = document.getElementById('share-url');
    const copyBtn = document.getElementById('copy-link-btn');

    try {
      await navigator.clipboard.writeText(shareUrlInput.value);

      // Visual feedback
      const originalHTML = copyBtn.innerHTML;
      copyBtn.innerHTML = '✓';
      copyBtn.style.background = '#10b981';

      setTimeout(() => {
        copyBtn.innerHTML = originalHTML;
        copyBtn.style.background = '';
      }, 2000);

    } catch (err) {
      console.error('Failed to copy link:', err);
      // Fallback for older browsers
      shareUrlInput.select();
      document.execCommand('copy');
    }
  }

  shareToplatform(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(this.articleData.title);
    const description = encodeURIComponent(this.articleData.excerpt);

    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${title}&body=${description}%0A%0A${url}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  }

  // Initialize animations
  initializeAnimations() {
    if (typeof gsap === 'undefined') return;

    // Animate article header on load
    gsap.from('.article-title', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: "power3.out"
    });

    gsap.from('.article-meta', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      delay: 0.2,
      ease: "power3.out"
    });

    gsap.from('.article-excerpt', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      delay: 0.4,
      ease: "power3.out"
    });

    // Animate chapter navigation
    gsap.from('.chapter-navigation', {
      opacity: 0,
      y: 50,
      duration: 0.8,
      delay: 0.6,
      ease: "back.out(1.7)"
    });
  }

  // Start the article experience
  startArticle() {
    // Activate first chapter
    setTimeout(() => {
      this.activateChapter(1);
      this.updateTableOfContents();
    }, 500);

    // Add loading states
    this.removeLoadingStates();
  }

  removeLoadingStates() {
    document.querySelectorAll('.loading').forEach(element => {
      element.classList.remove('loading');
    });
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

  // Public methods for external control
  getCurrentChapter() {
    return this.currentChapter;
  }

  getTotalChapters() {
    return this.totalChapters;
  }

  jumpToChapter(chapterNumber) {
    this.goToChapter(chapterNumber);
  }
}

// Initialize article controller when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.articleController = new ArticleController();
});

// Add some accessibility improvements
document.addEventListener('DOMContentLoaded', () => {
  // Add ARIA labels
  const progressBar = document.getElementById('progress-bar');
  if (progressBar) {
    progressBar.setAttribute('role', 'progressbar');
    progressBar.setAttribute('aria-label', 'Progression de lecture');
  }

  // Improve keyboard navigation
  const chapters = document.querySelectorAll('.chapter');
  chapters.forEach((chapter, index) => {
    chapter.setAttribute('tabindex', '0');
    chapter.setAttribute('aria-label', `Chapitre ${index + 1}`);
  });

  // Add skip link
  const skipLink = document.createElement('a');
  skipLink.href = '#article-main';
  skipLink.textContent = 'Aller au contenu principal';
  skipLink.className = 'skip-link';
  skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-color);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10000;
        transition: top 0.3s;
    `;

  skipLink.addEventListener('focus', () => {
    skipLink.style.top = '6px';
  });

  skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
  });

  document.body.insertBefore(skipLink, document.body.firstChild);
});

// Export for external use
window.ArticleController = ArticleController;
