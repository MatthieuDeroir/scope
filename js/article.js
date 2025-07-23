// === ENHANCED ARTICLE CONTROLLER FOR ACADEMIC CONTENT ===

class EnhancedArticleController extends ArticleController {
  constructor() {
    super();
    this.citations = new Map();
    this.footnotes = new Map();
    this.tableOfContents = [];
    this.currentAnnotation = null;
    this.readingProgress = {
      timeSpent: 0,
      chaptersRead: new Set(),
      sourcesViewed: new Set(),
      startTime: Date.now()
    };

    this.initAcademicFeatures();
  }

  async initAcademicFeatures() {
    await super.init();
    this.setupCitationSystem();
    this.setupFootnotes();
    this.setupAcademicNavigation();
    this.setupSourcesModal();
    this.setupReadingAnalytics();
    this.setupPrintableView();
    this.setupAccessibilityFeatures();
  }

  // Enhanced article loading with academic metadata
  async loadArticleData() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id') || 'acetamipride-loi-duplomb-2025';

    try {
      const response = await fetch('data/articles.json');
      const data = await response.json();
      this.articleData = data.featured.find(article => article.id === articleId) || data.featured[0];

      // Process academic metadata
      this.processAcademicMetadata();
      this.renderEnhancedArticle();

    } catch (error) {
      console.error('Error loading article:', error);
      this.articleData = this.getDefaultArticle();
      this.renderEnhancedArticle();
    }
  }

  processAcademicMetadata() {
    if (!this.articleData) return;

    // Process citations and create citation map
    if (this.articleData.sources) {
      this.articleData.sources.forEach(source => {
        this.citations.set(source.id, source);
      });
    }

    // Build enhanced table of contents with subsections
    this.buildDetailedTableOfContents();

    // Process methodology information
    this.processMethodology();

    // Set up reading time estimation
    this.calculateReadingTime();
  }

  buildDetailedTableOfContents() {
    this.tableOfContents = this.articleData.chapters.map(chapter => {
      // Extract subsections from chapter content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = chapter.content;
      const subsections = Array.from(tempDiv.querySelectorAll('h2, h3')).map(heading => ({
        id: this.generateSubsectionId(heading.textContent),
        title: heading.textContent,
        level: parseInt(heading.tagName.substring(1))
      }));

      return {
        id: chapter.id,
        title: chapter.title,
        subtitle: chapter.subtitle || '',
        subsections: subsections,
        estimated_time: this.estimateChapterReadingTime(chapter.content)
      };
    });
  }

  renderEnhancedArticle() {
    if (!this.articleData) return;

    // Render basic article structure
    this.renderArticle();

    // Add academic enhancements
    this.renderAcademicHeader();
    this.renderEnhancedNavigation();
    this.renderCitationLinks();
    this.renderMethodologySection();
    this.renderAppendices();
    this.renderKeywordsList();
    this.renderRelatedArticles();
  }

  renderAcademicHeader() {
    const headerSection = document.querySelector('.article-header-section');
    if (!headerSection || !this.articleData) return;

    // Add subtitle if present
    if (this.articleData.subtitle) {
      const subtitle = document.createElement('h2');
      subtitle.className = 'article-subtitle';
      subtitle.textContent = this.articleData.subtitle;
      headerSection.appendChild(subtitle);
    }

    // Add academic metadata
    const academicMeta = document.createElement('div');
    academicMeta.className = 'academic-metadata';
    academicMeta.innerHTML = `
      <div class="academic-meta-grid">
        ${this.articleData.type ? `<div class="meta-item">
          <strong>Type:</strong> ${this.getTypeLabel(this.articleData.type)}
        </div>` : ''}

        ${this.articleData.methodology ? `<div class="meta-item">
          <strong>Méthodologie:</strong> ${this.articleData.methodology.type}
        </div>` : ''}

        ${this.articleData.citations ? `<div class="meta-item">
          <strong>Citations:</strong> ${this.articleData.citations.total} sources
          <span class="citation-breakdown">
            (${this.articleData.citations.academic} académiques,
             ${this.articleData.citations.regulatory} réglementaires)
          </span>
        </div>` : ''}

        <div class="meta-item">
          <strong>Langue:</strong> ${this.articleData.language || 'fr'}
        </div>
      </div>
    `;

    headerSection.appendChild(academicMeta);

    // Add summary box for academic articles
    if (this.articleData.summary) {
      this.renderExecutiveSummary();
    }
  }

  renderExecutiveSummary() {
    const summaryContainer = document.createElement('div');
    summaryContainer.className = 'executive-summary';
    summaryContainer.innerHTML = `
      <h3>Résumé exécutif</h3>
      <div class="summary-content">
        <h4>Points clés:</h4>
        <ul class="key-findings">
          ${this.articleData.summary.keyFindings.map(finding =>
      `<li>${finding}</li>`
    ).join('')}
        </ul>

        <div class="implications">
          <h4>Implications:</h4>
          <p>${this.articleData.summary.implications}</p>
        </div>
      </div>
    `;

    document.querySelector('.article-header-section').appendChild(summaryContainer);
  }

  renderEnhancedNavigation() {
    const tocModal = document.getElementById('toc-modal');
    if (!tocModal) return;

    const tocContent = tocModal.querySelector('.toc-content');
    tocContent.innerHTML = `
      <div class="enhanced-toc">
        <div class="toc-header">
          <h3>Table des matières détaillée</h3>
          <div class="reading-progress-summary">
            <span class="chapters-read">0/${this.tableOfContents.length}</span>
            <span class="estimated-time">${this.articleData.readTime}</span>
          </div>
        </div>

        <div class="toc-list">
          ${this.tableOfContents.map(chapter => `
            <div class="toc-chapter" data-chapter="${chapter.id}">
              <div class="chapter-main" onclick="articleController.goToChapter(${chapter.id})">
                <span class="chapter-number">${chapter.id}.</span>
                <div class="chapter-info">
                  <h4 class="chapter-title">${chapter.title}</h4>
                  ${chapter.subtitle ? `<p class="chapter-subtitle">${chapter.subtitle}</p>` : ''}
                  <span class="chapter-time">${chapter.estimated_time} min</span>
                </div>
              </div>

              ${chapter.subsections.length > 0 ? `
                <div class="subsections">
                  ${chapter.subsections.map(sub => `
                    <div class="subsection-item" data-level="${sub.level}">
                      <span class="subsection-title">${sub.title}</span>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  setupCitationSystem() {
    // Create citations modal
    this.createCitationsModal();

    // Add click handlers for citation links
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('citation-link')) {
        e.preventDefault();
        const citationId = e.target.dataset.citation;
        this.showCitationPopup(citationId, e.target);
      }
    });
  }

  renderCitationLinks() {
    // Process all citation references in content
    const chapters = document.querySelectorAll('.chapter');
    chapters.forEach(chapter => {
      const content = chapter.innerHTML;
      // Replace citation markers with interactive links
      const citationRegex = /<a href="#(fn\d+)" class="footnote-ref">(\d+)<\/a>/g;
      const updatedContent = content.replace(citationRegex, (match, fnId, number) => {
        return `<sup><a href="#${fnId}" class="citation-link" data-citation="${fnId}">[${number}]</a></sup>`;
      });
      chapter.innerHTML = updatedContent;
    });
  }

  showCitationPopup(citationId, element) {
    const citation = this.citations.get(citationId);
    if (!citation) return;

    // Remove existing popups
    document.querySelectorAll('.citation-popup').forEach(popup => popup.remove());

    const popup = document.createElement('div');
    popup.className = 'citation-popup';
    popup.innerHTML = `
      <div class="citation-content">
        <div class="citation-header">
          <h4>${citation.title}</h4>
          <button class="close-popup">&times;</button>
        </div>

        <div class="citation-details">
          ${citation.authors ? `<p><strong>Auteurs:</strong> ${citation.authors.join(', ')}</p>` : ''}
          ${citation.journal ? `<p><strong>Journal:</strong> ${citation.journal}</p>` : ''}
          ${citation.organization ? `<p><strong>Organisation:</strong> ${citation.organization}</p>` : ''}
          <p><strong>Date:</strong> ${citation.date}</p>
          ${citation.doi ? `<p><strong>DOI:</strong> ${citation.doi}</p>` : ''}
        </div>

        <div class="citation-actions">
          <a href="${citation.url}" target="_blank" class="btn-primary">Consulter la source</a>
          <button onclick="this.copyToClipboard('${this.formatCitation(citation)}')" class="btn-secondary">Copier la citation</button>
        </div>
      </div>
    `;

    // Position popup near the clicked element
    const rect = element.getBoundingClientRect();
    popup.style.position = 'absolute';
    popup.style.top = `${rect.bottom + window.scrollY + 10}px`;
    popup.style.left = `${rect.left + window.scrollX}px`;
    popup.style.zIndex = '1000';

    document.body.appendChild(popup);

    // Close popup handlers
    popup.querySelector('.close-popup').onclick = () => popup.remove();
    document.addEventListener('click', (e) => {
      if (!popup.contains(e.target) && e.target !== element) {
        popup.remove();
      }
    }, { once: true });

    // Track source viewing
    this.readingProgress.sourcesViewed.add(citationId);
  }

  renderMethodologySection() {
    if (!this.articleData.methodology) return;

    const methodologySection = document.createElement('section');
    methodologySection.className = 'methodology-section';
    methodologySection.innerHTML = `
      <h3>Méthodologie de recherche</h3>
      <div class="methodology-grid">
        <div class="method-item">
          <h4>Type d'étude</h4>
          <p>${this.articleData.methodology.type}</p>
        </div>

        <div class="method-item">
          <h4>Sources</h4>
          <p>${this.articleData.methodology.sources}</p>
        </div>

        <div class="method-item">
          <h4>Période couverte</h4>
          <p>${this.articleData.methodology.period}</p>
        </div>

        <div class="method-item">
          <h4>Bases de données</h4>
          <p>${this.articleData.methodology.databases.join(', ')}</p>
        </div>
      </div>
    `;

    // Insert after article content, before sources
    const articleFooter = document.querySelector('.article-footer');
    if (articleFooter) {
      articleFooter.insertBefore(methodologySection, articleFooter.firstChild);
    }
  }

  renderAppendices() {
    if (!this.articleData.appendices) return;

    const appendicesSection = document.createElement('section');
    appendicesSection.className = 'appendices-section';
    appendicesSection.innerHTML = `
      <h3>Annexes</h3>
      <div class="appendices-list">
        ${this.articleData.appendices.map(appendix => `
          <div class="appendix-item" data-type="${appendix.type}">
            <h4>${appendix.title}</h4>
            <p>${appendix.content}</p>
            <span class="appendix-type">${this.getAppendixTypeLabel(appendix.type)}</span>
          </div>
        `).join('')}
      </div>
    `;

    document.querySelector('.article-footer').appendChild(appendicesSection);
  }

  renderKeywordsList() {
    if (!this.articleData.keywords) return;

    const keywordsSection = document.createElement('div');
    keywordsSection.className = 'keywords-section';
    keywordsSection.innerHTML = `
      <h4>Mots-clés</h4>
      <div class="keywords-list">
        ${this.articleData.keywords.map(keyword =>
      `<span class="keyword-tag">${keyword}</span>`
    ).join('')}
      </div>
    `;

    document.querySelector('.article-footer').appendChild(keywordsSection);
  }

  setupReadingAnalytics() {
    // Track reading progress
    this.trackChapterProgress();
    this.trackScrollDepth();
    this.trackTimeSpent();

    // Update progress indicators
    setInterval(() => {
      this.updateReadingProgress();
    }, 30000); // Update every 30 seconds
  }

  trackChapterProgress() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const chapterId = entry.target.dataset.chapter;
          this.readingProgress.chaptersRead.add(parseInt(chapterId));
          this.updateProgressIndicators();
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.chapter').forEach(chapter => {
      observer.observe(chapter);
    });
  }

  updateProgressIndicators() {
    // Update table of contents progress
    const chaptersReadCount = this.readingProgress.chaptersRead.size;
    const totalChapters = this.tableOfContents.length;

    const progressElement = document.querySelector('.chapters-read');
    if (progressElement) {
      progressElement.textContent = `${chaptersReadCount}/${totalChapters}`;
    }

    // Update progress bar
    const progressPercent = (chaptersReadCount / totalChapters) * 100;
    const progressBar = document.querySelector('.reading-progress-bar');
    if (progressBar) {
      progressBar.style.width = `${progressPercent}%`;
    }
  }

  setupPrintableView() {
    // Add print stylesheet toggle
    const printBtn = document.createElement('button');
    printBtn.className = 'print-btn';
    printBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6,9 6,2 18,2 18,9"></polyline>
        <path d="M6,18H4a2,2,0,0,1-2-2v-5a2,2,0,0,1,2-2H20a2,2,0,0,1,2,2v5a2,2,0,0,1-2,2H18"></path>
        <rect x="6" y="14" width="12" height="8"></rect>
      </svg>
      Version imprimable
    `;

    printBtn.onclick = () => this.generatePrintableVersion();

    document.querySelector('.article-actions').appendChild(printBtn);
  }

  generatePrintableVersion() {
    // Create print-optimized version
    const printWindow = window.open('', '_blank');
    const printContent = this.buildPrintableHTML();

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  }

  buildPrintableHTML() {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${this.articleData.title}</title>
        <style>
          body { font-family: 'Times New Roman', serif; line-height: 1.6; margin: 2cm; }
          .print-header { border-bottom: 2px solid #000; padding-bottom: 1em; margin-bottom: 2em; }
          .chapter { page-break-before: auto; margin-bottom: 2em; }
          .citation-link { color: #000; text-decoration: none; }
          .table-responsive table { width: 100%; border-collapse: collapse; }
          .table-responsive th, .table-responsive td { border: 1px solid #000; padding: 8px; }
          .info-box, .warning-box { border: 1px solid #000; padding: 1em; margin: 1em 0; }
          .sources-section { page-break-before: always; }
          @media print {
            .no-print { display: none; }
            .chapter { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="print-header">
          <h1>${this.articleData.title}</h1>
          ${this.articleData.subtitle ? `<h2>${this.articleData.subtitle}</h2>` : ''}
          <p><strong>Auteur:</strong> ${this.articleData.author}</p>
          <p><strong>Date:</strong> ${this.formatDate(this.articleData.date)}</p>
        </div>

        ${this.buildPrintableTableOfContents()}

        <div class="content">
          ${this.articleData.chapters.map(chapter => `
            <div class="chapter">
              <h2>${chapter.id}. ${chapter.title}</h2>
              ${chapter.subtitle ? `<h3>${chapter.subtitle}</h3>` : ''}
              <div class="chapter-content">${chapter.content}</div>
            </div>
          `).join('')}
        </div>

        <div class="sources-section">
          <h2>Sources et références</h2>
          ${this.buildPrintableSources()}
        </div>
      </body>
      </html>
    `;
  }

  // Utility methods
  getTypeLabel(type) {
    const labels = {
      'meta-analysis': 'Méta-analyse',
      'research': 'Article de recherche',
      'review': 'Revue de littérature',
      'opinion': 'Article d\'opinion'
    };
    return labels[type] || type;
  }

  getAppendixTypeLabel(type) {
    const labels = {
      'legal': 'Juridique',
      'scientific': 'Scientifique',
      'regulatory': 'Réglementaire',
      'economic': 'Économique',
      'media': 'Médiatique',
      'technical': 'Technique'
    };
    return labels[type] || type;
  }

  formatCitation(citation) {
    // Format citation according to academic standards
    let formatted = '';

    if (citation.authors) {
      formatted += citation.authors.join(', ') + '. ';
    }

    formatted += `"${citation.title}". `;

    if (citation.journal) {
      formatted += `${citation.journal}`;
      if (citation.volume) formatted += `, vol. ${citation.volume}`;
      if (citation.issue) formatted += `, n° ${citation.issue}`;
      if (citation.pages) formatted += `, ${citation.pages}`;
      formatted += '. ';
    }

    formatted += `${citation.date}. `;

    if (citation.doi) {
      formatted += `DOI: ${citation.doi}. `;
    }

    if (citation.url) {
      formatted += `Disponible à l'adresse : ${citation.url}`;
    }

    return formatted;
  }

  calculateReadingTime() {
    if (!this.articleData.chapters) return;

    let totalWords = 0;
    this.articleData.chapters.forEach(chapter => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = chapter.content;
      const text = tempDiv.textContent || tempDiv.innerText || '';
      totalWords += text.split(/\s+/).length;
    });

    // Average reading speed: 200-250 words per minute in French
    const readingTimeMinutes = Math.ceil(totalWords / 225);

    if (!this.articleData.readTime) {
      this.articleData.readTime = `${readingTimeMinutes} min`;
    }

    return readingTimeMinutes;
  }

  estimateChapterReadingTime(content) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    const words = text.split(/\s+/).length;
    return Math.ceil(words / 225); // minutes
  }

  generateSubsectionId(title) {
    return title.toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')     // Replace spaces with hyphens
      .trim();
  }
}

// Initialize enhanced controller when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  if (document.body.classList.contains('article-page')) {
    window.articleController = new EnhancedArticleController();
  }
});
