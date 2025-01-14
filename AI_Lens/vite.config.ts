import { defineConfig } from "vite";
import { resolve } from "path";
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  root: ".",
  base: "./",
  build: {
    assetsDir: "assets",
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        "pdf.worker": resolve(__dirname, "node_modules/pdfjs-dist/build/pdf.worker.mjs"),
      },
      output: {
        entryFileNames: "assets/[name].bundle.js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },

});
