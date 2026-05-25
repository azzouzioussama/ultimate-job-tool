import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    allowedHosts: true,
    proxy: {
      '/api/latex': {
        target: 'https://texlive.net',
        changeOrigin: true,
        rewrite: (path) => '/cgi-bin/latexcgi',
      },
      '/latexcgi': {
        target: 'https://texlive.net',
        changeOrigin: true,
      },
      '/api/scrapfly': {
        target: 'https://api.scrapfly.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/scrapfly/, '/scrape'),
      }
    }
  }
})
