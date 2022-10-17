import preprocess from 'svelte-preprocess';
import node from "@sveltejs/adapter-node";
import { resolve } from 'path';

const mode = process.env.NODE_ENV;
const production = mode === "production";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [
    preprocess({
      sourceMap: !production,
      postcss: {
        configFilePath: resolve("../../postcss.config.js")
      },
      typescript: {
        tsconfigFile: resolve("./tsconfig.app.json"),
      },
    })
  ],
  compilerOptions: {
    dev: !production,
    css: false,
  },
  kit: {
    adapter: node({
      out: "../../dist/apps/scraper",
    }),
    vite: {
      mode,
      resolve: {
        alias: {},
      },
      optimizeDeps: {
        include: [],
      },
      envPrefix: "BT_",
    },
  },
};

export default config;