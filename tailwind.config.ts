import type { Config } from 'tailwindcss'
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:'#fafafa',100:'#f4f4f5',200:'#e4e4e7',300:'#d4d4d8',400:'#a1a1aa',
          500:'#71717a',600:'#3f3f46',700:'#27272a',800:'#18181b',900:'#0a0a0a'
        },
        primary: '#0a0a0a'
      },
      borderRadius: { '2xl': '1.25rem', 'pill':'9999px' },
      boxShadow: { soft: '0 8px 24px -12px rgba(0,0,0,.25)' }
    }
  },
  plugins: [require('@tailwindcss/typography')]
} satisfies Config
