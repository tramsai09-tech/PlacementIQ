import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // PlacementIQ Design System (Updated Palette)
        bg: '#2C2E43', // Darker variant of Bright Gray for true background
        surface: '#3B3D55', // Bright Gray
        'surface-2': '#464860',
        'surface-3': '#52546b',
        primary: {
          DEFAULT: '#18BADD', // Java
          50: '#E0F8FC',
          100: '#B3EDF7',
          200: '#80E0F0',
          300: '#4DD3E8',
          400: '#26C7E3',
          500: '#18BADD',
          600: '#1396B3',
          700: '#0E7188',
          800: '#094D5D',
          900: '#3039A1', // Governor Bay
        },
        accent: '#3039A1', // Governor Bay
        success: '#00D97E',
        warning: '#FFB547',
        danger: '#FF6B6B',
        text: {
          DEFAULT: '#E6E6E2', // Cararra
          secondary: '#D0DDE6', // Botticelli
          muted: '#9CA3AF',
        },
        border: {
          DEFAULT: 'rgba(230,230,226,0.08)',
          subtle: 'rgba(230,230,226,0.04)',
          focus: 'rgba(24,186,221,0.4)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #18BADD 0%, #3039A1 100%)',
        'gradient-surface': 'linear-gradient(180deg, #3B3D55 0%, #2C2E43 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(59,61,85,0.9) 0%, rgba(44,46,67,0.9) 100%)',
        'gradient-glow':
          'radial-gradient(ellipse at top, rgba(24,186,221,0.15) 0%, transparent 60%)',
        'gradient-score': 'conic-gradient(from 180deg, #18BADD, #3039A1, #00D97E)',
      },
      boxShadow: {
        glow: '0 0 30px rgba(24,186,221,0.2)',
        'glow-sm': '0 0 15px rgba(24,186,221,0.15)',
        'glow-lg': '0 0 60px rgba(24,186,221,0.25)',
        card: '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.6)',
        inner: 'inset 0 1px 0 rgba(230,230,226,0.05)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 2s infinite',
        glow: 'glow 2s ease-in-out infinite alternate',
        shimmer: 'shimmer 2s linear infinite',
        float: 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(24,186,221,0.15)' },
          '100%': { boxShadow: '0 0 30px rgba(24,186,221,0.35)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
