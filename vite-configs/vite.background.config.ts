import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: false,
    rollupOptions: {
      input: {
        background: "src/background.ts",
      },
      output: {
        entryFileNames: "[name].js",
        inlineDynamicImports: true,
      },
    },
  },
});
