import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
  disable: process.env.DISABLE_PWA === '1',

  registerType: 'autoUpdate',
  includeAssets: ['icons/mira.svg','icons/mira.png'],
  manifest: false,
  workbox: {
    navigateFallback: '/index.html',
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/[^\/]+\.supabase\.co\/storage\/v1\/object\//,
        handler: 'CacheFirst',
        options: { cacheName: 'sb-storage', expiration: { maxEntries: 200, maxAgeSeconds: 604800 } }
      },
      {
        urlPattern: /^https:\/\/[^\/]+\.supabase\.co\/rest\/v1\//,
        handler: 'NetworkFirst',
        options: { cacheName: 'sb-rest', networkTimeoutSeconds: 10, expiration: { maxEntries: 200, maxAgeSeconds: 300 } }
      },
      {
        urlPattern: /\/assets\/.*\.(?:js|css|woff2)$/,
        handler: 'CacheFirst',
        options: { cacheName: 'static', expiration: { maxEntries: 400, maxAgeSeconds: 31536000 } }
      },
      {
        urlPattern: /https?:.*\.(?:png|jpg|jpeg|gif|webp|svg)/,
        handler: 'CacheFirst',
        options: { cacheName: 'images', expiration: { maxEntries: 300, maxAgeSeconds: 2592000 } }
      }
    ]
  }
})
  ],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  server: { proxy: { '/api': 'http://localhost:8787' } }
})
