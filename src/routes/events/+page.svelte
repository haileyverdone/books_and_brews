<script>
  import { getDatabase, ref, push } from 'firebase/database';
  import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
  import { geocodeLocation } from '$lib/googleApi';
  import { loadGoogleMapsAutocomplete } from '$lib/googleAutocomplete';
  import { db } from '$lib/firebaseConfig';

  const storage = getStorage();

  let newEvent = {
    title: '',
    location: '',
    description: '',
    date: '',
    imageFile: null,
    imageUrl: '',
    lat: null,
    lng: null,
  };

  function handleFileInput(event) {
    newEvent.imageFile = event.target.files[0];
  }

  async function uploadImage(file) {
    if (!file) return null;
    try {
      const fileRef = storageRef(storage, `events/${file.name}`);
      await uploadBytes(fileRef, file);
      const downloadUrl = await getDownloadURL(fileRef);
      return downloadUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image.');
      throw error;
    }
  }

  async function createEvent(event) {
    event.preventDefault();
    try {
      // Validate required fields
      if (!newEvent.title || !newEvent.location || !newEvent.date || !newEvent.description) {
        alert("All fields are required.");
        return;
      }

      // Geocode the location
      const userLatLng = await geocodeLocation(newEvent.location);
      if (!userLatLng) {
        alert("Invalid location. Please try again.");
        return;
      }

      // Upload image to Firebase Storage
      const imageUrl = await uploadImage(newEvent.imageFile);

      // Set latitude, longitude, and image URL in the event data
      newEvent.lat = userLatLng.lat;
      newEvent.lng = userLatLng.lng;
      newEvent.imageUrl = imageUrl;

      // Save event data to Firebase Realtime Database
      const eventsRef = ref(getDatabase(), 'events');
      await push(eventsRef, { ...newEvent, createdAt: new Date() });

      alert("Event created successfully!");
      resetForm();
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event.");
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
    };
  }

  onMount(() => {
    loadGoogleMapsAutocomplete('location-input', place => {
      newEvent.location = place.formatted_address;
    });
  });
</script>

<!-- Event Creation Form -->
<div class="container my-5">
  <div class="card mx-auto form-container bg-light text-dark" style="max-width: 600px;">
    <div class="card-body">
      <h2 class="card-title text-center mb-4">Create an Event</h2>
      <form on:submit|preventDefault={createEvent}>
        <div class="mb-3">
          <label for="title" class="form-label">Event Title:</label>
          <input
            type="text"
            id="title"
            class="form-control"
            placeholder="Enter the event title"
            bind:value={newEvent.title}
            required
          />
        </div>
        <div class="mb-3">
          <label for="location-input" class="form-label">Location (City/ZIP):</label>
          <input
            type="text"
            id="location-input"
            class="form-control"
            placeholder="Enter city or ZIP code"
            bind:value={newEvent.location}
            required
          />
        </div>
        <div class="mb-3">
          <label for="description" class="form-label">Description:</label>
          <textarea
            id="description"
            class="form-control"
            rows="3"
            placeholder="Enter event description"
            bind:value={newEvent.description}
            required
          ></textarea>
        </div>
        <div class="mb-3">
          <label for="date" class="form-label">Event Date:</label>
          <input
            type="date"
            id="date"
            class="form-control"
            bind:value={newEvent.date}
            required
          />
        </div>
        <div class="mb-3">
          <label for="image" class="form-label">Upload Event Image:</label>
          <input
            type="file"
            id="image"
            class="form-control"
            accept="image/*"
            on:change={handleFileInput}
          />
        </div>
        <button type="submit" class="btn btn-primary w-100">Create Event</button>
      </form>
    </div>
  </div>
</div>
