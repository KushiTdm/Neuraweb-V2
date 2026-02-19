# Guide Complet du Boost SEO via IA - NeuraWeb

## 📖 Table des matières

1. [Introduction](#introduction)
2. [Architecture du système](#architecture-du-système)
3. [Installation et configuration](#installation-et-configuration)
4. [Utilisation de base](#utilisation-de-base)
5. [Utilisation avancée](#utilisation-avancée)
6. [API Reference](#api-reference)
7. [Exemples concrets](#exemples-concrets)
8. [Bonnes pratiques](#bonnes-pratiques)
9. [Dépannage](#dépannage)

---

## Introduction

Le système de Boost SEO via IA de NeuraWeb permet de générer dynamiquement des métadonnées SEO optimisées pour chaque page de votre application Next.js. Il utilise l'intelligence artificielle pour créer des titres, descriptions et mots-clés pertinents, tout en respectant les bonnes pratiques du référencement naturel.

### Fonctionnalités principales

- ✅ Génération dynamique des balises meta (title, description, keywords)
- ✅ Support multilingue (Français, Anglais, Espagnol)
- ✅ Données structurées JSON-LD pour Google
- ✅ Intégration IA avec fallback automatique
- ✅ Cache intelligent pour optimiser les performances
- ✅ Mots-clés boostés par catégorie

---

## Architecture du système

```
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION NEXT.JS                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Pages      │    │   Layouts    │    │  Composants  │  │
│  │  (Server)    │───▶│  (Server)    │───▶│  (Client)    │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                   │                    │          │
│         ▼                   ▼                    ▼          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              lib/seo-service.ts                       │  │
│  │         (Service SEO centralisé)                      │  │
│  └──────────────────────────────────────────────────────┘  │
│         │                   │                               │
│         ▼                   ▼                               │
│  ┌──────────────┐    ┌──────────────┐                       │
│  │   API SEO    │    │    Cache     │                       │
│  │  /api/seo    │    │  (1 heure)   │                       │
│  └──────────────┘    └──────────────┘                       │
│         │                                                   │
│         ▼                                                   │
│  ┌──────────────┐                                          │
│  │   Z.AI API   │                                          │
│  │  (GLM-4.5)   │                                          │
│  └──────────────┘                                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Fichiers clés

| Fichier | Description |
|---------|-------------|
| `lib/seo-service.ts` | Service central de génération SEO |
| `app/api/seo/route.ts` | API endpoint pour la génération via IA |
| `hooks/use-seo.ts` | Hook React pour la manipulation côté client |
| `components/seo/dynamic-head.tsx` | Composants React pour les balises dynamiques |

---

## Installation et configuration

### Prérequis

- Next.js 14+ (App Router)
- Node.js 18+
- Clé API Z.AI (optionnelle, pour la génération IA)

### Configuration des variables d'environnement

Ajoutez dans votre fichier `.env` :

```env
# Clé API Z.AI pour la génération SEO via IA (optionnel)
ZAI_API_KEY=votre_cle_api_zai
```

### Installation des dépendances

Les dépendances nécessaires sont déjà incluses dans le projet :
- `next` (Metadata API)
- `react` (Hooks)

---

## Utilisation de base

### 1. Générer des métadonnées pour une page (Server-side)

Dans une page ou un layout Next.js :

```typescript
// app/ma-page/page.tsx
import { Metadata } from 'next';
import { generatePageMetadata, generateJsonLd } from '@/lib/seo-service';

// Génération des métadonnées SEO
export const metadata: Metadata = generatePageMetadata({
  pageType: 'services', // 'home' | 'services' | 'contact' | 'portfolio' | 'blog' | 'custom'
  language: 'fr',       // 'fr' | 'en' | 'es'
  path: '/services',    // Chemin de la page
  customKeywords: [     // Mots-clés additionnels (optionnel)
    'mot-clé-1',
    'mot-clé-2',
  ],
});

export default function ServicesPage() {
  return <div>...</div>;
}
```

### 2. Ajouter des données structurées JSON-LD

```typescript
// app/ma-page/page.tsx
import { generateJsonLd } from '@/lib/seo-service';

const jsonLd = generateJsonLd('Service', {
  pageType: 'services',
  language: 'fr',
  path: '/services',
}, {
  name: 'Mon Service',
  provider: {
    '@type': 'Organization',
    name: 'NeuraWeb',
  },
});

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Contenu de la page */}
    </>
  );
}
```

### 3. Utiliser le hook côté client

```typescript
// components/mon-composant.tsx
'use client';

import { useSEO } from '@/hooks/use-seo';

export default function MonComposant() {
  const { seo, isLoading, error } = useSEO({
    pageType: 'services',
    language: 'fr',
    customKeywords: ['référencement', 'seo'],
    autoGenerate: true,
  });

  if (isLoading) return <div>Chargement SEO...</div>;
  if (error) return <div>Erreur SEO: {error}</div>;

  return (
    <div>
      <h1>{seo?.title}</h1>
      <p>{seo?.description}</p>
    </div>
  );
}
```

---

## Utilisation avancée

### Génération SEO via l'API IA

Pour générer des métadonnées optimisées via l'IA :

```typescript
// Côté client
const response = await fetch('/api/seo', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    pageType: 'services',
    language: 'fr',
    customKeywords: ['web', 'ia'],
    customContext: 'Page de présentation des services web',
    path: '/services',
  }),
});

const { seo, metadata } = await response.json();
```

### Utiliser les composants SEO

```typescript
import { 
  DynamicHead, 
  JsonLdInjector, 
  SEOBooster,
  CanonicalUrl 
} from '@/components/seo';

export default function MaPage() {
  return (
    <>
      {/* Mise à jour dynamique des meta tags */}
      <DynamicHead 
        pageType="services" 
        language="fr"
        customKeywords={['seo', 'web']}
      />

      {/* Injection JSON-LD */}
      <JsonLdInjector data={monJsonLd} />

      {/* Boost SEO pour une section */}
      <SEOBooster 
        keywords={['optimisation', 'référencement']}
        context="Section services"
      >
        <section>...</section>
      </SEOBooster>

      {/* URL canonique */}
      <CanonicalUrl 
        url="https://monsite.fr/services"
        alternates={{
          fr: 'https://monsite.fr/fr/services',
          en: 'https://monsite.fr/en/services',
          es: 'https://monsite.fr/es/services',
        }}
      />
    </>
  );
}
```

### Personnaliser les mots-clés boostés

Les mots-clés boostés sont définis dans `lib/seo-service.ts` :

```typescript
const SEO_BOOST_KEYWORDS = {
  technical: ['Next.js', 'React', 'TypeScript', 'Node.js', 'API REST', 'GraphQL', 'SSR', 'SSG'],
  business: ['transformation digitale', 'croissance', 'ROI', 'conversion', 'leads', 'ventes'],
  ai: ['intelligence artificielle', 'machine learning', 'chatbot', 'automatisation', 'GPT', 'IA générative'],
  design: ['UX/UI', 'responsive', 'accessibilité', 'design moderne', 'interface utilisateur'],
  local: ['Paris', 'France', 'agence française', 'freelance France', 'agence Île-de-France'],
};
```

---

## API Reference

### `generatePageMetadata(context, customData?)`

Génère les métadonnées Next.js pour une page.

**Paramètres :**

| Param | Type | Description |
|-------|------|-------------|
| `context.pageType` | `PageType` | Type de page ('home', 'services', 'contact', 'portfolio', 'blog', 'custom') |
| `context.language` | `Language` | Langue ('fr', 'en', 'es') |
| `context.path` | `string` | Chemin de la page |
| `context.customKeywords` | `string[]` | Mots-clés additionnels |
| `context.customContext` | `string` | Contexte personnalisé pour l'IA |
| `customData` | `Partial<GeneratedSEO>` | Données SEO personnalisées |

**Retour :** `Metadata` (objet métadonnées Next.js)

---

### `generateJsonLd(type, context, additionalData?)`

Génère des données structurées JSON-LD.

**Paramètres :**

| Param | Type | Description |
|-------|------|-------------|
| `type` | `string` | Type de schéma ('Organization', 'Service', 'ProfessionalService', 'WebPage') |
| `context` | `PageSEOContext` | Contexte de la page |
| `additionalData` | `object` | Données additionnelles pour le schéma |

**Retour :** `Record<string, unknown>` (objet JSON-LD)

---

### `useSEO(options)`

Hook React pour la gestion SEO côté client.

**Paramètres :**

| Param | Type | Défaut | Description |
|-------|------|--------|-------------|
| `pageType` | `PageType` | requis | Type de page |
| `language` | `Language` | `'fr'` | Langue |
| `customKeywords` | `string[]` | `[]` | Mots-clés personnalisés |
| `customContext` | `string` | - | Contexte pour l'IA |
| `path` | `string` | `window.location.pathname` | Chemin de la page |
| `autoGenerate` | `boolean` | `true` | Génération automatique |

**Retour :**

```typescript
{
  seo: GeneratedSEO | null;     // Données SEO générées
  isLoading: boolean;            // État de chargement
  error: string | null;          // Erreur éventuelle
  generateSEO: () => Promise<void>;  // Fonction de génération
  updateMetaTags: () => void;    // Mise à jour des meta tags
}
```

---

### API Endpoints

#### `GET /api/seo`

Récupère les métadonnées SEO de base.

**Query Parameters :**
- `pageType` : Type de page
- `language` : Langue (défaut: 'fr')
- `path` : Chemin de la page (défaut: '/')

**Réponse :**
```json
{
  "success": true,
  "metadata": { ... },
  "jsonLd": { ... }
}
```

#### `POST /api/seo`

Génère des métadonnées SEO via IA.

**Body :**
```json
{
  "pageType": "services",
  "language": "fr",
  "customKeywords": ["web", "seo"],
  "customContext": "Description du contexte",
  "path": "/services"
}
```

**Réponse :**
```json
{
  "success": true,
  "seo": {
    "title": "...",
    "description": "...",
    "keywords": [...],
    "ogTitle": "...",
    "ogDescription": "...",
    "jsonLd": { ... },
    "suggestedTags": [...]
  },
  "metadata": { ... },
  "cached": false
}
```

---

## Exemples concrets

### Exemple 1 : Page d'accueil complète

```typescript
// app/page.tsx
import type { Metadata } from 'next';
import { generatePageMetadata, generateJsonLd } from '@/lib/seo-service';

export const metadata: Metadata = generatePageMetadata({
  pageType: 'home',
  language: 'fr',
  path: '/',
  customKeywords: [
    'agence web Paris',
    'développement web France',
    'intégration IA',
  ],
});

const jsonLd = generateJsonLd('ProfessionalService', {
  pageType: 'home',
  language: 'fr',
  path: '/',
}, {
  name: 'NeuraWeb',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5',
    reviewCount: '120',
  },
});

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        {/* Contenu */}
      </main>
    </>
  );
}
```

### Exemple 2 : Page multilingue

```typescript
// app/[lang]/services/page.tsx
import { generatePageMetadata } from '@/lib/seo-service';

export async function generateMetadata({ params }) {
  return generatePageMetadata({
    pageType: 'services',
    language: params.lang as 'fr' | 'en' | 'es',
    path: `/${params.lang}/services`,
  });
}
```

### Exemple 3 : Page dynamique avec boost SEO

```typescript
// app/blog/[slug]/page.tsx
import { DynamicHead, SEOBooster } from '@/components/seo';

export default function BlogPost({ params }) {
  const post = getPost(params.slug);
  
  return (
    <>
      <DynamicHead
        pageType="blog"
        language="fr"
        customKeywords={post.tags}
        customContext={post.excerpt}
      />
      
      <article>
        <SEOBooster keywords={post.tags} context={post.category}>
          <h1>{post.title}</h1>
          <p>{post.content}</p>
        </SEOBooster>
      </article>
    </>
  );
}
```

---

## Bonnes pratiques

### 1. Longueur des métadonnées

- **Title** : 50-60 caractères maximum
- **Description** : 150-160 caractères maximum
- **Keywords** : 5-15 mots-clés pertinents

### 2. Mots-clés

- Utilisez des mots-clés spécifiques à votre page
- Incluez des variantes et synonymes
- Évitez le bourrage de mots-clés

### 3. Données structurées

- Utilisez le bon type de schéma pour votre contenu
- Validez vos données avec le [outil de test de Google](https://search.google.com/test/rich-results)

### 4. Performance

- Le cache est activé par défaut (1 heure côté serveur, 30 min côté client)
- Utilisez `autoGenerate: false` si vous n'avez pas besoin de génération automatique

### 5. Multilingue

- Définissez toujours la langue appropriée
- Utilisez les URLs canoniques avec alternates

---

## Dépannage

### L'IA ne génère pas de métadonnées

**Cause** : Clé API Z.AI manquante ou invalide

**Solution** : 
1. Vérifiez que `ZAI_API_KEY` est définie dans `.env`
2. Le système utilise automatiquement le fallback si l'IA n'est pas disponible

### Les meta tags ne se mettent pas à jour côté client

**Cause** : Le hook n'est pas correctement initialisé

**Solution** :
```typescript
const { seo, updateMetaTags } = useSEO({
  pageType: 'services',
  autoGenerate: true,
});

// Forcer la mise à jour si nécessaire
useEffect(() => {
  updateMetaTags();
}, [seo]);
```

### Erreur TypeScript sur PageType

**Cause** : Type de page non reconnu

**Solution** : Utilisez uniquement les types valides :
```typescript
type PageType = 'home' | 'services' | 'contact' | 'portfolio' | 'blog' | 'custom';
```

---

## Support

Pour toute question ou problème, consultez :
- La documentation technique dans `docs/SEO_BOOST_DEVELOPER_MEMORY.md`
- Le code source dans `lib/seo-service.ts`
- L'API dans `app/api/seo/route.ts`