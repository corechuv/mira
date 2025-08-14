import type { Config } from 'tailwindcss'
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:'#f6f7ff',100:'#e8ebff',200:'#cfd6ff',300:'#a8b6ff',
          400:'#7e94ff',500:'#4d69ff',600:'#2f4ee6',700:'#243dbc',
          800:'#1e3498',900:'#1a2b7b'
        }
      },
      borderRadius: { '2xl': '1.25rem', '3xl': '1.75rem' },
      boxShadow: {
        card: '0 8px 24px rgba(0,0,0,.06)',
        soft: '0 2px 10px rgba(0,0,0,.05)'
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
} satisfies Config
