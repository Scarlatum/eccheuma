import { defineConfig } from 'vitest/dist/config.js';
import { config as configEnviroment } from 'dotenv';

import path from 'path';

configEnviroment();

export default defineConfig({
  test: {
    exclude: ['node_modules', 'source', 'utils', 'app'],
    reporters: 'verbose',
    testTimeout: 12000,
    watch: false,
    setupFiles: [
      './vitest.setup.ts'
    ]
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './source'),
      'path::root': path.resolve(__dirname, '.')
    }
  },
  clearScreen: true,
  esbuild: {
    target: 'ES6'
  },
})