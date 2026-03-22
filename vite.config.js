import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = env.VITE_PROXY_TARGET || 'http://127.0.0.1:5001'

  return {
    plugins: [react()],
    server: {
      proxy: {
        '^/casamentos': { target: proxyTarget, changeOrigin: true },
        '^/checklists': { target: proxyTarget, changeOrigin: true },
        '^/health': { target: proxyTarget, changeOrigin: true },
        '^/swagger': { target: proxyTarget, changeOrigin: true },
      },
    },
  }
})
