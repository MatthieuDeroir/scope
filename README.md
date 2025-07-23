# MetaScope - Site Journalistique d'Analyses Scientifiques

Un site web moderne et immersif dédié aux méta-analyses scientifiques pour aider les citoyens à se forger un avis éclairé sur les sujets de société complexes.

## 🚀 Fonctionnalités

### ✨ Interface Moderne
- Design responsive mobile-first
- Mode sombre/clair avec persistance
- Animations fluides avec GSAP
- Interface utilisateur immersive type Medium/New York Times

### 📖 Système d'Articles Innovant
- **Navigation par chapitres** : Chaque article est découpé en chapitres avec scroll fluide
- **Table des matières interactive** : Navigation latérale avec surlignage du chapitre actuel
- **Barre de progression de lecture** : Indicateur visuel de l'avancement
- **Navigation tactile** : Support des gestes de swipe sur mobile
- **Navigation clavier** : Raccourcis clavier pour une accessibilité optimale

### 🔍 Recherche Avancée
- Recherche en temps réel dans les articles, dossiers et tags
- Modal de recherche avec résultats filtrés
- Interface de recherche responsive

### 🤖 Intégration IA (Mock)
- Modal de génération d'analyses via Claude 4
- Simulation de création d'articles personnalisés
- Interface de configuration des paramètres d'analyse

### 📱 Responsive Design
- Interface adaptée mobile, tablette, desktop
- Menu hamburger responsive
- Navigation tactile optimisée
- Performance optimisée sur tous les appareils

### 🎨 Animations Avancées
- Animations d'entrée au scroll
- Effets de parallax
- Transitions fluides entre les sections
- Animations de chargement
- Effets de survol sophistiqués

## 📁 Structure des Fichiers

```
/var/www/html/
├── index.html                 # Page d'accueil
├── article.html              # Page d'article avec navigation par chapitres
├── css/
│   ├── style.css             # Styles principaux
│   └── article.css           # Styles spécifiques aux articles
├── js/
│   ├── main.js              # JavaScript principal
│   ├── animations.js        # Animations avancées
│   └── article.js           # Contrôleur des articles
├── data/
│   └── articles.json        # Données des articles (mock)
├── img/                     # Images et assets
└── README.md               # Documentation
```

## 🛠️ Installation

### Prérequis
- Serveur web (Apache/Nginx) ou serveur de développement
- Navigateur moderne avec support ES6+

### Installation sur serveur Linux

1. **Cloner/Télécharger les fichiers dans `/var/www/html/`**
```bash
sudo mkdir -p /var/www/html/metascope
cd /var/www/html/metascope
```

2. **Copier tous les fichiers dans le répertoire**
```bash
# Créer la structure des dossiers
sudo mkdir -p css js data img

# Copier les fichiers (remplacez par vos fichiers réels)
sudo cp index.html ./
sudo cp article.html ./
sudo cp css/* ./css/
sudo cp js/* ./js/
sudo cp data/* ./data/
```

3. **Définir les permissions appropriées**
```bash
sudo chown -R www-data:www-data /var/www/html/metascope
sudo chmod -R 755 /var/www/html/metascope
```

4. **Configuration Apache (si nécessaire)**
```apache
<VirtualHost *:80>
    ServerName metascope.local
    DocumentRoot /var/www/html/metascope

    <Directory /var/www/html/metascope>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

### Installation en développement local

1. **Avec Python (simple)**
```bash
cd /chemin/vers/le/projet
python3 -m http.server 8000
# Accès : http://localhost:8000
```

2. **Avec Node.js (http-server)**
```bash
npm install -g http-server
cd /chemin/vers/le/projet
http-server -p 8000
```

3. **Avec PHP**
```bash
cd /chemin/vers/le/projet
php -S localhost:8000
```

## 🎯 Utilisation

### Navigation Principale
- **Accueil** : Présentation des articles en vedette et dossiers thématiques
- **Recherche** : Clic sur l'icône de recherche dans l'en-tête
- **Mode sombre** : Toggle dans l'en-tête (persistance automatique)

### Navigation dans les Articles
- **Chapitres** : Navigation automatique au scroll ou via les boutons
- **Table des matières** : Clic sur l'icône liste dans l'en-tête
- **Raccourcis clavier** :
  - `←/↑` : Chapitre précédent
  - `→/↓/Espace` : Chapitre suivant
  - `Home` : Premier chapitre
  - `End` : Dernier chapitre
  - `Échap` : Fermer les modals

### Fonctionnalités Mobiles
- **Swipe** : Glisser vers le haut/bas pour naviguer entre chapitres
- **Menu hamburger** : Navigation responsive sur mobile
- **Touch optimisé** : Toutes les interactions tactiles optimisées

## 🔧 Personnalisation

### Couleurs et Thème
Modifiez les variables CSS dans `css/style.css` :
```css
:root {
  --primary-color: #00d4aa;        /* Couleur principale */
  --secondary-color: #667eea;      /* Couleur secondaire */
  --accent-color: #fd79a8;         /* Couleur d'accent */
  /* ... autres variables */
}
```

### Contenu des Articles
Éditez `data/articles.json` pour ajouter/modifier les articles :
```json
{
  "featured": [
    {
      "id": 1,
      "title": "Titre de l'article",
      "excerpt": "Description courte",
      "chapters": [
        {
          "id": 1,
          "title": "Titre du chapitre",
          "content": "Contenu du chapitre..."
        }
      ]
    }
  ]
}
```

### Animations
Personnalisez les animations dans `js/animations.js` :
- Durées d'animation
- Types d'effets (easing)
- Déclencheurs de scroll
- Effets de parallax

## 📱 Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 480px) { }

/* Tablette */
@media (max-width: 768px) { }

/* Desktop */
@media (max-width: 1024px) { }
```

## 🚀 Optimisations Performance

### Images
- Utilisez des formats modernes (WebP)
- Implémentez le lazy loading
- Optimisez les tailles selon les breakpoints

### JavaScript
- Les scripts sont chargés de manière asynchrone
- Debouncing des événements de scroll
- Lazy loading des animations

### CSS
- Variables CSS pour la cohérence
- Animations optimisées GPU
- Minification recommandée en production

## 🔐 Sécurité

### Recommandations
- Validez toutes les entrées utilisateur
- Implémentez HTTPS en production
- Configurez les headers de sécurité appropriés

### Headers de Sécurité (Apache)
```apache
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Strict-Transport-Security "max-age=63072000"
```

## 🌐 Compatibilité Navigateurs

### Support Complet
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Support Partiel (fallbacks automatiques)
- Internet Explorer 11 (sans animations avancées)
- Navigateurs mobiles anciens (sans certains effets)

## 🐛 Dépannage

### Problèmes Courants

1. **Les animations ne fonctionnent pas**
  - Vérifiez que GSAP est bien chargé
  - Consultez la console pour les erreurs JavaScript

2. **Les articles ne se chargent pas**
  - Vérifiez le chemin vers `data/articles.json`
  - Contrôlez la syntaxe JSON

3. **Navigation par chapitres cassée**
  - Vérifiez que les IDs des chapitres sont uniques
  - Contrôlez la structure HTML des chapitres

4. **Problèmes de responsive**
  - Vérifiez la balise viewport dans le HTML
  - Testez les media queries CSS

### Logs et Debug
```javascript
// Activer le mode debug
localStorage.setItem('debug', 'true');

// Voir les logs de navigation
window.articleController.getCurrentChapter();
```

## 🔄 Mises à Jour

### Ajout de Nouveaux Articles
1. Éditez `data/articles.json`
2. Ajoutez les images dans `img/`
3. Testez la navigation et l'affichage

### Nouvelles Fonctionnalités
1. Sauvegardez la version actuelle
2. Testez en local avant déploiement
3. Vérifiez la compatibilité cross-browser

## 📞 Support

### Resources
- **Documentation CSS** : Variables et classes utilitaires dans `css/style.css`
- **API JavaScript** : Méthodes publiques documentées dans les fichiers JS
- **Exemples** : Modèles d'articles dans `data/articles.json`

### Performance
Le site est optimisé pour :
- Temps de chargement < 3s
- Score Lighthouse > 90
- Accessibilité WCAG 2.1 AA

## 📈 Analytics et Métriques

### Métriques Suggérées
- Temps de lecture par article
- Navigation entre chapitres
- Utilisation de la recherche
- Taux de conversion modal IA

### Intégration Google Analytics
```html
<!-- À ajouter dans le <head> -->
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🤝 Contribution

### Guidelines
1. Respectez la structure de fichiers existante
2. Testez sur mobile et desktop
3. Documentez les nouvelles fonctionnalités
4. Maintenez la compatibilité avec les navigateurs supportés

---

**MetaScope** - Développé avec ❤️ pour promouvoir l'information scientifique accessible
# scope
