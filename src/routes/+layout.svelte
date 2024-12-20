<script>
	import '../app.css';
	import Navbar from "../lib/+navbar.svelte";
	import { onMount } from 'svelte';

	
	function loadGoogleMapsApi() {
		return new Promise((resolve, reject) => {
			if (window.google) {
				resolve(); 
				return;
			}

			const script = document.createElement('script');
			script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_API_KEY}&libraries=places`;
			script.defer = true;
			script.async = true;
			script.onload = resolve; 
			script.onerror = reject; 
			document.head.appendChild(script);
		});
	}

	
	onMount(async () => {
		try {
			await loadGoogleMapsApi();
		} catch (error) {
			console.error('Failed to load Google Maps API:', error);
		}
	});
</script>

<Navbar />
<slot />
