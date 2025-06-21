import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from "path";

export default defineConfig({
  plugins: [
    react(),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      reporter: ['text', 'lcov', 'cobertura'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        "src/test/**",
        "src/**/*.d.ts",
         "src/**/*.interface.ts",
        "src/**/types/*",
        "src/**/*.type.ts",
        "**/index.ts",
        "src/models/**",
        "src/**/*.d.ts",
        "dist/**",
        "node_modules/**",
        "**/*.config.ts",
        "**/*.json",
        "**/src/components/ui/**",
        "**/src/schemas/**",
        "**/src/constants/**",
      ]
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
   css: {
    modules: {
      globalModulePaths: [/globals\.css$/],
    },
  },
  
})
