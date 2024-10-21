import adapter from '@sveltejs/adapter-auto'; // Make sure the adapter is installed
import preprocess  from 'svelte-preprocess'; // Import preprocess

export default {
  preprocess: preprocess(), // Use preprocess for Svelte files
  kit: {
    adapter: adapter(), // Use the adapter for your deployment
  },
};
