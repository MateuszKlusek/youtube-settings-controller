import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: false,
    rollupOptions: {
      input: {
        "scripts/navigation-data": "scripts/navigation-data.ts",
      },
      output: {
        entryFileNames: "[name].js",
        inlineDynamicImports: true,
        format: "iife",
      },
    },
  },
});
