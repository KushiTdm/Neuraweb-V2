import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Search crawlers: keep public pages discoverable for classic SEO and GEO.
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
      },

      // AI search / retrieval crawlers: allow citation and answer engines.
      {
        userAgent: 'OAI-SearchBot',
        allow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
      },
      {
        userAgent: 'Perplexity-User',
        allow: '/',
      },
      {
        userAgent: 'Claude-SearchBot',
        allow: '/',
      },
      {
        userAgent: 'Claude-User',
        allow: '/',
      },

      // Training crawlers: blocked by policy while keeping search crawlers open.
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        userAgent: 'Google-Extended',
        disallow: '/',
      },
      {
        userAgent: 'ClaudeBot',
        disallow: '/',
      },
      {
        userAgent: 'anthropic-ai',
        disallow: '/',
      },
      {
        userAgent: 'CCBot',
        disallow: '/',
      },

      // Default rule: public website is crawlable; private and API routes are not.
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/fr/admin/',
          '/en/admin/',
          '/es/admin/',
          '/fr/hotel-form/',
          '/en/hotel-form/',
          '/es/hotel-form/',
        ],
      },
    ],
    sitemap: 'https://neuraweb.tech/sitemap.xml',
  };
}
