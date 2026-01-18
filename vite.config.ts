import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 2,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
      mangle: {
        safari10: true,
      },
      format: {
        comments: false,
      },
    },
    reportCompressedSize: true,
    cssCodeSplit: true,
    // Inline small assets to reduce HTTP requests
    assetsInlineLimit: 4096,
    // Chunk size warning
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor chunk splitting - extract shared dependencies
          if (id.includes('node_modules')) {
            // React core + React-dependent UI libraries - must load together
            if (id.includes('react/') || id.includes('react-dom/') || id.includes('@headlessui')) {
              return 'vendor-react';
            }

            // React Router - used by navigation
            if (id.includes('react-router-dom')) {
              return 'vendor-router';
            }

            // i18n ecosystem - used by all calculators
            if (id.includes('i18next') || id.includes('react-i18next')) {
              return 'vendor-i18n';
            }

            // Icons - used by all calculators
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }

            // Date utilities - used by date/time calculators
            if (id.includes('date-fns')) {
              return 'vendor-date';
            }

            // Helmet for SEO - used by all pages
            if (id.includes('react-helmet')) {
              return 'vendor-helmet';
            }

            // All other node_modules
            return 'vendor';
          }

          // Calculator chunks by category
          if (id.includes('/calculators/')) {
            const match = id.match(/calculators\/([^/]+)\//);
            if (match) {
              return `calc-${match[1]}`;
            }
          }
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  // Enable CSS optimization
  css: {
    devSourcemap: false,
  },
});
