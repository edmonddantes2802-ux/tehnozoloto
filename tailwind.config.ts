import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A2B3C',
          foreground: '#FFFFFF',
        },
        gold: {
          DEFAULT: '#D4AF37',
          light: '#F1D592',
          dark: '#B8962E',
        },
        corporate: {
          gray: '#4B5563',
          bg: '#F8FAFC',
          dark: '#111827',
          border: '#E5E7EB',
          muted: '#9CA3AF',
        },
        success: '#10B981',
        danger: '#EF4444',
        warning: '#F59E0B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        h1: ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        h2: ['2.25rem', { lineHeight: '1.2', fontWeight: '600' }],
        h3: ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
      },
      borderRadius: {
        corp: '6px',
        card: '12px',
        modal: '16px',
      },
      boxShadow: {
        'card-rest': '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
        'card-hover':
          '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
        'gold-glow': '0 4px 14px 0 rgba(212, 175, 55, 0.39)',
      },
      backgroundImage: {
        'gold-shine':
          'linear-gradient(135deg, #D4AF37 0%, #F1D592 50%, #D4AF37 100%)',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          md: '1.5rem',
        },
        screens: {
          '2xl': '1280px',
        },
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.5' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
    },
  },
  plugins: [],
};

export default config;
