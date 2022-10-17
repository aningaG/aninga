import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

console.log('exec path:', process.cwd());

const config: UserConfig = {
  plugins: [sveltekit()],
  server: {
    fs: {
      allow: ['../../node_modules/@sveltejs']
    }
  }
};

export default config;
