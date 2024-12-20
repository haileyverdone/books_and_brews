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
  let selectedBook = null;

  $: ({ isLoading, isLoggedIn, uid, userProfile } = $authState);

  function handleFileInput(event) {
  const file = event.target.files[0]; // Get the selected or captured file
  if (file) {
    imageFile = file; // Save the file for uploading
    console.log("Selected or captured image:", file);
  } else {
    console.error("No file selected or captured.");
  }
}


    async function uploadImage(imageFile, uid) {
      if (!imageFile) return null;
      try {
        const storageRef = ref(storage, `posts/${uid}/${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        return await getDownloadURL(storageRef);
      } catch (error) {
        console.error("Error uploading image:", error);
        throw new Error("Failed to upload image.");
      }
    }


  let debounceTimeout;
  async function fetchBookSuggestions(query) {
    clearTimeout(debounceTimeout);
    if (!query) {
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

  function selectBook(book) {
    selectedBook = book;
    bookTitle = book.title;
    suggestions = [];
    showSuggestions = false;
  }

  function deselectBook() {
    selectedBook = null;
    bookTitle = "";
    showSuggestions = false;
  }

  function initializePlacesAutocomplete() {
    const input = document.getElementById('coffeeShop');
    const autocomplete = new google.maps.places.Autocomplete(input, { types: ['establishment'] });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place) {
        coffeeShop = place.name;
      }
    });
  }

  async function createPost(event) {
    event.preventDefault();
    if (!isLoggedIn || !uid) {
      errorMessage = "You must be logged in to create a post.";
      return;
    }

    try {
      const imageUrl = imageFile ? await uploadImage(imageFile, uid) : "";
      const postData = {
        userId: uid,
        username: userProfile?.username || "Unknown User",
        bookTitle,
        coffeeShop,
        description,
        imageUrl,
        createdAt: new Date(),
      };

      await addDoc(collection(db, "posts"), postData);

      // Reset form fields
      bookTitle = "";
      coffeeShop = "";
      description = "";
      imageFile = null;
      selectedBook = null;

      goto('/explore');
    } catch (error) {
      console.error("Error creating post:", error);
      errorMessage = "Failed to create post.";
    }
  }
</script>

<div class="container my-5">
  {#if isLoading}
    <div class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p>Loading...</p>
    </div>
  {:else if !$authState.isLoggedIn}
    <div class="text-center">
      <h2>Welcome to Books & Brews</h2>
      <p>You need to log in or create an account to create a post.</p>
      <button class="btn btn-primary me-2" on:click={() => goto('/login')}>Log In</button>
      <button class="btn btn-secondary" on:click={() => goto('/register')}>Sign Up</button>
    </div>
  {:else}
    <div class="card mx-auto form-container bg-pink text-dark" style="max-width: 600px;">
      <div class="card-body">
        <h2 class="card-title text-center mb-4">Create a Post!</h2>
        <form on:submit|preventDefault={createPost}>
          <!-- Book Title -->
          <div class="mb-3">
            <label for="bookTitle" class="form-label">Book Title:</label>
            {#if !selectedBook}
              <input
                type="text"
                id="bookTitle"
                class="form-control"
                bind:value={bookTitle}
                placeholder="Enter the book title"
                on:input={() => fetchBookSuggestions(bookTitle)}
              />
              {#if showSuggestions}
                <ul class="list-group mt-2">
                  {#each suggestions as book, index}
                  <li class="list-group-item" key={index}>
                    <button
                      type="button"
                      class="btn w-100 text-start d-flex align-items-center"
                      on:click={() => selectBook(book)}
                      style="cursor: pointer; border: none; background: none; padding: 0;"
                    >
                      <img
                        src={book.cover}
                        alt={book.title}
                        class="me-3"
                        style="width: 50px; height: 75px; object-fit: cover;"
                      />
                      <div>
                        <p class="mb-0">{book.title}</p>
                        <small class="text-muted">{book.author}</small>
                      </div>
                    </button>
                  </li>
                {/each}                
                </ul>
              {/if}
            {:else}
              <div class="d-flex align-items-center bg-light p-3 rounded border">
                <img
                  src={selectedBook.cover}
                  alt={selectedBook.title}
                  class="me-3"
                  style="width: 50px; height: 75px; object-fit: cover;"
                />
                <div>
                  <p class="mb-1"><strong>{selectedBook.title}</strong></p>
                  <p class="mb-0 text-muted">{selectedBook.author}</p>
                </div>
                <button
                  class="btn btn-close ms-auto"
                  aria-label="Remove book"
                  on:click={deselectBook}
                ></button>
              </div>
            {/if}
          </div>
          
          <!-- Coffee Shop -->
          <div class="mb-3">
            <label for="coffeeShop" class="form-label">Location:</label>
            <input
              type="text"
              id="coffeeShop"
              class="form-control"
              bind:value={coffeeShop}
              placeholder="Search for a coffee shop or book shop"
              on:focus={initializePlacesAutocomplete}
            />
          </div>

          <!-- Description -->
          <div class="mb-3">
            <label for="description" class="form-label">Description:</label>
            <textarea
              id="description"
              class="form-control"
              rows="3"
              bind:value={description}
              placeholder="Write about your experience"
            ></textarea>
          </div>
<!-- Image Upload -->
          <div class="mb-3">
            <label for="image" class="form-label">Upload Photo (Camera or File):</label>
            <input
              type="file"
              id="image"
              class="form-control"
              accept="image/*"
              capture="environment"
              on:change={handleFileInput}
            />
          </div>
          <!-- Submit Button -->
          <button type="submit" class="btn btn-info w-100">Create Post</button>
        </form>
      </div>
    </div>
  {/if}
</div>



<style>
  .bg-pink {
    background-color: #ffc0cb;
  }
  .form-container {
    border-radius: 12px;
  }
  .list-group-item {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .list-group-item:hover {
    background-color: #f8f9fa;
  }
</style>
