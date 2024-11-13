import adapter from '@sveltejs/adapter-auto';
import dotenv from 'dotenv';

dotenv.config(); // Load .env variables

export default {
  kit: {
    adapter: adapter(),
    alias: {
      $lib: 'src/lib'
    }
  }
};
