import type { Config } from 'tailwindcss'
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1rem'
    },
    extend: {
      colors: {
        brand: {
          50:'#eef4ff',100:'#dbe7ff',200:'#b6cfff',300:'#8fb6ff',400:'#5e95ff',
          500:'#3e7ff5',600:'#2f61db',700:'#274db0',800:'#1f3d88',900:'#1b346e'
        }
      },
      borderRadius: { '2xl': '1.25rem' }
    }
  },
  plugins: [require('@tailwindcss/typography')]
} satisfies Config
