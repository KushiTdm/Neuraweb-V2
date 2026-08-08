import { MetadataRoute } from 'next';

// Routes privées : jamais crawlées, quel que soit le bot.
// Un bot nommé n'hérite PAS des règles du groupe '*', donc chaque règle
// nommée doit porter sa propre liste disallow.
const PRIVATE_ROUTES = [
  '/api/',
  '/fr/admin/',
  '/en/admin/',
  '/es/admin/',
  '/vi/admin/',
  '/fr/hotel-form/',
  '/en/hotel-form/',
  '/es/hotel-form/',
  '/vi/hotel-form/',
];

// Search crawlers + AI search/retrieval + AI training : tous autorisés sur le
// site public (SEO classique + GEO : citation par les answer engines et
// présence dans les connaissances des futurs modèles).
const ALLOWED_BOTS = [
  // Search crawlers
  'Googlebot',
  'Bingbot',
  // AI search / retrieval crawlers
  'OAI-SearchBot',
  'ChatGPT-User',
  'PerplexityBot',
  'Perplexity-User',
  'Claude-SearchBot',
  'Claude-User',
  // AI training crawlers
  'GPTBot',
  'Google-Extended',
  'ClaudeBot',
  'anthropic-ai',
  'CCBot',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      ...ALLOWED_BOTS.map((userAgent) => ({
        userAgent,
        allow: '/',
        disallow: PRIVATE_ROUTES,
      })),

      // Règle par défaut : site public crawlable, routes privées exclues.
      {
        userAgent: '*',
        allow: '/',
        disallow: PRIVATE_ROUTES,
      },
    ],
    sitemap: 'https://neuraweb.fr/sitemap.xml',
  };
}
