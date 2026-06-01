/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fdf9ec',
          100: '#f9efca',
          200: '#f3dd90',
          300: '#ecc84d',
          400: '#e4b528',
          500: '#D4AF37',
          600: '#b8911a',
          700: '#936e16',
          800: '#795818',
          900: '#67481a',
          950: '#3c270a',
        },
        empire: {
          black: '#0A0A0A',
          charcoal: '#1C1C1C',
          gold: '#D4AF37',
          white: '#FFFFFF',
          success: '#00C853',
          warning: '#FF9800',
          error: '#D32F2F',
        },
        surface: {
          100: '#F8F8F8',
          200: '#F0F0F0',
          300: '#E8E8E8',
          400: '#D0D0D0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold': '0 4px 24px rgba(212, 175, 55, 0.25)',
        'gold-lg': '0 8px 40px rgba(212, 175, 55, 0.35)',
        'card': '0 2px 12px rgba(0,0,0,0.08)',
        'card-lg': '0 8px 32px rgba(0,0,0,0.12)',
        'lift': '0 16px 48px rgba(0,0,0,0.16)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-gold': 'pulseGold 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-subtle': 'bounceSubtle 1.5s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideDown: { from: { opacity: '0', transform: 'translateY(-10px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { from: { opacity: '0', transform: 'scale(0.95)' }, to: { opacity: '1', transform: 'scale(1)' } },
        pulseGold: { '0%, 100%': { boxShadow: '0 0 0 0 rgba(212,175,55,0.4)' }, '50%': { boxShadow: '0 0 0 12px rgba(212,175,55,0)' } },
        bounceSubtle: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-4px)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-8px)' } },
      },
      backdropBlur: { xs: '2px' },
      screens: {
        xs: '375px',
      }
    },
  },
  plugins: [],
};
