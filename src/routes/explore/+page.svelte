<script>
  import { collection, getDocs } from "firebase/firestore";
  import { getAuth, onAuthStateChanged } from "firebase/auth";
  import { db } from "$lib/firebaseConfig";
  import { goto } from "$app/navigation";

  let posts = [];
  let isLoading = true;
  let errorMessage = "";
  let isLoggedIn = false;

  const auth = getAuth();

  // Check authentication status
  onAuthStateChanged(auth, (user) => {
    isLoggedIn = !!user;
    if (!isLoggedIn) {
      errorMessage = "You must be logged in to view this page.";
      setTimeout(() => goto("/login"), 2000); // Redirect guests to login after 2 seconds
    } else {
      fetchPosts(); // Fetch posts if logged in
    }
  });

  // Fetch posts from Firestore
  async function fetchPosts() {
    isLoading = true;
    try {
      const querySnapshot = await getDocs(collection(db, "posts"));
      posts = querySnapshot.docs.map((doc) => doc.data());
      isLoading = false; // Set loading to false after fetching
    } catch (error) {
      console.error("Error fetching posts:", error);
      errorMessage =
        error.code === "permission-denied"
          ? "You do not have permission to view posts. Please log in."
          : "An error occurred while fetching posts.";
      isLoading = false;
    }
  }
</script>

{#if isLoading}
  <p>Loading posts...</p>
{:else if errorMessage}
  <p class="error">{errorMessage}</p>
{:else if posts.length === 0}
  <p>No posts to display. Create one to get started!</p>
{:else}
  <div class="explore-container">
    {#each posts as post}
      <div class="post-card">
        {#if post.imageUrl}
          <img src={post.imageUrl} alt={post.bookTitle || "Post Image"} />
        {/if}
        <div class="post-info">
          <h3>{post.bookTitle || "No Title"}</h3>
          <p>{post.coffeeShop || "No Coffee Shop"}</p>
          <p>{post.description}</p>
        </div>
      </div>
    {/each}
  </div>
{/if}

<style>
  .explore-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
    padding: 1rem;
  }

  .post-card {
    background: white;
    border: 1px solid #ccc;
    border-radius: 8px;
    overflow: hidden;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .post-card img {
    width: 100%;
    height: auto;
  }

  .post-info {
    padding: 1rem;
  }

  .post-info h3 {
    margin: 0.5rem 0;
    font-size: 1.2rem;
    color: #333;
  }

  .post-info p {
    margin: 0.3rem 0;
    color: #666;
    font-size: 0.9rem;
  }

  .error {
    color: red;
    font-weight: bold;
    text-align: center;
  }
</style>
