<script>
  import { onMount } from 'svelte';
  import { getDatabase, ref, onValue, push } from 'firebase/database';
  import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
  import { db, storage } from '$lib/firebaseConfig';

  let activeTab = 'view'; // 'view' for viewing events, 'create' for creating events
  let events = [];
  let showModal = false;

  let newEvent = {
    title: '',
    location: '',
    description: '',
    date: '',
    imageFile: null,
    imageUrl: '',
    lat: null,
    lng: null,
    type: '',
  };

  let locationSuggestions = [];
  let autocompleteService;
  let selectedLocation = null;

  // Fetch events from Firebase Realtime Database
  function fetchEvents() {
    const eventsRef = ref(getDatabase(), 'events');
    onValue(eventsRef, (snapshot) => {
      events = [];
      snapshot.forEach((childSnapshot) => {
        events.push(childSnapshot.val());
      });
    });
  }

  function handleFileInput(event) {
    newEvent.imageFile = event.target.files[0];
  }

  async function uploadImage(file) {
    if (!file) return null;
    try {
      const fileRef = storageRef(storage, `events/${file.name}`);
      await uploadBytes(fileRef, file);
      return await getDownloadURL(fileRef);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image.');
      throw error;
    }
  }

  async function createEvent(event) {
    event.preventDefault();
    try {
      if (!newEvent.title || !newEvent.location || !newEvent.date || !newEvent.description || !newEvent.type) {
        alert('All fields are required.');
        return;
      }

      const imageUrl = await uploadImage(newEvent.imageFile);
      const eventsRef = ref(getDatabase(), 'events');
      await push(eventsRef, { ...newEvent, imageUrl, createdAt: new Date() });

      alert('Event created successfully!');
      resetForm();
      showModal = false; // Close the modal
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event.');
    }
  }

  function resetForm() {
    newEvent = {
      title: '',
      location: '',
      description: '',
      date: '',
      imageFile: null,
      imageUrl: '',
      lat: null,
      lng: null,
      type: '',
    };
    locationSuggestions = [];
    selectedLocation = null;
  }

  function handleLocationInput(event) {
    const query = event.target.value;
    if (!query) {
      locationSuggestions = [];
      return;
    }

    if (!autocompleteService) {
      autocompleteService = new google.maps.places.AutocompleteService();
    }

    autocompleteService.getPlacePredictions(
      { input: query, types: ['geocode'], componentRestrictions: { country: 'us' } },
      (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          locationSuggestions = predictions.map((prediction) => ({
            description: prediction.description,
            placeId: prediction.place_id,
          }));
        } else {
          locationSuggestions = [];
        }
      }
    );
  }

  async function selectLocation(suggestion) {
  console.log('Selected Suggestion:', suggestion);
  const geocoder = new google.maps.Geocoder();
  try {
    const response = await geocoder.geocode({ placeId: suggestion.placeId });

    if (response.results.length) {
      const location = response.results[0].geometry.location;
      selectedLocation = {
        description: suggestion.description,
        lat: location.lat(),
        lng: location.lng(),
      };
      newEvent.location = suggestion.description;
      locationSuggestions = [];
      console.log('Location selected:', newEvent.location);
    }
  } catch (error) {
    console.error('Error selecting location:', error);
  }
}



  onMount(() => {
    fetchEvents();
  });
</script>

<!-- Navigation Tabs -->
<div class="container my-4">
  <ul class="nav nav-tabs">
    <li class="nav-item">
      <button
        class="nav-link {activeTab === 'view' ? 'active' : ''}"
        on:click={() => (activeTab = 'view')}
      >
        View Events
      </button>
    </li>
    <li class="nav-item">
      <button
        class="nav-link {activeTab === 'create' ? 'active' : ''}"
        on:click={() => (showModal = true)}
      >
        Create Event
      </button>
    </li>
  </ul>

  <!-- Events List -->
  {#if activeTab === 'view'}
    <div class="mt-4">
      <h2>All Events</h2>
      {#each events as event}
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">{event.title}</h5>
            <p class="card-text">{event.description}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
            {#if event.imageUrl}
              <img src={event.imageUrl} alt={event.title} class="img-fluid mt-2" />
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {/if}

  <!-- Create Event Modal -->
  {#if showModal}
    <div class="modal show d-block" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Create an Event</h5>
            <button type="button" class="btn-close" on:click={() => (showModal = false)}></button>
          </div>
          <div class="modal-body">
            <form on:submit|preventDefault={createEvent}>
              <div class="mb-3">
                <label for="title" class="form-label">Event Title:</label>
                <input
                  type="text"
                  id="title"
                  class="form-control"
                  bind:value={newEvent.title}
                  required
                />
              </div>
              <div class="mb-3 position-relative">
                <label for="location" class="form-label">Location:</label>
                <input
                  type="text"
                  id="location"
                  class="form-control"
                  bind:value={newEvent.location}
                  on:input={handleLocationInput}
                  required
                />
                {#if locationSuggestions.length}
                <ul class="list-group position-absolute w-100" style="z-index: 1050;">
                  {#each locationSuggestions as suggestion}
                    <li class="list-group-item">
                      <button
                        type="button"
                        class="btn w-100 text-start"
                        on:click={(event) => {
                          event.stopPropagation();
                          selectLocation(suggestion);
                        }}
                      >
                        {suggestion.description}
                      </button>
                    </li>
                  {/each}
                </ul>
                
                {/if}
              </div>
              <div class="mb-3">
                <label for="description" class="form-label">Description:</label>
                <textarea
                  id="description"
                  class="form-control"
                  rows="3"
                  bind:value={newEvent.description}
                  required
                ></textarea>
              </div>
              <div class="mb-3">
                <label for="date" class="form-label">Date:</label>
                <input
                  type="date"
                  id="date"
                  class="form-control"
                  bind:value={newEvent.date}
                  required
                />
              </div>
              <div class="mb-3">
                <label for="image" class="form-label">Upload Image:</label>
                <input
                  type="file"
                  id="image"
                  class="form-control"
                  on:change={handleFileInput}
                />
              </div>
              <div class="mb-3">
                <label for="type" class="form-label">Event Type:</label>
                <select id="type" class="form-control" bind:value={newEvent.type} required>
                  <option value="" disabled>Select type</option>
                  <option value="book">Book</option>
                  <option value="coffee">Coffee</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary w-100">Create Event</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .modal {
    background-color: rgba(0, 0, 0, 0.5);
  }
  .modal-content {
    border-radius: 12px;
    overflow: hidden;
  }


</style>
