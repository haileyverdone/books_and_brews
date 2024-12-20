<script>
  import { authState, userStore, watchUser } from '$lib/stores';
  import { getFirestore, collection, getDocs } from 'firebase/firestore';
  import { db } from '$lib/firebaseConfig';

  let profile = null;
  $: profile = $userStore;

  let isLoading = true; 
  let isLoggedIn = false;
  let uid = null;
  $: ({ isLoading, isLoggedIn, uid } = $authState);

  let userActivity = [];
  let userPosts = [];
  let userEvents = [];
  let followers = [];
  let following = [];
  let comments = [];
  let newComment = "";
  let commentsPostId = null;

  $: if (isLoggedIn && uid) {
    watchUser(uid); // Start watching the user
    fetchUserActivity();
    fetchFollowersAndFollowing();
  }

  // Fetch User's Activity (Events + Posts)
  async function fetchUserActivity() {
    try {
      const eventsCollection = collection(db, "events");
      const postsCollection = collection(db, "posts");

      const [eventsSnapshot, postsSnapshot] = await Promise.all([
        getDocs(eventsCollection),
        getDocs(postsCollection),
      ]);

      userEvents = eventsSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data(), type: "event" }))
        .filter((event) => event.userId === uid);

      userPosts = postsSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data(), type: "post" }))
        .filter((post) => post.userId === uid);

      userActivity = [...userEvents, ...userPosts].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } catch (error) {
      console.error("Error fetching user activity:", error);
    }
  }

  // Fetch Followers and Following
  async function fetchFollowersAndFollowing() {
    try {
      const followersCollection = collection(db, `users/${uid}/followers`);
      const followingCollection = collection(db, `users/${uid}/following`);

      const [followersSnapshot, followingSnapshot] = await Promise.all([
        getDocs(followersCollection),
        getDocs(followingCollection),
      ]);

      followers = followersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      following = followingSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching followers/following:", error);
    }
  }

  async function fetchComments(postId) {
    try {
      const commentsCollection = collection(db, `posts/${postId}/comments`);
      const snapshot = await getDocs(commentsCollection);
      comments = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      commentsPostId = postId; // Set the active post ID for comments
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }

  async function addComment(postId) {
    try {
      if (!newComment.trim()) {
        alert("Comment cannot be empty.");
        return;
      }

      const commentsCollection = collection(db, `posts/${postId}/comments`);
      await addDoc(commentsCollection, {
        text: newComment,
        userId: uid,
        userName: profile?.name || "Anonymous",
        createdAt: new Date().toISOString(),
      });

      newComment = "";
      fetchComments(postId); // Refresh comments
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment.");
    }
  }
</script>

{#if isLoading}
  <p>Loading profile...</p>
{:else if profile}
  <div class="profile-page">
    <!-- Profile Header -->
    <div class="profile-header">
      <img 
      src={profile?.photoURL || "/placeholder.jpg"} 
      alt={profile?.name || "Profile"} 
      class="profile-pic" 
      />     
      <h1>Welcome, {profile.name}!</h1>
      <p>Username: {profile.username}</p>
      <p>Email: {profile.email}</p>
      <p>{followers.length} Followers • {following.length} Following</p>
    </div>

    <!-- Analytics Section -->
    <div class="analytics mt-4">
      <h3>Analytics</h3>
      <p><strong>Total Events:</strong> {userEvents.length}</p>
      <p><strong>Total Posts:</strong> {userPosts.length}</p>
    </div>

    <!-- Activity Timeline -->
    <div class="activity-timeline mt-4">
      <h3>Activity Timeline</h3>
      <ul>
        {#each userActivity as activity}
          <li>
            <p><strong>{activity.type === "event" ? "Event" : "Post"}:</strong> {activity.title}</p>
            <p>{activity.description}</p>
            <p class="small text-muted">{new Date(activity.createdAt).toLocaleString()}</p>
          </li>
        {/each}
      </ul>
    </div>

    <!-- Posts Section -->
    <div class="user-posts mt-4">
      <h3>My Posts</h3>
      <div class="post-grid">
        {#each userPosts as post}
          <div class="post-card">
            <h4>{post.title}</h4>
            <p>{post.description}</p>
            <button class="btn btn-secondary" on:click={() => fetchComments(post.id)}>View Comments</button>
            {#if commentsPostId === post.id}
              <div class="comments-section mt-2">
                <h4>Comments</h4>
                <ul>
                  {#each comments as comment}
                    <li>
                      <p><strong>{comment.userName}:</strong> {comment.text}</p>
                      <p class="small text-muted">{new Date(comment.createdAt).toLocaleString()}</p>
                    </li>
                  {/each}
                </ul>
                <textarea
                  bind:value={newComment}
                  class="form-control mb-2"
                  placeholder="Write a comment..."
                ></textarea>
                <button class="btn btn-primary" on:click={() => addComment(post.id)}>
                  Add Comment
                </button>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  </div>
{:else}
  <p>No profile found.</p>
{/if}

<style>
  .profile-page {
    padding: 2rem;
    max-width: 900px;
    margin: auto;
  }

  .profile-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .profile-pic {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    margin-bottom: 1rem;
  }

  .analytics, .activity-timeline, .user-posts {
    margin-bottom: 2rem;
  }

  .activity-timeline ul, .comments-section ul {
    list-style: none;
    padding: 0;
  }

  .activity-timeline li, .comments-section li {
    margin-bottom: 1rem;
    border-bottom: 1px solid #ddd;
    padding-bottom: 0.5rem;
  }

  .post-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
  }

  .post-card {
    border: 1px solid #ddd;
    padding: 1rem;
    border-radius: 8px;
  }
</style>
