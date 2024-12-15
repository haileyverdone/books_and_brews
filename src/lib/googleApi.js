export async function loadGoogleMaps() {
    // Ensure this only runs on the client side
    if (typeof window === 'undefined') return null;
  
    // Dynamically import @googlemaps/js-api-loader to avoid SSR errors
    const googleMapsLoader = await import('@googlemaps/js-api-loader');
    const { Loader } = googleMapsLoader;
  
    // Load the Google Maps API with the API key from your .env file
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_API_KEY, // Use Vite env variable
      libraries: ['geometry', 'places'], // Required libraries
    });
  
    return await loader.load();
  }
  
  /**
   * Geocode an address to latitude and longitude using Google Maps API.
   * @param {string} address - The location address to geocode.
   * @returns {Promise<{lat: number, lng: number}>} - The latitude and longitude of the address.
   */
  export async function geocodeLocation(address) {
    const google = await loadGoogleMaps();
    if (!google) throw new Error('Google Maps API failed to load.');
  
    const geocoder = new google.maps.Geocoder();
  
    return new Promise((resolve, reject) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK') {
          const { lat, lng } = results[0].geometry.location;
          resolve({ lat: lat(), lng: lng() });
        } else {
          reject(`Geocoding failed: ${status}`);
        }
      });
    });
  }
  
  /**
   * Calculate the distance (in meters) between two geographic coordinates.
   * @param {{lat: number, lng: number}} userLatLng - User's latitude and longitude.
   * @param {{lat: number, lng: number}} eventLatLng - Event's latitude and longitude.
   * @returns {number} - The distance in meters.
   */
  export async function calculateDistance(userLatLng, eventLatLng) {
    const google = await loadGoogleMaps();
    if (!google) throw new Error('Google Maps API failed to load.');
  
    const userLocation = new google.maps.LatLng(userLatLng.lat, userLatLng.lng);
    const eventLocation = new google.maps.LatLng(eventLatLng.lat, eventLatLng.lng);
  
    return google.maps.geometry.spherical.computeDistanceBetween(userLocation, eventLocation);
  }
  