import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    // Test environment
    environment: 'jsdom',

    // Setup files
    setupFiles: ['./src/test/setup.ts'],

    // Global test utilities
    globals: true,

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData/',
        '**/types/',
        'dist/',
        '.eslintrc.cjs',
        'postcss.config.js',
        'tailwind.config.js',
        'vite.config.ts',
        'vitest.config.ts',
      ],
      // Coverage thresholds
      thresholds: {
        lines: 60,
        functions: 60,
        branches: 60,
        statements: 60,
      },
      // Include source files for accurate coverage
      include: ['src/**/*.{ts,tsx}'],
      all: true,
    },

    // Test file patterns
    include: ['**/*.{test,spec}.{ts,tsx}'],

    // Watch mode settings
    watchExclude: ['**/node_modules/**', '**/dist/**'],

    // Test timeout
    testTimeout: 10000,

    // Reporter
    reporters: ['verbose'],

    // Mock CSS modules
    css: {
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
