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
              chunks: 'all',
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
      // ─── Cache assets ───────────────────────────────────────────────
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

      // ─── En-têtes de sécurité globaux ───────────────────────────────
      // Ces en-têtes corrigent les audits Lighthouse "Bonnes pratiques" :
      // - HSTS        : force HTTPS (audit "Utiliser une règle HSTS efficace")
      // - X-Frame-Options : prévient le clickjacking (audit "Limiter le clickjacking avec XFO ou CSP")
      // - COOP        : isole l'origine cross-origin (audit "Assurer l'isolation appropriée de l'origine avec COOP")
      // - CSP         : réduit les risques XSS (audit "Garantir l'efficacité de la CSP contre les attaques XSS")
      //
      // NOTE : La CSP ci-dessous est en mode "permissif" pour éviter de casser
      // GTM, les fonts Google, les CDN. Resserrez selon vos besoins.
      {
        source: '/(.*)',
        headers: [
          // ── HSTS ──────────────────────────────────────────────────────
          // max-age=63072000 = 2 ans (recommandé HSTS Preload)
          // includeSubDomains et preload sont recommandés mais à activer
          // seulement si TOUS vos sous-domaines sont bien en HTTPS.
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },

          // ── X-Frame-Options ───────────────────────────────────────────
          // Remplacé par CSP frame-ancestors si CSP est activée,
          // mais XFO reste utile pour les navigateurs sans support CSP.
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },

          // ── Cross-Origin-Opener-Policy ────────────────────────────────
          // Isole le contexte de navigation cross-origin.
          // "same-origin-allow-popups" autorise les popups (OAuth, paiement)
          // tout en maintenant l'isolation. Utilisez "same-origin" si vous
          // n'avez pas besoin de popups cross-origin.
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },

          // ── X-Content-Type-Options ────────────────────────────────────
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },

          // ── Referrer-Policy ───────────────────────────────────────────
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },

          // ── Permissions-Policy ────────────────────────────────────────
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },

          // ── Content-Security-Policy ───────────────────────────────────
          // Corrige l'audit "Garantir l'efficacité de la CSP contre les attaques XSS"
          // et "Atténuer les attaques XSS basées sur le DOM avec les Trusted Types".
          //
          // ⚠️  IMPORTANT : Cette CSP est intentionnellement permissive pour ne pas
          // casser les fonctionnalités existantes (GTM, Google Analytics, Crisp, etc.)
          // 'unsafe-inline' est conservé car Next.js injecte des styles inline.
          // Pour une CSP plus stricte, migrez vers des nonces ou hash CSP.
          //
          // Pour activer les Trusted Types, ajoutez :
          // require-trusted-types-for 'script'; trusted-types nextjs
          // (Nécessite des adaptations dans le code React)
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Scripts : self + GTM/GA + inline Next.js
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://client.crisp.chat",
              // Styles : self + inline (Next.js) + Google Fonts
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Images : self + data: + external
              "img-src 'self' data: blob: https://www.google-analytics.com https://www.googletagmanager.com",
              // Fonts
              "font-src 'self' https://fonts.gstatic.com",
              // Connexions API / analytics / chatbot
              "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com https://client.crisp.chat wss://client.relay.crisp.chat",
              // Frames : self uniquement
              "frame-src 'self' https://www.google.com",
              // Médias : self + blob
              "media-src 'self' blob:",
              // Workers
              "worker-src 'self' blob:",
              // frame-ancestors remplace X-Frame-Options dans les navigateurs modernes
              "frame-ancestors 'self'",
              // Rapport de violations CSP (optionnel — configurez votre endpoint)
              // "report-uri /api/csp-report",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;