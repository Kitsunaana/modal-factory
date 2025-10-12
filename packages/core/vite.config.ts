/// <reference types="vitest/config" />

import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      name: "Core",
      fileName: (format) => `core.${format}.js`
    },
    rollupOptions: {
      external: []
    }
  },

  // @ts-ignore
  test: {
    typecheck: {
      enabled: true,
    },
  },
});
