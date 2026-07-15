/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Base neutrals — warm-black, not pure #000, so gold reads richer against it
        ink: {
          950: '#08080A',
          900: '#0E0E11',
          850: '#131317',
          800: '#18181D',
          700: '#212127',
          600: '#2B2B32',
          500: '#3D3D46',
          400: '#5A5A64',
        },
        mist: {
          400: '#75757F',
          300: '#93939C',
          200: '#B4B4BC',
          100: '#DADAE0',
          50: '#F3F3F1',
        },
        gold: {
          700: '#8A6A2E',
          600: '#A8823E',
          500: '#C9A961',
          400: '#DBC17F',
          300: '#E9D9A8',
          glow: 'rgba(201,169,97,0.35)',
        },
        emerald: {
          500: '#3FA772',
          400: '#57C08A',
        },
        ruby: {
          500: '#C9524F',
          400: '#E17471',
        },
        amber: {
          500: '#C98A3F',
          400: '#E0A85B',
        },
        azure: {
          500: '#3F7FC9',
          400: '#5B9BE0',
        },
      },
      fontFamily: {
        display: ['"Manrope"', 'sans-serif'],
        sans: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.4), 0 8px 24px -12px rgba(0,0,0,0.5)',
        'card-hover': '0 1px 2px rgba(0,0,0,0.5), 0 16px 40px -12px rgba(0,0,0,0.65)',
        gold: '0 0 0 1px rgba(201,169,97,0.4), 0 8px 24px -8px rgba(201,169,97,0.25)',
        inset: 'inset 0 1px 0 rgba(255,255,255,0.04)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: 0, transform: 'translateY(6px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: 0, transform: 'scale(0.97)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        'needle-sweep': {
          '0%': { transform: 'rotate(-90deg)' },
          '100%': { transform: 'rotate(var(--needle-angle))' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.35s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        shimmer: 'shimmer 1.6s infinite linear',
        'needle-sweep': 'needle-sweep 1s cubic-bezier(0.22,1,0.36,1) forwards',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
