<script>
import { authState } from '$lib/stores';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '$lib/firebaseConfig';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { goto } from '$app/navigation';

const storage = getStorage();

let bookTitle = "";
let coffeeShop = "";
let description = "";
let imageFile = null;
let errorMessage = "";
let suggestions = [];
let showSuggestions = false;
let placesSuggestions = [];



$: ({ isLoading, isLoggedIn, uid, userProfile } = $authState);

// Redirect unauthenticated users
$: if (!isLoading && !isLoggedIn) {
  goto('/login');
}

  // Handle file input
  function handleFileInput(event) {
    imageFile = event.target.files[0];
  }

  async function uploadImage(imageFile, uid) {
  if (!imageFile) return null;

  try {
    const storageRef = ref(storage, `posts/${uid}/${imageFile.name}`);
    await uploadBytes(storageRef, imageFile); // Upload file
    const downloadURL = await getDownloadURL(storageRef); // Get public URL
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image.');
  }
}

  // Fetch book suggestions from Open Library API
  let debounceTimeout;
  async function fetchBookSuggestions(query) {
     clearTimeout(debounceTimeout);

    if (!query || !showSuggestions) {
      suggestions = [];
      showSuggestions = false;
      return;
    }

    debounceTimeout = setTimeout(async () => {
      try {
        const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        const data = await response.json();
        suggestions = data.docs.slice(0, 5).map((book) => ({
          title: book.title,
          author: book.author_name?.[0] || "Unknown Author",
          cover: book.cover_i
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
            : "https://via.placeholder.com/50x75?text=No+Cover",
        }));
        showSuggestions = suggestions.length > 0;
      } catch (error) {
        console.error("Error fetching book suggestions:", error);
      }
    }, 300);
  }

  
  function initializePlacesAutocomplete() {
  const input = document.getElementById('coffeeShop');
  autocomplete = new google.maps.places.Autocomplete(input, {
    types: ['establishment'],
  });

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();

    if (place) {
      coffeeShop = place.name;
      placesSuggestions = [
        {
          name: place.name,
          address: place.formatted_address || 'Address unavailable',
          logo:
            place.photos && place.photos.length > 0
              ? place.photos[0].getUrl({ maxWidth: 50, maxHeight: 50 })
              : 'https://via.placeholder.com/50',
        },
      ];
    }
  });
}

  
async function fetchPlacesSuggestions(query) {
  if (!query) {
    placesSuggestions = [];
    return;
  }

  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${apiKey}&types=establishment`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    placesSuggestions = data.predictions.map((place) => ({
      placeId: place.place_id,
      description: place.description,
    }));

  
    for (let suggestion of placesSuggestions) {
      const details = await fetchPlaceDetails(suggestion.placeId);
      suggestion.name = details.name || suggestion.description;
      suggestion.address = details.formatted_address || "Address unavailable";
      suggestion.logo =
        details.photos && details.photos.length > 0
          ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=100&photoreference=${details.photos[0].photo_reference}&key=${apiKey}`
          : "https://via.placeholder.com/100"; // Default placeholder if no photo
    }
  } catch (error) {
    console.error("Error fetching coffee shop suggestions:", error);
  }
}


      async function fetchPlaceDetails(placeId) {
        const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`;

        try {
          const response = await fetch(detailsUrl);
          const data = await response.json();

          if (data.status === "OK") {
            return data.result;
          } else {
            console.error("Error fetching place details:", data.status);
            return {};
          }
        } catch (error) {
          console.error("Error fetching place details:", error);
          return {};
        }
      }


  
  // Create post
  async function createPost(event) {
    event.preventDefault();

 
    if (!isLoggedIn || !uid) {
      errorMessage = "You must be logged in to create a post.";
      return;
    }

    try {
    let imageUrl = null;
    if (imageFile) {
      imageUrl = await uploadImage(imageFile, uid);
    }

    const postData = {
      userId: uid,
      username: userProfile?.username || "Unknown User", 
      bookTitle,
      coffeeShop,
      description,
      imageUrl: imageUrl || "", 
      createdAt: new Date(),
    };
      
      await addDoc(collection(db, "posts"), postData);

      bookTitle = "";
      coffeeShop = "";
      description = "";
      imageFile = null;

      goto("/explore");
    } catch (error) {
      console.error("Error creating post:", error);
      errorMessage = "Failed to create post.";
    }
  }
</script>

<!-- Render the page -->
{#if isLoading}
  <div class="loading">
    <p>Loading...</p>
  </div>
{:else if !isLoggedIn}
  <div class="guest-container">
    <h2>Welcome to Books & Brews</h2>
    <p>You need to log in or create an account to create a post.</p>
    <button on:click={() => goto('/login')}>Log In</button>
    <button on:click={() => goto('/register')}>Sign Up</button>
  </div>
{:else}
  <div class="form-container">
    <h2>Create a Post!</h2>
    <form on:submit|preventDefault={createPost}>
      <!-- Book Title -->
      <div class="input-container">
        <label for="bookTitle">Book Title:</label>
        <input
          type="text"
          id="bookTitle"
          bind:value={bookTitle}
          placeholder="Enter the book title"
          on:input={() => 
            fetchBookSuggestions(bookTitle)}
        />
        {#if showSuggestions}
          <ul class="suggestions">
            {#each suggestions as book, index}
              <li>
                <button
                type="button"
                on:click={() => {
                  bookTitle = book.title;
                  suggestions = [];
                  showSuggestions = false; 
                }}
              >
                  <img src={book.cover} alt="{book.title}" class="book-cover" />
                  <div class="book-info">
                    <span class="book-title">{book.title}</span>
                    <span class="book-author">{book.author}</span>
                  </div>
                </button>
              </li>
            {/each}
          </ul>
        {/if}
      </div>

      <!-- Coffee Shop -->
      <div>
        <label for="coffeeShop">Coffee Shop:</label>
        <input
          type="text"
          id="coffeeShop"
          bind:value={coffeeShop}
          placeholder="Search for a coffee shop"
          on:focus={initializePlacesAutocomplete}
        />
        {#if placesSuggestions.length > 0}
          <ul class="suggestions">
            {#each placesSuggestions as place}
              <li>
                <button
                  type="button"
                  on:click={() => {
                    coffeeShop = place.name; // Select name
                    placesSuggestions = []; // Clear suggestions
                  }}
                >
                  <!-- Display Logo -->
                  <img src={place.logo} alt="Logo" class="place-logo" />
                  <div class="place-details">
                    <!-- Display Name -->
                    <span class="place-name">{place.name}</span>
                    <!-- Display Address -->
                    <span class="place-address">{place.address}</span>
                  </div>
                </button>
              </li>
            {/each}
          </ul>
        {/if}
      </div>      
      <!-- Description -->
      <div>
        <label for="description">Description:</label>
        <textarea
          id="description"
          bind:value={description}
          placeholder="Write about your experience"
        ></textarea>
      </div>

      <!-- Image Upload -->
      <div>
        <label for="image">Upload Photo:</label>
        <input
          type="file"
          id="image"
          accept="image/*"
          capture="environment"
          on:change={handleFileInput}
        />
        <small>Upload a photo or take a picture using your camera.</small>
      </div>

      <button type="submit">Create Post</button>
    </form>

    {#if errorMessage}
      <p class="error">{errorMessage}</p>
    {/if}
  </div>
{/if}



<style>
  .guest-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    text-align: center;
    background-color: #f0f0f0;
    padding: 20px;
  }

  .guest-container h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .guest-container p {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
  }

  .guest-container button {
    margin: 10px;
    padding: 10px 20px;
    font-size: 1rem;
    background-color: black;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .guest-container button:hover {
    background-color: gray;
  }

  .form-container {
    background-color: pink;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 20px;
    max-width: 400px;
    margin: 0 auto;
    margin-top: 3rem;
    text-align: center;
  }

  form {
    display: flex;
    flex-direction: column;
  }

  div {
    margin-bottom: 15px;
  }

  input,
  textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-top: 5px;
  }

  button {
    padding: 10px;
    background-color: black;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  button:hover {
    background-color: grey;
  }

  h2 {
    margin-bottom: 20px;
    font-family: Arial, sans-serif;
  }

  .error {
    color: red;
    margin-top: 1rem;
  }
  .suggestions {
  list-style-type: none;
  padding: 0;
  margin: 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: yellow;
  position: absolute;
  width: 100%;
  z-index: 10;
  overflow-y: auto; /* Adds a scrollbar if needed */
  max-height: 300px; /* Set max height to avoid showing too many results */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Add a shadow for better visibility */
  display: block;
}

.suggestions li {
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
}

.suggestions li:last-child {
  border-bottom: none;
}

.suggestions button {
  all: unset;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px;
  text-align: left;
  cursor: pointer;
}

.suggestions button:hover {
  background-color: #f9f9f9;
}

.place-logo {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  object-fit: cover;
  margin-right: 10px;
}

.place-details {
  display: flex;
  flex-direction: column;
}

.place-name {
  font-weight: bold;
  font-size: 1rem;
}

.place-address {
  font-size: 0.85rem;
  color: #555;
}

</style>
