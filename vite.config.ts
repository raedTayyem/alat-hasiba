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
          // Vendor chunks for better caching
          if (id.includes('node_modules')) {
            // React & React Router in one chunk
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react';
            }
            // i18next in separate chunk
            if (id.includes('i18next') || id.includes('react-i18next')) {
              return 'vendor-i18n';
            }
            // UI libraries
            if (id.includes('lucide-react') || id.includes('headlessui') || id.includes('tailwind')) {
              return 'vendor-ui';
            }
            // Date libraries
            if (id.includes('date-fns')) {
              return 'vendor-date';
            }
            // Other vendors
            return 'vendor-misc';
          }

          // Split calculator data by category to reduce initial bundle
          if (id.includes('/data/calculators/')) {
            const match = id.match(/data\/calculators\/([^/]+)\.ts/);
            if (match && match[1] !== 'index' && match[1] !== 'types') {
              // Group smaller data files together
              const fileName = match[1];
              if (['categories', 'types'].includes(fileName)) {
                return 'data-core';
              }
              // Large data files get their own chunks
              if (['businessCalculators', 'constructionCalculators', 'electricalCalculators'].includes(fileName)) {
                return `data-${fileName.replace('Calculators', '')}`;
              }
              // Group other calculator data together
              return 'data-calculators';
            }
          }

          // Calculator component chunks by category
          if (id.includes('/calculators/')) {
            const match = id.match(/calculators\/([^/]+)\//);
            if (match) {
              const category = match[1];
              // Split large categories into smaller chunks
              if (category === 'agriculture') {
                // Agriculture has 10 calculators - keep together but optimize
                return 'calc-agriculture';
              }
              if (category === 'business') {
                // Business has 55+ calculators - split by file
                const fileMatch = id.match(/business\/([^.]+)/);
                if (fileMatch) {
                  const fileName = fileMatch[1];
                  // Group by first letter to create smaller chunks
                  const firstLetter = fileName.charAt(0).toLowerCase();
                  if (['a', 'b', 'c'].includes(firstLetter)) return 'calc-business-abc';
                  if (['d', 'e', 'f'].includes(firstLetter)) return 'calc-business-def';
                  if (['g', 'h', 'i', 'j', 'k', 'l'].includes(firstLetter)) return 'calc-business-ghl';
                  return 'calc-business-rest';
                }
                return 'calc-business';
              }
              if (category === 'construction') {
                // Construction has 40+ calculators - split by file
                const fileMatch = id.match(/construction\/([^.]+)/);
                if (fileMatch) {
                  const fileName = fileMatch[1];
                  const firstLetter = fileName.charAt(0).toLowerCase();
                  if (['a', 'b', 'c', 'd'].includes(firstLetter)) return 'calc-construction-abcd';
                  if (['e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'].includes(firstLetter)) return 'calc-construction-efgh';
                  return 'calc-construction-rest';
                }
                return 'calc-construction';
              }
              // Other categories
              return `calc-${category}`;
            }
          }

          // UI components
          if (id.includes('/components/ui/')) {
            return 'ui-components';
          }

          // Utils
          if (id.includes('/utils/')) {
            return 'utils';
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
    preprocessorOptions: {
      css: {
        charset: false, // Reduce CSS size by removing charset
      },
    },
  },
});
