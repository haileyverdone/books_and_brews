import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import dotenv from 'dotenv';

dotenv.config(); // Load .env variables

export default {
  kit: {
    adapter: adapter(),
    alias: {
      $lib: 'src/lib',
    },
  },
  preprocess: vitePreprocess(), // Add preprocessing
};
