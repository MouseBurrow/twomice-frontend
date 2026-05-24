import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig({
    base: "/",
    plugins: [
        svgr(),
        react({
            babel: {
                plugins: [['babel-plugin-react-compiler']],
            },
        }),
    ],
    server: {
        port: 5173,
        proxy: {
            "/api": {
                target: process.env.VITE_API_PROXY || "http://localhost:8080",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
        },
    },
})
