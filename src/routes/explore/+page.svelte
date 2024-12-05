<script>
  import { authState } from '$lib/stores';
  import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
  import { db } from '$lib/firebaseConfig';
  import { onMount } from 'svelte';

  let posts = [];
  let isLoading = true;
  let errorMessage = '';
  let selectedPost = null; // Currently selected post for the modal
  let replies = {}; // Store replies for each post

  // Fetch posts from Firestore
  async function fetchPosts() {
    isLoading = true;
    try {
      const querySnapshot = await getDocs(collection(db, 'posts'));
      posts = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      replies = posts.reduce((acc, post) => ({ ...acc, [post.id]: '' }), {}); // Initialize replies
    } catch (error) {
      console.error('Error fetching posts:', error);
      errorMessage = 'Error fetching posts. Please try again.';
    } finally {
      isLoading = false;
    }
  }

  // Add a reply to a post
  async function addReply(postId, replyText) {
    if (!replyText.trim()) return;

    const post = posts.find((p) => p.id === postId);
    const postDoc = doc(db, 'posts', postId);

    try {
      const newReply = { username: authState.userProfile.name, reply: replyText };
      const updatedReplies = post.replies ? [...post.replies, newReply] : [newReply];
      await updateDoc(postDoc, { replies: updatedReplies });

      // Update UI
      post.replies = updatedReplies;
      replies[postId] = ''; // Clear input
    } catch (error) {
      console.error('Error adding reply:', error);
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

<!-- Explore Page -->
{#if isLoading}
  <p>Loading posts...</p>
{:else if errorMessage}
  <p class="error">{errorMessage}</p>
{:else if posts.length === 0}
  <p>No posts to display. Create one to get started!</p>
{:else}
  <div class="explore-grid">
    {#each posts as post(post.id)}
    <div class="post-tile" role="button" tabindex="0" on:click={() => openPost(post)} on:keydown={(e) => e.key === 'Enter' && openPost(post)}>
      <!-- Post Image -->
      {#if post.imageUrl}
        <img src={post.imageUrl} alt={`Image for ${post.bookTitle || 'Post'}`} class="post-image" />
      {:else}
        <div class="placeholder-image" aria-hidden="true"></div>
      {/if}
  
      <!-- Post Info -->
      <div class="post-info">
        <p class="username">@{post.username || ""}</p>
        <p class="title">{post.bookTitle || ""}</p>
        <p class="coffee-shop">{post.coffeeShop || ""}</p>
      </div>
    </div>
  {/each}
</div>

  <!-- Detailed View Modal -->
  {#if selectedPost}
    <div class="modal-overlay">
      <div class="modal">
        <button class="close-btn" on:click={closePost}>X</button>
        <!-- Post Image -->
        {#if selectedPost.imageUrl}
        <img 
          src={selectedPost.imageUrl} 
          alt="{selectedPost.bookTitle || 'Post Image'}" 
          class="modal-image" 
        />
      {/if}
      

        <!-- Post Details -->
        <div class="modal-info">
          <p class="username">@{selectedPost.username || "Unknown User"}</p>
          <p class="title">{selectedPost.bookTitle || "Untitled"}</p>
          <p class="coffee-shop">{selectedPost.coffeeShop || ''}</p>
          <p class="description">{selectedPost.description || ''}</p>
        </div>

        <!-- Replies -->
        <div class="replies-section">
          <p class="replies-title">Replies:</p>
          {#if selectedPost.replies && selectedPost.replies.length > 0}
            <ul class="replies-list">
              {#each selectedPost.replies as reply}
                <li>
                  <span class="reply-username">@{reply.username}</span>: {reply.reply}
                </li>
              {/each}
            </ul>
          {:else}
            <p class="no-replies">No replies yet. Be the first to reply!</p>
          {/if}

          <!-- Add Reply -->
          <div class="add-reply">
            <input
              type="text"
              placeholder="Write a reply..."
              bind:value={replies[selectedPost.id]}
            />
            <button on:click={() => addReply(selectedPost.id, replies[selectedPost.id])}>
              Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}
{/if}

<style>

  .explore-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* Adjust column width */
  gap: 1rem;
  padding: 1rem;
}


.post-tile {
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease;
  }


.post-tile:hover {
  transform: scale(1.03);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
}

.post-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.placeholder-image {
  width: 100%;
  height: 200px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: #888;
}

.post-info {
  padding: 1rem;
}

.post-info .username {
  font-weight: bold;
  font-size: 1rem;
  margin: 0.5rem 0;
}

.post-info .title,
.post-info .coffee-shop {
  font-size: 0.9rem;
  color: #555;
  margin: 0.3rem 0;
}


  /* Modal Overlay */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal {
    background: #fff;
    border-radius: 8px;
    padding: 2rem;
    width: 90%;
    max-width: 600px;
    text-align: center;
    position: relative;
  }

  .close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }

  .modal-image {
    width: 100%;
    max-height: 300px;
    object-fit: cover;
    margin-bottom: 1rem;
  }

  .modal-info {
    text-align: left;
    margin-bottom: 1rem;
  }

  .replies-section {
    text-align: left;
    margin-top: 1rem;
  }

  .replies-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .replies-list li {
    margin-bottom: 0.5rem;
    font-size: 0.85rem;
  }

  .add-reply {
    display: flex;
    margin-top: 1rem;
  }

  .add-reply input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-right: 0.5rem;
  }

  .add-reply button {
    padding: 0.5rem 1rem;
    background-color: #007BFF;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .add-reply button:hover {
    background-color: #0056b3;
  }

</style>