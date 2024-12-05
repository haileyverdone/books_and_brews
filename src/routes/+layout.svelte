<script>
	import '../app.css';
	import Navbar from "../lib/+navbar.svelte";
	import { onMount } from 'svelte';

	// Helper function to load the Google Maps script
	function loadGoogleMapsApi() {
		return new Promise((resolve, reject) => {
			if (window.google) {
				resolve(); // Google Maps is already loaded
				return;
			}

			const script = document.createElement('script');
			script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_API_KEY}&libraries=places`;
			script.defer = true;
			script.async = true;
			script.onload = resolve; // Resolve promise once script loads
			script.onerror = reject; // Reject promise if script fails to load
			document.head.appendChild(script);
		});
	}

	// Load the Google Maps API on mount
	onMount(async () => {
		try {
			await loadGoogleMapsApi();
			console.log('Google Maps API loaded successfully.');
		} catch (error) {
			console.error('Failed to load Google Maps API:', error);
		}
	});
</script>

<Navbar />
<slot />
