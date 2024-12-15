<script>
  import { authState } from '$lib/stores';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { getDatabase, ref, get, push } from 'firebase/database';
  import { geocodeLocation, calculateDistance } from '$lib/googleApi';
  import { loadGoogleMapsAutocomplete } from '$lib/googleAutocomplete'; // Helper for autocomplete
  import { db } from '$lib/firebaseConfig';

  let isLoading = true; // Initial loading state
  let isFindingNearby = false; // Loading state for nearby events
  let isLoggedIn = false;

  // Reactive auth state
  $: ({ isLoading, isLoggedIn } = $authState);

  // Events data
  let events = [];
  let filteredEvents = [];
  let searchTerm = '';
  let selectedCategory = '';
  let userLocation = '';
  const maxDistance = 50000; // 50 km

  // Event creation form data
  let newEvent = {
    title: '',
    description: '',
    category: '',
    date: '',
    location: '',
    lat: null,
    lng: null,
    imageUrl: '',
  };

  // Load all events
  onMount(async () => {
    try {
      const eventsRef = ref(db, 'events');
      const snapshot = await get(eventsRef);
      if (snapshot.exists()) {
        events = Object.values(snapshot.val());
        filteredEvents = events;
      }
      loadGoogleMapsAutocomplete('location-input', onLocationSelected);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      isLoading = false;
    }
  });

  // Handle Google Maps Autocomplete selection
  function onLocationSelected(place) {
    newEvent.location = place.formatted_address;
    newEvent.lat = place.geometry.location.lat();
    newEvent.lng = place.geometry.location.lng();
  }

  // Create a new event
  async function createEvent() {
    if (!newEvent.title || !newEvent.location || !newEvent.category || !newEvent.date) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      const eventsRef = ref(db, 'events');
      await push(eventsRef, newEvent);
      alert('Event created successfully!');
      location.reload();
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event. Please try again.');
    }
  }

  // Find nearby events
  async function findNearbyEvents() {
    if (!userLocation) {
      alert('Please enter a location.');
      return;
    }

    isFindingNearby = true;
    try {
      const userLatLng = await geocodeLocation(userLocation);
      if (!userLatLng) {
        alert('Unable to determine location.');
        return;
      }

      filteredEvents = events.filter(event => {
        if (event.lat && event.lng) {
          const distance = calculateDistance(userLatLng, { lat: event.lat, lng: event.lng });
          return distance <= maxDistance;
        }
        return false;
      });

      if (filteredEvents.length === 0) {
        alert('No nearby events found.');
      }
    } catch (error) {
      console.error('Error finding nearby events:', error);
      alert('Failed to find events. Please try again.');
    } finally {
      isFindingNearby = false;
    }
  }

  // Navigation helpers
  function handleLoginRedirect() {
    goto('/login');
  }

  function handleRegisterRedirect() {
    goto('/register');
  }
</script>

{#if isLoading}
  <p>Loading events...</p>
{:else if isLoggedIn}
  <!-- Event Creation Form -->
  <section class="event-form">
    <h2>Create a New Event</h2>
    <input type="text" placeholder="Event Title" bind:value={newEvent.title} required />
    <textarea placeholder="Description" bind:value={newEvent.description} required></textarea>
    <select bind:value={newEvent.category} required>
      <option value="" disabled selected>Select Category</option>
      <option value="book">Book Event</option>
      <option value="coffee">Coffee Event</option>
      <option value="mixed">Mixed Event</option>
    </select>
    <input type="date" bind:value={newEvent.date} required />
    <input
      id="location-input"
      type="text"
      placeholder="Enter City or ZIP Code"
      bind:value={newEvent.location}
      required
    />
    <button on:click={createEvent}>Create Event</button>
  </section>

  <!-- Search, Filter, and Nearby Events -->
  <section class="events">
    <div class="filters">
      <input type="text" placeholder="Search..." bind:value={searchTerm} />
      <select bind:value={selectedCategory}>
        <option value="">All Categories</option>
        <option value="book">Book Events</option>
        <option value="coffee">Coffee Events</option>
      </select>
      <input
        type="text"
        placeholder="Enter your location"
        bind:value={userLocation}
      />
      <button on:click={findNearbyEvents} disabled={isFindingNearby}>
        {isFindingNearby ? 'Finding...' : 'Find Nearby Events'}
      </button>
    </div>

    <!-- Events Grid -->
    {#if filteredEvents.length > 0}
      <div class="events-grid">
        {#each filteredEvents as event}
          <div class="event-card">
            <h3>{event.title || 'Untitled Event'}</h3>
            <p>{event.description || 'No description available.'}</p>
            <p><strong>Category:</strong> {event.category || 'N/A'}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>Date:</strong> {event.date}</p>
          </div>
        {/each}
      </div>
    {:else}
      <p>No events match your search or location filter.</p>
    {/if}
  </section>
{:else}
  <div>
    <h2>You must log in to view and create events.</h2>
    <button on:click={handleLoginRedirect}>Log In</button>
    <button on:click={handleRegisterRedirect}>Register</button>
  </div>
{/if}

<style>
  /* Same CSS as before with form added */
  .event-form {
    margin-bottom: 2rem;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    background: #f9f9f9;
  }

  .filters, .event-form input, .event-form textarea, .event-form select, .event-form button {
    margin-bottom: 1rem;
  }

  .events-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
  }

  .event-card {
    border: 1px solid #ddd;
    padding: 1rem;
    border-radius: 5px;
    background-color: white;
  }
</style>
