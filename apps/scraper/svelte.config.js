import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-auto';
import { resolve } from 'path';

const production = process.env.NODE_ENV === "production";

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
		adapter: adapter()
	}
};

export default config;