import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef7ff',
          100: '#d9ecff',
          200: '#bcdcff',
          300: '#8ec4ff',
          400: '#58a4ff',
          500: '#2a7dff',
          600: '#1b5fe6',
          700: '#174bc0',
          800: '#173e96',
          900: '#183a78',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.06), 0 4px 8px rgba(0,0,0,0.04)'
      }
    },
  },
  plugins: [],
} satisfies Config
