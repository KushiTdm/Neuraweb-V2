/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-accordion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-popover',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
      '@radix-ui/react-tooltip',
      'recharts',
      'date-fns',
    ],
  },

  // ✅ AJOUTÉ : redirections permanentes pour www et http
  // Ces 4 URLs apparaissent dans Search Console comme "pages avec redirection"
  // Vercel gère http→https automatiquement, mais on déclare www ici en fallback
  async redirects() {
    return [
      // www → non-www
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.neuraweb.tech' }],
        destination: 'https://neuraweb.tech/:path*',
        permanent: true,
      },
      // Slugs localisés EN/ES → slug canonique FR (évite les 404 sur URLs logiques)
      { source: '/en/team',   destination: '/en/equipe',  permanent: true },
      { source: '/es/equipo', destination: '/es/equipe',  permanent: true },

      // Page Santé — FR uniquement, on redirige les autres langues
      { source: '/en/sante', destination: '/fr/sante', permanent: true },
      { source: '/es/sante', destination: '/fr/sante', permanent: true },

      // Page Restaurants — FR uniquement, on redirige les autres langues
      { source: '/en/restaurants', destination: '/fr/restaurants', permanent: true },
      { source: '/es/restaurants', destination: '/fr/restaurants', permanent: true },

      // Slugs de blog incorrects détectés par Google Search Console ("Détectée, non indexée")
      // Ces URLs ont été crawlées mais retournaient 404 — on les redirige vers les vrais slugs
      { source: '/:lang/blog/automation-n8n-guide', destination: '/:lang/blog/automatisation-n8n-guide', permanent: true },
      { source: '/:lang/blog/chatbot-ia-hotellerie-performant', destination: '/:lang/blog/checklist-site-hotelier-performant', permanent: true },
      { source: '/:lang/blog/integrer-ia-site-web-2024', destination: '/:lang/blog/integrer-ia-site-web-2025', permanent: true },
      { source: '/:lang/blog/marketing-digital-ia-automatisations', destination: '/:lang/blog/marketing-digital-ia-automations', permanent: true },
      { source: '/:lang/blog/best-js-vs-wordpress-2025', destination: '/:lang/blog/nextjs-vs-wordpress-2026', permanent: true },
      { source: '/:lang/blog/nextjs-vs-wordpress-2025', destination: '/:lang/blog/nextjs-vs-wordpress-2026', permanent: true },
      { source: '/:lang/blog/site-web-hotellerie-design-reservations', destination: '/:lang/blog/site-web-hotel-design-reservations', permanent: true },
      // /l-equipe détecté par des crawls — slug réel est /equipe
      { source: '/:lang/l-equipe', destination: '/:lang/equipe', permanent: true },

      // /services → /developpement-web (page renommée pour cohérence SEO)
      { source: '/:lang/services', destination: '/:lang/developpement-web', permanent: true },

    ];
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 20,
            },
            radix: {
              test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
              name: 'radix-ui',
              chunks: 'all',
              priority: 30,
            },
            lucide: {
              test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
              name: 'lucide',
              chunks: 'all',
              priority: 30,
            },
            three: {
              test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
              name: 'three',
              chunks: 'async',
              priority: 30,
            },
          },
        },
      };
    }
    return config;
  },
  images: {
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 80, 85],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/assets/:path*.webm',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/assets/:path*.mp4',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/assets/:path*.webp',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/assets/:path*.png',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/assets/:path*.gif',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/assets/:path*.vtt',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://client.crisp.chat",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // *.google-analytics.com couvre region1/region2/etc. (endpoints
              // régionaux GA4 utilisés pour la conformité RGPD en UE).
              "img-src 'self' data: blob: https://*.google-analytics.com https://www.googletagmanager.com https://images.unsplash.com https://images.pexels.com",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://*.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://www.googletagmanager.com https://client.crisp.chat wss://client.relay.crisp.chat",
              "frame-src 'self' https://www.google.com",
              "media-src 'self' blob:",
              "worker-src 'self' blob:",
              "frame-ancestors 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;