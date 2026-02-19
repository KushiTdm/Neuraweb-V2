# Mémoire Développeur - Boost SEO via IA

## 🧠 Contexte et Objectifs

Ce document sert de référence technique pour le développement et la maintenance du système de Boost SEO via IA. Il contient les consignes à respecter, les patterns à suivre, et les améliorations futures envisagées.

---

## 📁 Architecture Technique

### Structure des fichiers

```
project/
├── lib/
│   └── seo-service.ts          # Service central SEO
├── app/
│   └── api/
│       └── seo/
│           └── route.ts        # API endpoint SEO
├── hooks/
│   └── use-seo.ts              # Hook React SEO
├── components/
│   └── seo/
│       ├── index.ts            # Exports
│       └── dynamic-head.tsx    # Composants SEO
├── locales/
│   ├── fr.ts                   # Traductions FR + SEO
│   ├── en.ts                   # Traductions EN + SEO
│   └── es.ts                   # Traductions ES + SEO
└── docs/
    ├── SEO_BOOST_GUIDE.md      # Guide utilisateur
    └── SEO_BOOST_DEVELOPER_MEMORY.md  # Ce document
```

### Flux de données

```
┌─────────────────────────────────────────────────────────────────┐
│                      FLUX DE DONNÉES SEO                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. SERVER-SIDE (Build time / SSR)                              │
│  ┌──────────────┐                                               │
│  │ Page/Layout  │ ──generatePageMetadata()──▶ Metadata object   │
│  └──────────────┘                                               │
│         │                                                        │
│         └──generateJsonLd()──▶ JSON-LD schema                   │
│                                                                  │
│  2. CLIENT-SIDE (Runtime)                                        │
│  ┌──────────────┐                                               │
│  │  Component   │ ──useSEO()──▶ Dynamic meta tags update        │
│  └──────────────┘                                               │
│         │                                                        │
│         └──fetch('/api/seo')──▶ AI-generated SEO data           │
│                                                                  │
│  3. CACHE LAYERS                                                 │
│  ┌──────────────┐     ┌──────────────┐                          │
│  │ Server Cache │     │ Client Cache │                          │
│  │   (1 heure)  │     │  (30 min)    │                          │
│  └──────────────┘     └──────────────┘                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## ⚠️ Consignes de Développement

### 1. Typage Strict

**TOUJOURS** utiliser les types définis dans `seo-service.ts` :

```typescript
// ✅ CORRECT
import { PageType, Language, PageSEOContext, GeneratedSEO } from '@/lib/seo-service';

const context: PageSEOContext = {
  pageType: 'services',
  language: 'fr',
  path: '/services',
};

// ❌ INCORRECT
const context = {
  pageType: 'service',  // Erreur : doit être 'services'
  language: 'french',   // Erreur : doit être 'fr'
  path: '/services',
};
```

### 2. Gestion du Cache

Le cache est **OBLIGATOIRE** pour éviter les appels API répétés :

```typescript
// Cache serveur (dans seo-service.ts)
const seoCache = new Map<string, { data: GeneratedSEO; timestamp: number }>();
const CACHE_DURATION = 60 * 60 * 1000; // 1 heure

// Cache client (dans use-seo.ts)
const clientCache = new Map<string, { data: GeneratedSEO; timestamp: number }>();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
```

### 3. Fallback IA

**TOUJOURS** implémenter un fallback si l'IA n'est pas disponible :

```typescript
// ✅ Pattern correct
async function generateSEOWithAI(context: PageSEOContext): Promise<GeneratedSEO> {
  const apiKey = process.env.ZAI_API_KEY;
  
  if (!apiKey) {
    console.warn('ZAI_API_KEY not set, using fallback SEO');
    return generateFallbackSEO(context);
  }

  try {
    // Appel IA...
  } catch (error) {
    console.error('AI SEO generation failed:', error);
    return generateFallbackSEO(context);
  }
}
```

### 4. Validation des Données IA

**TOUJOURS** valider et sanitizer les données retournées par l'IA :

```typescript
function sanitizeTitle(title: unknown, context: PageSEOContext): string {
  if (typeof title !== 'string' || !title.trim()) {
    return SEO_CONTEXTS_BY_LANG[context.language][context.pageType].title;
  }
  
  // Limiter à 60 caractères
  let sanitized = title.trim();
  if (sanitized.length > 60) {
    const lastSpace = sanitized.substring(0, 57).lastIndexOf(' ');
    sanitized = sanitized.substring(0, lastSpace > 0 ? lastSpace : 57) + '...';
  }
  
  return sanitized;
}
```

### 5. Multilingue

Ajouter les traductions SEO dans **TOUS** les fichiers de locale :

```typescript
// locales/fr.ts, en.ts, es.ts
'seo.home.title': '...',
'seo.home.description': '...',
'seo.services.title': '...',
// ... etc pour chaque type de page
```

### 6. Performance

- Utiliser `Array.from()` pour convertir les `Set` en tableau (compatibilité TypeScript)
- Éviter les opérations synchrones lourdes dans les composants client
- Privilégier la génération server-side quand possible

---

## 🔧 Patterns de Code

### Pattern : Nouveau type de page

Pour ajouter un nouveau type de page (ex: `faq`) :

1. **Mettre à jour le type** :
```typescript
// lib/seo-service.ts
export type PageType = 'home' | 'services' | 'contact' | 'portfolio' | 'blog' | 'custom' | 'faq';
```

2. **Ajouter les contextes SEO** :
```typescript
// lib/seo-service.ts - SEO_CONTEXTS_BY_LANG
const SEO_CONTEXTS_BY_LANG: Record<Language, Record<PageType, PageSEOConfig>> = {
  fr: {
    // ... existing
    faq: {
      title: 'FAQ - Questions Fréquentes | NeuraWeb',
      description: 'Trouvez les réponses à vos questions...',
      keywords: ['faq', 'questions', 'aide'],
    },
  },
  en: { /* ... */ },
  es: { /* ... */ },
};
```

3. **Ajouter les traductions** :
```typescript
// locales/fr.ts, en.ts, es.ts
'seo.faq.title': '...',
'seo.faq.description': '...',
```

### Pattern : Nouveau schéma JSON-LD

```typescript
// Dans generateJsonLd()
const faqSchema = {
  ...baseSchema,
  name: 'FAQ NeuraWeb',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Question 1',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Réponse 1',
      },
    },
  ],
  ...additionalData,
};

switch (type) {
  // ... existing cases
  case 'FAQ':
    return faqSchema;
}
```

### Pattern : Hook personnalisé

```typescript
// hooks/use-page-seo.ts
import { useSEO } from './use-seo';
import { useLanguage } from '@/contexts/language-context';

export function usePageSEO(pageType: PageType, customKeywords?: string[]) {
  const { language } = useLanguage();
  
  return useSEO({
    pageType,
    language,
    customKeywords,
    autoGenerate: true,
  });
}
```

---

## 🚀 Améliorations Futures

### Court terme (Prochain sprint)

1. **Analytics SEO**
   - Tracker les performances SEO dans Google Search Console
   - Mesurer l'impact des mots-clés boostés
   - Implémenter un dashboard d'analyse

2. **Cache Redis**
   - Remplacer le cache en mémoire par Redis
   - Permettre le partage de cache entre instances

3. **Tests automatisés**
   - Tests unitaires pour `seo-service.ts`
   - Tests d'intégration pour l'API `/api/seo`
   - Tests E2E pour valider les meta tags

### Moyen terme (Prochain mois)

4. **SEO A/B Testing**
   - Permettre de tester différentes variantes de title/description
   - Mesurer le CTR dans les SERPs

5. **Génération de Sitemap dynamique**
   - Intégrer avec le service SEO pour un sitemap optimisé
   - Inclure les images et vidéos

6. **Open Graph Avancé**
   - Génération automatique d'images OG
   - Support des vidéos et articles riches

7. **Internationalisation avancée**
   - Détection automatique de la langue
   - Hreflang automatique

### Long terme (Roadmap)

8. **Machine Learning SEO**
   - Analyser les tendances de recherche
   - Suggérer des mots-clés basés sur la concurrence
   - Optimisation continue des métadonnées

9. **Intégration CMS**
   - Plugin pour Strapi, Contentful, etc.
   - Synchronisation des métadonnées

10. **SEO Monitoring**
    - Alertes en cas de régression SEO
    - Rapports automatisés hebdomadaires

---

## 📊 Métriques à Surveiller

### Performance Technique

| Métrique | Objectif | Action si dépassé |
|----------|----------|-------------------|
| Temps de génération SEO (server) | < 50ms | Optimiser le cache |
| Temps de réponse API /api/seo | < 200ms | Vérifier l'API Z.AI |
| Taille du cache | < 1MB | Implémenter LRU cache |
| Taux de fallback | < 5% | Vérifier la clé API |

### SEO Business

| Métrique | Objectif |
|----------|----------|
| Score Lighthouse SEO | > 95 |
| Pages indexées | 100% |
| Erreurs 404 | 0 |
| Core Web Vitals | Tous verts |

---

## 🐛 Debug & Troubleshooting

### Activer les logs de debug

```typescript
// Dans .env.local
DEBUG_SEO=true

// Dans seo-service.ts
if (process.env.DEBUG_SEO === 'true') {
  console.log('[SEO] Generating metadata for:', context);
}
```

### Vérifier l'état du cache

```typescript
// Endpoint de debug
// app/api/seo/debug/route.ts
export async function GET() {
  return NextResponse.json({
    cacheSize: seoCache.size,
    entries: Array.from(seoCache.entries()).map(([key, value]) => ({
      key,
      age: Date.now() - value.timestamp,
    })),
  });
}
```

### Problèmes courants

| Problème | Cause probable | Solution |
|----------|---------------|----------|
| Meta tags vides | Contexte manquant | Vérifier `pageType` et `language` |
| IA ne répond pas | Clé API invalide | Vérifier `ZAI_API_KEY` |
| Cache non utilisé | Clé de cache incohérente | Vérifier la génération de `cacheKey` |
| Erreur TypeScript | Type non mis à jour | Régénérer les types |

---

## 📚 Références

### Documentation officielle

- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Schema.org](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)

### APIs utilisées

- Z.AI API (GLM-4.5-flash) : https://open.bigmodel.cn/api/paas/v4/chat/completions

### Outils de test

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Meta Tag Analyzer](https://www.heymeta.com/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

## 📝 Changelog

### Version 1.0.0 (18/02/2026)

- ✅ Création du service SEO central (`lib/seo-service.ts`)
- ✅ API endpoint avec intégration IA (`app/api/seo/route.ts`)
- ✅ Hook React pour le client (`hooks/use-seo.ts`)
- ✅ Composants SEO dynamiques (`components/seo/`)
- ✅ Support multilingue (FR, EN, ES)
- ✅ Génération JSON-LD
- ✅ Cache intelligent
- ✅ Documentation complète

---

## 👥 Contributeurs

Ce système a été développé pour NeuraWeb. Pour toute modification majeure, consulter ce document et le guide utilisateur.

**Dernière mise à jour** : 18 février 2026