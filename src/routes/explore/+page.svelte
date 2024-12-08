<script>
  import { goto } from '$app/navigation';
  import { authState } from '$lib/stores';
  import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
  import { db } from '$lib/firebaseConfig';
  import { onMount } from 'svelte';

  let posts = [];
  let isLoading = true;
  let errorMessage = '';
  let selectedPost = null;

  // Fetch posts from Firestore
  async function fetchPosts() {
    isLoading = true;
    try {
      const querySnapshot = await getDocs(collection(db, 'posts'));
      posts = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching posts:', error);
      errorMessage = 'Error fetching posts. Please try again.';
    } finally {
      isLoading = false;
    }
  }

  // Delete a post
  async function deletePost(postId) {
    const confirmDelete = confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, 'posts', postId));
      posts = posts.filter((post) => post.id !== postId);
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    }
  }

  // Select a post for detailed view
  function openPost(post) {
    selectedPost = post;
  }

  // Close the detailed view
  function closePost() {
    selectedPost = null;
  }

  onMount(fetchPosts);
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
      <p>You need to log in or create an account to explore posts.</p>
      <button class="btn btn-primary me-2" on:click={() => goto('/login')}>Log In</button>
      <button class="btn btn-secondary" on:click={() => goto('/register')}>Sign Up</button>
    </div>
  {:else if posts.length === 0}
    <p class="text-center">No posts to display. Create one to get started!</p>
  {:else}
    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      {#each posts as post (post.id)}
        <div class="col">
          <div
            class="card h-100 post-card"
            tabindex="0"
            role="button"
            aria-label="View post details"
            on:click={() => openPost(post)}
            on:keydown={(event) => (event.key === 'Enter' || event.key === ' ') && openPost(post)}
          >
            {#if post.imageUrl}
              <img
                src={post.imageUrl}
                class="card-img-top"
                alt="{post.bookTitle || 'Post'}"
              />
            {/if}
            <div class="card-body">
              <h6 class="card-title text-truncate">@{post.username || 'Unknown User'}</h6>
              <p class="card-text text-truncate">{post.bookTitle || ''}</p>
            </div>
          </div>
        </div>
      {/each}
    </div>

    <!-- Detailed View Modal -->
    {#if selectedPost}
      <div class="modal fade show" style="display: block;" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">@{selectedPost.username || 'Unknown User'}</h5>
              <button type="button" class="btn-close" aria-label="Close" on:click={closePost}></button>
            </div>
            <div class="modal-body">
              {#if selectedPost.imageUrl}
                <img
                  src={selectedPost.imageUrl}
                  alt="{selectedPost.bookTitle || 'Post Image'}"
                  class="img-fluid mb-3"
                />
              {/if}
              <p><strong>Title:</strong> {selectedPost.bookTitle || 'Untitled'}</p>
              <p>
                <strong>Location:</strong>
                {#if selectedPost.coffeeShop}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      selectedPost.coffeeShop
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selectedPost.coffeeShop}
                  </a>
                {:else}
                  Not provided
                {/if}
              </p>
              <p>{selectedPost.description || ''}</p>

              <!-- Edit/Delete Options for Owner -->
              {#if selectedPost.userId === $authState.uid}
                <div class="mt-3">
                  <button
                    class="btn btn-warning me-2"
                    on:click={() => alert('Edit functionality coming soon!')}
                  >
                    Edit
                  </button>
                  <button
                    class="btn btn-danger"
                    on:click={() => deletePost(selectedPost.id)}
                  >
                    Delete
                  </button>
                </div>
              {/if}
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" on:click={closePost}>Close</button>
            </div>
          </div>
        </div>
      </div>
    {/if}
  {/if}
</div>

<style>

/* Card Styling */
.post-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.post-card:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.post-card img {
  height: 150px;
  object-fit: cover;
}

/* Modal Styling */
.modal-content {
  border-radius: 10px;
}

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
