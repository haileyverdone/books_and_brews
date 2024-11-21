<script>
  import { onMount } from "svelte";
  import { getAuth, onAuthStateChanged } from "firebase/auth";
  import { goto } from "$app/navigation";

  let isLoggedIn = false;
  let user = null;
  let bookTitle = "";
  let coffeeShop = "";
  let description = "";
  let imageFile = null;
  let errorMessage = "";

  const auth = getAuth();

  // Check authentication status on mount
  onMount(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        isLoggedIn = true;
        user = currentUser;
      } else {
        isLoggedIn = false;
        user = null;
      }
    });
  });

  // Handle file input or camera photo
  function handleFileInput(event) {
    imageFile = event.target.files[0];
  }

  async function createPost(event) {
    event.preventDefault();

    if (!isLoggedIn) return;

    try {
      const postId = `${user.uid}-${Date.now()}`; // Unique post ID
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
      goto("/explore");
    } catch (error) {
      console.error("Error creating post:", error);
      errorMessage = "Failed to create post.";
    }
  }
</script>

<!-- Display a login prompt for guests -->
{#if !isLoggedIn}
  <div class="guest-container">
    <h2>Welcome to Books & Brews</h2>
    <p>You need to log in or create an account to create a post.</p>
    <button on:click={() => goto('/login')}>Log In</button>
    <button on:click={() => goto('/register')}>Sign Up</button>
  </div>
{:else}
  <!-- Display the create form for logged-in users -->
  <div class="form-container">
    <h2>Create Your Post</h2>
    <form on:submit|preventDefault={createPost}>
      <div>
        <label for="bookTitle">Book Title:</label>
        <input
          type="text"
          id="bookTitle"
          bind:value={bookTitle}
          placeholder="Enter the book title"
        />
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
</style>
