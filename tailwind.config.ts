import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      // ── Fonts premium ──────────────────────────────────────
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-inter-tight)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },

      // ── Palette de couleurs ────────────────────────────────
      colors: {
        // Navy — couleur principale de la nouvelle identité
        navy: {
          700: '#1E3A6B',
          800: '#1E2A4A',
          900: '#0E1B3D',
          950: '#070F26',
        },
        // Sky — accent principal
        sky: {
          400: '#5DB8F0',
          DEFAULT: '#5DB8F0',
        },
        // Cyan — accent vif, gradients
        cyan: {
          500: '#22D3EE',
          DEFAULT: '#22D3EE',
        },
        // Electric — alias legacy conservé pour compatibilité
        electric: {
          50:  '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          DEFAULT: '#22d3ee',
        },
        // Coral — CTA prioritaires, accents chauds
        coral: {
          DEFAULT: '#FF7A59',
          soft: '#FFB088',
        },
        // Lime — succès, KPI positifs
        lime: {
          DEFAULT: '#C5F277',
        },
        // Frost — fonds sections light secondaires
        frost: {
          DEFAULT: '#E8F4FD',
        },
        // Surface — fonds sections light principales
        surface: {
          DEFAULT: '#F7FAFD',
        },
        // Compatibilité shadcn/ui — mapped sur la nouvelle palette
        primary: {
          DEFAULT: '#5DB8F0',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#0E1B3D',
          foreground: '#ffffff',
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input:  'hsl(var(--input))',
        ring:   'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },

      // ── Border radius ──────────────────────────────────────
      borderRadius: {
        lg:   'var(--radius)',
        md:   'calc(var(--radius) - 2px)',
        sm:   'calc(var(--radius) - 4px)',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },

      // ── Shadows premium ────────────────────────────────────
      boxShadow: {
        'glow-brand':   '0 0 30px rgba(93, 184, 240, 0.35)',
        'glow-sky':     '0 0 30px rgba(93, 184, 240, 0.35)',
        'glow-cyan':    '0 0 30px rgba(34, 211, 238, 0.35)',
        'glow-coral':   '0 0 30px rgba(255, 122, 89, 0.35)',
        'glow-navy':    '0 0 30px rgba(14, 27, 61, 0.25)',
        'card-light':   '0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)',
        'card-hover':   '0 4px 6px rgba(0,0,0,0.04), 0 20px 40px rgba(0,0,0,0.10)',
        'card-dark':    '0 1px 3px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.4)',
        'inner-glow':   'inset 0 1px 0 rgba(255,255,255,0.1)',
      },

      // ── Animations ─────────────────────────────────────────
      animation: {
        'scroll':         'scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite',
        'fade-in':        'fadeIn 0.6s ease-out',
        'fade-up':        'fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
        'fade-down':      'fadeDown 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
        'slide-in-left':  'slideInLeft 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
        'slide-in-right': 'slideInRight 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
        'scale-in':       'scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'shimmer':        'shimmer 2.5s linear infinite',
        'pulse-slow':     'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float':          'float 4s ease-in-out infinite',
        'glow-pulse':     'glowPulse 2s ease-in-out infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up':   'accordion-up 0.2s ease-out',
        'border-spin':    'borderSpin 4s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeDown: {
          '0%':   { opacity: '0', transform: 'translateY(-24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%':   { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%':   { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.88)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%':      { opacity: '1',   transform: 'scale(1.05)' },
        },
        'accordion-down': {
          from: { height: '0' },
          to:   { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to:   { height: '0' },
        },
        borderSpin: {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        scroll: {
          to: { transform: 'translate(calc(-50% - 0.5rem))' },
        },
      },

      // ── Backdrop blur ──────────────────────────────────────
      backdropBlur: {
        xs: '2px',
      },

      // ── Spacing supplémentaire ─────────────────────────────
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
