/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  presets: [require('nativewind/preset')],
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
        },
      },
      fontFamily: {
        sans: ['Inter_400Regular', 'System'],
        medium: ['Inter_500Medium', 'System'],
        bold: ['Inter_700Bold', 'System'],
        black: ['Inter_900Black', 'System'],
      },
      borderRadius: {
        '2xl': 16,
        '3xl': 24,
        '4xl': 32,
      },
    },
  },
  plugins: [],
};
