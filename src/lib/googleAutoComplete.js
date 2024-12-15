export function loadGoogleMapsAutocomplete(inputId, onPlaceSelected) {
    if (typeof window === 'undefined') return; // SSR check
  
    import('@googlemaps/js-api-loader').then(({ Loader }) => {
      const loader = new Loader({
        apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
        libraries: ['places'],
      });
  
      loader.load().then(google => {
        const input = document.getElementById(inputId);
        const autocomplete = new google.maps.places.Autocomplete(input);
  
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          onPlaceSelected(place);
        });
      });
    });
  }
  