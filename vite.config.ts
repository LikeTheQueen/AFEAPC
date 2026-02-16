import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from 'path';
//import react from '@vitejs/plugin-react';



export default defineConfig({
  server: { proxy: { "/functions/v1": "http://127.0.0.1:54321" }
    /*proxy: {
      '/api': {
        target: 'https://executedemo.quorumsoftware.com/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },*/
  },
  plugins: [!process.env.VITEST && reactRouter(), tailwindcss(), tsconfigPaths()],
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src'),
      provider: path.resolve(__dirname, 'provider'),  // ← is this here?
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
    include: ['__tests__/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
