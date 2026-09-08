import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
    },
    // Built assets land directly under the RCL wwwroot folder, which is
    // published as /App_Plugins/UmbracoCatalyst/ via StaticWebAssetBasePath.
    outDir: "../wwwroot/UmbracoCatalyst/dist",
    emptyOutDir: false,
    sourcemap: false,
    rollupOptions: {
      external: [/^@umbraco-cms\//],
      output: {
        entryFileNames: "catalyst.js",
        chunkFileNames: "[name].js",
      },
    },
  },
  base: "/App_Plugins/UmbracoCatalyst/dist/",
});
