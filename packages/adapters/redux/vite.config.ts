import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      name: "ReduxAdapter",
      fileName: (format) => `redux.${format}.js`
    },
    rollupOptions: {
      external: ["@modal-factory/core", "redux"]
    }
  }
});
