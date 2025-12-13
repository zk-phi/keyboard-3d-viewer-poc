import { resolve } from "path";
import { defineConfig } from "vite"
import obfuscatorPlugin from "vite-plugin-javascript-obfuscator";

export default defineConfig({
  base: "./",
  plugins: [
    obfuscatorPlugin({
      apply: "build",
      options: {
        splitStrings: true,
        splitStringsChunkLength: 4,
      },
    }),
  ],
  build: {
    outDir: resolve(__dirname, "dist"),
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        switch42: resolve(__dirname, "switch42.html"),
        morpho: resolve(__dirname, "morpho.html"),
        gemini: resolve(__dirname, "gemini.html"),
        kastor2: resolve(__dirname, "kastor2.html"),
        kastor: resolve(__dirname, "kastor.html"),
        wym16: resolve(__dirname, "wym16.html"),
        hifumi: resolve(__dirname, "hifumi.html"),
      },
    },
  }
});
