<script>
  import { onMount } from "svelte";
  import { authState } from "$lib/stores"; // Assuming your authState is managed here
  import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
  import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
  import { db, storage } from "$lib/firebaseConfig";

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

  $: ({ isLoading, isLoggedIn, uid, userProfile } = $authState);

  let locationSuggestions = [];
  let autocompleteService;
  let selectedLocation = null;
  let selectedFilter = "";


  $: filteredEvents = selectedFilter
  ? events.filter((event) => event.type === selectedFilter)
  : events;

 async function fetchEvents() {
    try {
      const eventsCollection = collection(db, "events");
      const snapshot = await getDocs(eventsCollection);
      events = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      console.log("Fetched events:", events); // Debugging
    } catch (error) {
      console.error("Error fetching events:", error);
    }
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
    if (!isLoggedIn) {
      alert("You must be logged in to create an event.");
      return;
    }

    if (!newEvent.title || !newEvent.location || !newEvent.date || !newEvent.description || !newEvent.type) {
      alert("All fields are required.");
      return;
    }

    // Upload image to Firebase Storage
    const imageUrl = await uploadImage(newEvent.imageFile);

    // Create a new event without the `imageFile`
    const { imageFile, ...eventData } = newEvent;

    // Save the event to Firestore
    const eventsCollection = collection(db, "events");
    await addDoc(eventsCollection, {
      ...eventData,
      imageUrl,
      createdAt: new Date().toISOString(),
      userId: uid, // Include the user ID for tracking
    });

    alert("Event created successfully!");
    resetForm();
    showModal = false; // Close the modal
    fetchEvents(); // Refresh the events list
  } catch (error) {
    console.error("Error creating event:", error);
    alert("Failed to create event. Please try again.");
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
    {#if isLoggedIn}
    <li class="nav-item">
      <button
        class="nav-link {activeTab === 'create' ? 'active' : ''}"
        on:click={() => (showModal = true)}
      >
        Create Event
      </button>
    </li>
  {:else}
    <li class="nav-item">
      <button
        class="nav-link"
        on:click={() => alert("Please log in to create an event.")}
      >
        Create Event (Login Required)
      </button>
    </li>
  {/if}
</ul>

<!-- Events List -->
{#if activeTab === 'view'}
  <div class="mt-4">
    <h2>All Events</h2>

    <!-- Filter Dropdown -->
    <div class="mb-3">
      <label for="filterType" class="form-label">Filter by Type:</label>
      <select
        id="filterType"
        class="form-select"
        bind:value={selectedFilter}
      >
        <option value="">All</option>
        <option value="book">Book</option>
        <option value="coffee">Coffee</option>
        <option value="both">Both</option>
      </select>
    </div>

    <!-- Events Grid -->
    <div class="row g-3">
      {#each filteredEvents as event (event.id)}
        <div class="col-md-4">
          <div class="card h-100">
            {#if event.imageUrl}
              <img src={event.imageUrl} alt={event.title} class="card-img-top" />
            {/if}
            <div class="card-body">
              <h5 class="card-title">{event.title}</h5>
              <p class="card-text text-muted">{event.description}</p>
              <p><strong>Type:</strong> {event.type}</p>
              <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
              <p><strong>Location:</strong> {event.location}</p>
            </div>
          </div>
        </div>
      {/each}
    </div>
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

  .row {
  display: flex;
  flex-wrap: wrap;
  margin-left: -0.75rem;
  margin-right: -0.75rem;
}

.col-md-4 {
  flex: 0 0 33.333%;
  max-width: 33.333%;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}

.card {
  height: 100%;
}

.card-img-top {
  height: 150px; /* Adjust as needed */
  object-fit: cover;
}



</style>
