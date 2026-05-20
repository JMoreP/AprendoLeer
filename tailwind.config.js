/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
      },
      colors: {
        primary: {
          50:  '#f5f0ff',
          100: '#ede0ff',
          200: '#d9bfff',
          300: '#bf95ff',
          400: '#a066ff',
          500: '#8040ff',
          600: '#6d20f5',
          700: '#5c14d9',
          800: '#4c12b0',
          900: '#3f1090',
        },
        coral: {
          400: '#ff7d6b',
          500: '#ff5c47',
          600: '#e8402b',
        },
        sunshine: {
          300: '#ffe066',
          400: '#ffd93d',
          500: '#ffc400',
        },
        mint: {
          400: '#6ee7b7',
          500: '#34d399',
          600: '#10b981',
        },
        sky: {
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
        },
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'wiggle': 'wiggle 0.5s ease-in-out',
        'pop': 'pop 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'energy-fill': 'energyFill 0.5s ease-out',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-5deg)' },
          '50%':       { transform: 'rotate(5deg)' },
        },
        pop: {
          '0%':   { transform: 'scale(0.8)', opacity: '0' },
          '70%':  { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)',   opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':       { transform: 'translateY(-10px)' },
        },
        energyFill: {
          '0%':   { width: '0%' },
          '100%': { width: 'var(--fill-width)' },
        },
      },
      dropShadow: {
        glow:        '0 0 12px rgba(128, 64, 255, 0.6)',
        'glow-gold': '0 0 12px rgba(255, 196, 0, 0.8)',
        'glow-mint': '0 0 12px rgba(52, 211, 153, 0.7)',
      },
      backgroundImage: {
        'gradient-candy': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-sky':   'linear-gradient(180deg, #a78bfa 0%, #60a5fa 100%)',
      },
    },
  },
  plugins: [],
}
