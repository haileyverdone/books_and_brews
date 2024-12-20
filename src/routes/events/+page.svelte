<script>
  import { onMount } from "svelte";
  import { authState } from "$lib/stores"; // Assuming your authState is managed here
  import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
  import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
  import { db, storage } from "$lib/firebaseConfig";

  let activeTab = 'view'; 
  let events = [];
  let showModal = false;

  let isMobile = false;
  let imagePreview = null;
  let detailedEvent = null; 
  let showDetailModal = false;

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

  onMount(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      userAgent.toLowerCase()
    );
    console.log("Is Mobile:", isMobile); 
    fetchEvents();
  });

  async function fetchEvents() {
  try {
    const eventsCollection = collection(db, "events");
    const snapshot = await getDocs(eventsCollection);
    events = snapshot.docs.map((doc) => {
      const data = doc.data();
      console.log(`Fetched event: ${doc.id}`, data); // Debugging
      return { id: doc.id, ...data };
    });
  } catch (error) {
    console.error("Error fetching events:", error);
  }
}


  function handleFileInput(event) {
    const file = event.target.files[0];
    if (file) {
      newEvent.imageFile = file;
      imagePreview = URL.createObjectURL(file);
      console.log("Selected File:", file); 
    }
  }

  async function uploadImage(file) {
    if (!file) return null;
    try {
      const fileRef = storageRef(storage, `events/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      return await getDownloadURL(fileRef);
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Image upload failed.");
    }
  }

      function toggleFavorite(eventId) {
      // Find the event by ID and toggle its favorite status
      const eventIndex = events.findIndex((event) => event.id === eventId);
      if (eventIndex > -1) {
        events[eventIndex].isFavorite = !events[eventIndex].isFavorite;

        // Save the updated event to Firestore
        const eventDocRef = doc(db, "events", eventId);
        updateDoc(eventDocRef, { isFavorite: events[eventIndex].isFavorite })
          .then(() => console.log(`Event ${eventId} favorite status updated.`))
          .catch((error) => console.error("Error updating favorite status:", error));
      }
    }

    function openDetailModal(eventId) {
      // Find the event by ID and set it as the detailedEvent
      detailedEvent = events.find((event) => event.id === eventId);
      showDetailModal = true;
    }

    function closeDetailModal() {
      detailedEvent = null;
      showDetailModal = false;
    }

  async function createEvent(event) {
  event.preventDefault();

  if (!isLoggedIn) {
    alert("You must be logged in to create an event.");
    return;
  }

  if (!newEvent.title || !newEvent.location || !newEvent.date || !newEvent.description || !newEvent.type) {
    alert("All fields are required.");
    return;
  }

  try {
    const imageUrl = newEvent.imageFile
      ? await uploadImage(newEvent.imageFile)
      : null;

    const { imageFile, ...eventData } = newEvent;

    const eventsCollection = collection(db, "events");
    await addDoc(eventsCollection, {
      ...eventData,
      imageUrl,
      createdAt: new Date().toISOString(),
      userId: uid,
    });

    alert("Event created successfully!");
    resetForm();
    showModal = false;
    fetchEvents();
  } catch (error) {
    console.error("Error creating event:", error);
    alert("Event creation failed.");
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
    imagePreview= null;
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
</div>

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
            <!-- Event Image -->
            <button
            class="image-button"
            on:click={() => openDetailModal(event.id)}
            on:keydown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') openDetailModal(event.id);
            }}
            aria-label={`View details of ${event.title}`}
          >
            <img
              src={event.imageUrl || '/placeholder.jpeg'}
              alt={event.title || 'Event Image'}
              class="card-img-top"
              onerror="this.onerror=null;this.src='/placeholder.jpeg';"
            />
          </button>                  
            <!-- Event Card Body -->
            <div class="card-body">
              <div class="card-title-container">
                <h5 class="card-title">{event.title}</h5>
                <button
                  class="favorite-btn"
                  on:click={() => toggleFavorite(event.id)}
                  title="Favorite"
                >
                  {event.isFavorite ? "★" : "☆"} 
                </button>
              </div>
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

  {#if showDetailModal}
  <div class="detail-modal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{detailedEvent.title || "Event Details"}</h2>
        <!-- Single close button -->
        <button class="btn-close" on:click={closeDetailModal} aria-label="Close"></button>
      </div>
      <div class="modal-body">
        {#if detailedEvent}
        <img
          src={detailedEvent.imageUrl || "/placeholder.jpeg"}
          alt={detailedEvent.title || "Event Image"}
          class="modal-img"
          onerror="this.onerror=null;this.src='/placeholder.jpeg';"
        />
        <form>
          <div class="mb-3">
            <label for="eventTitle" class="form-label">Title</label>
            <input
              id="eventTitle"
              class="form-control"
              type="text"
              value={detailedEvent.title}
              readonly
            />
          </div>
          <div class="mb-3">
            <label for="eventDescription" class="form-label">Description</label>
            <textarea
              id="eventDescription"
              class="form-control"
              rows="3"
              readonly
            >{detailedEvent.description}</textarea>
          </div>
          <div class="mb-3">
            <label for="eventDate" class="form-label">Date</label>
            <input
              id="eventDate"
              class="form-control"
              type="date"
              value={detailedEvent.date}
              readonly
            />
          </div>
          <div class="mb-3">
            <label for="eventLocation" class="form-label">Location</label>
            <input
              id="eventLocation"
              class="form-control"
              type="text"
              value={detailedEvent.location}
              readonly
            />
          </div>
        </form>
        {/if}
      </div>
    </div>
  </div>
  {/if}
  
  

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
              {#if isMobile}
                <div>
                  <input
                    type="file"
                    id="image"
                    class="form-control"
                    accept="image/*"
                    capture="environment"
                    on:change={handleFileInput}
                  />
                </div>
              {:else}
                <div>
                  <input
                    type="file"
                    id="image"
                    class="form-control"
                    accept="image/*"
                    on:change={handleFileInput}
                  />
                </div>
              {/if}
              {#if imagePreview}
                <div class="mt-3">
                  <img src={imagePreview} alt="" class="img-thumbnail" />
                </div>
              {/if}
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
    max-width: 300px; 
    margin: auto; 
    height: auto; 
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
    border-radius: 12px; 
    overflow: hidden; 
    transition: transform 0.2s ease, box-shadow 0.2s ease; 
  }

  .card:hover {
    transform: scale(1.05); 
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); 
  }

  .card-img-top {
    height: 150px; 
    object-fit: cover; 
    border-radius: 12px 12px 0 0; 
  }

  .detail-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    border-radius: 12px;
    z-index: 1050;
    width: 90%;
    max-width: 400px; 
    padding: 20px; 
  }

  .detail-modal .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px; 
  }

  .detail-modal .btn-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }

  .detail-modal img {
    width: 100%;
    height: auto;
    border-radius: 8px;
    margin-bottom: 15px;
  }

  .detail-modal h2 {
    margin-bottom: 10px;
    font-size: 1.5rem;
  }

  .img-thumbnail {
    max-width: 100%;
    height: auto;
    border: 2px solid #ddd;
    border-radius: 8px;
  }

  .form-label {
    font-weight: bold;
  }

  .form-control {
    font-size: 0.9rem;
    padding: 8px;
  }

  .image-button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    display: block;
    width: 100%;
    outline: none;
  }

  .image-button img {
    border-radius: 8px; 
  }

</style>
