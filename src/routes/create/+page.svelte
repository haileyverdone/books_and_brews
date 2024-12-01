<script>
  import { authState } from '$lib/stores';
  import { addDoc, collection } from 'firebase/firestore';
  import { db } from '$lib/firebaseConfig';
  import { goto } from '$app/navigation';

  let isLoggedIn = false;
  let user = null;
  let bookTitle = "";
  let coffeeShop = "";
  let description = "";
  let imageFile = null;
  let errorMessage = "";
  let suggestions = []; 
  let showSuggestions = false; 
  let selectedSuggestionIndex = -1;

  $: ({ isLoading, isLoggedIn, userEmail, uid, userProfile } = $authState);

  // Handle file input or camera photo
  function handleFileInput(event) {
    imageFile = event.target.files[0];
  }

  // Fetch book suggestions from Open Library API
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
        selectedSuggestionIndex = -1; // Reset selection
      } catch (error) {
        console.error("Error fetching book suggestions:", error);
      }
    }, 300); 
  }

  // Handle suggestion selection
  function selectBookSuggestion(book) {
    bookTitle = book.title; // Update the book title with the selected suggestion
    showSuggestions = false; // Hide suggestions after selection
  }

  // Handle keyboard navigation
  function handleKeydown(event) {
    if (event.key === "ArrowDown") {
      selectedSuggestionIndex = (selectedSuggestionIndex + 1) % suggestions.length;
    } else if (event.key === "ArrowUp") {
      selectedSuggestionIndex =
        (selectedSuggestionIndex - 1 + suggestions.length) % suggestions.length;
    } else if (event.key === "Enter" && selectedSuggestionIndex >= 0) {
      selectBookSuggestion(suggestions[selectedSuggestionIndex]);
      event.preventDefault(); // Prevent form submission
    }
  }

  async function createPost(event) {
    event.preventDefault();


    if (!isLoggedIn || !uid) {
      errorMessage = "You must be logged in to create a post.";
      return;
    }

    try {
      const postData = {
        userId: user.uid,
        bookTitle,
        coffeeShop,
        description,
        createdAt: new Date(),
      };

      console.log("Post data:", postData);
      // TODO: Add image upload logic here (if needed)

      // Redirect to Explore Page after successful post creation
      await addDoc(collection(db, "posts"), postData);
      goto("/explore");
    } catch (error) {
      console.error("Error creating post:", error);
      errorMessage = "Failed to create post.";
    }
  }
</script>

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
      <div class="input-container">
        <label for="bookTitle">Book Title:</label>
        <input
          type="text"
          id="bookTitle"
          bind:value={bookTitle}
          placeholder="Enter the book title"
          on:input={() => fetchBookSuggestions(bookTitle)}
          on:keydown={handleKeydown}
        />
        {#if showSuggestions}
  <ul class="suggestions">
    {#each suggestions as book, index}
      <li>
        <button
          type="button"
          class="{selectedSuggestionIndex === index ? 'highlighted' : ''}"
          on:click={() => selectBookSuggestion(book)}
          on:keydown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              selectBookSuggestion(book);
            }
          }}
        >
        <img src={book.cover} alt="{book.title}" class="book-cover" />
        <div class="book-info">
          {#if book.title}
            <span class="book-title">{book.title}</span>
            {#if book.author_name && book.author_name.length > 0}
              <span class="book-author"> by {book.author_name[0]}</span>
            {/if}
          {:else}
            <span class="book-title">Unknown Title</span>
          {/if}
        </div>
      </li>
    {/each}
  </ul>
{/if}

</div>
      
      <div>
        <label for="coffeeShop">Coffee Shop:</label>
        <input
          type="text"
          id="coffeeShop"
          bind:value={coffeeShop}
          placeholder="Enter the coffee shop name"
        />
      </div>

      <div>
        <label for="description">Description:</label>
        <textarea
          id="description"
          bind:value={description}
          placeholder="Write about your experience"
        ></textarea>
      </div>

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
  background-color: white;
  position: absolute;
  width: 100%;
  z-index: 10;
  overflow-y: auto; /* Adds a scrollbar if needed */
  max-height: 300px; /* Set max height to avoid showing too many results */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Add a shadow for better visibility */
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
  all: unset; /* Reset button styles */
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px;
  text-align: left;
  cursor: pointer;
}

.suggestions button.highlighted {
  background-color: #f0f0f0;
}

.suggestions button:hover {
  background-color: #e0e0e0;
}
.book-cover {
  width: 50px;
  height: 75px;
  margin-right: 10px; /* Space between the cover image and text */
  border-radius: 4px;
  object-fit: cover; /* Ensure the image maintains aspect ratio */
}
.book-info {
  display: inline-block;
  vertical-align: top;
  max-width: calc(100% - 60px);
}

.book-title {
  font-weight: bold;
  font-size: 1rem;
  margin-bottom: 2px;
}

.book-author {
  font-size: 0.9rem;
  color: #555;
}

</style>
