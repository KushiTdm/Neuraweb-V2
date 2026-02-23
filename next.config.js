/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  // Optimisations de build pour réduire la taille du JS
  compiler: {
    // Supprime les console.log en production
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  // Optimisations expérimentales
  experimental: {
    // Active les optimisations de bundle
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
  // Configuration webpack pour optimisations supplémentaires
  webpack: (config, { isServer }) => {
    // Optimisations pour le bundle client
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        // Évite les bundles trop gros
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // Sépare les vendors
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 20,
            },
            // Sépare les composants UI (radix)
            radix: {
              test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
              name: 'radix-ui',
              chunks: 'all',
              priority: 30,
            },
            // Sépare les icônes
            lucide: {
              test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
              name: 'lucide',
              chunks: 'all',
              priority: 30,
            },
            // Sépare three.js
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
    // Formats modernes en priorité (avif puis webp)
    formats: ['image/avif', 'image/webp'],
    // Points de rupture pour les écrans (responsive)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    // Tailles pour les images à largeur fixe
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache de 1 an pour les images optimisées
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
      // Cache long terme pour les vidéos
      {
        source: '/assets/:path*.webm',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/assets/:path*.mp4',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache long terme pour les images statiques
      {
        source: '/assets/:path*.webp',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/assets/:path*.png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/assets/:path*.gif',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
