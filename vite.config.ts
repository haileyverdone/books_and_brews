import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
  plugins: [sveltekit()],
  optimizeDeps: {
    exclude: ['chunk-BLHMZ75E', 'chunk-U6FMO7UD']
  }
});
