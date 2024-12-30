// vite.config.ts

import * as path from "path";

import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import svgr from "vite-plugin-svgr";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "lib/index.tsx"),
      name: "index",
      fileName: "index",
    },
    rollupOptions: {
      external: ["react"],
      output: {
        globals: {
          react: "React",
        },
      },
    },
    commonjsOptions: {
      esmExternals: ["react"],
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  plugins: [
    react(),
    dts({ tsconfigPath: "./tsconfig.app.json" }),
    svgr({
      include: "**/*.svg?react",
    }),
  ],
});
