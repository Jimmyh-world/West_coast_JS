/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['./src/**/*.test.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
    deps: {
      inline: ['@testing-library/jest-dom'],
    },
  },
});
