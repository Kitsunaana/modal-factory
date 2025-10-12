import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      name: "TanstackStoreAdapter",
      fileName: (format) => `tanstack-store.${format}.js`
    },
    rollupOptions: {
      external: ["react", "react-dom", "@tanstack/react-store"]
    }
  }
});
