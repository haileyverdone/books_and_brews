<script>
  import { authState, userStore, watchUser } from '$lib/stores';
  import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
  import { db } from '$lib/firebaseConfig';
  import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

  let profile = null;
  $: profile = $userStore;

  let isLoading = true; 
  let isLoggedIn = false;
  let uid = null;
  $: ({ isLoading, isLoggedIn, uid } = $authState);

  let imageFile = null;
  let imagePreview = null;

  let userActivity = [];
  let userPosts = [];
  let userEvents = [];
  let favoritedEvents =[];

  $: if (isLoggedIn && uid) {
    watchUser(uid); // Start watching the user
    fetchUserActivity();
  }

  // Handle File Input
async function handleFileInput(event) {
  const file = event.target.files[0];
  if (file) {
    try {
      imageFile = file;
      imagePreview = URL.createObjectURL(file);

      // Upload the image immediately
      const photoURL = await uploadProfileImage(file);

      // Update Firestore user document with new photoURL
      const userDocRef = doc(db, "users", uid);
      await updateDoc(userDocRef, { photoURL });

      // Update local state
      profile.photoURL = photoURL;
      imagePreview = null;
      imageFile = null;

    } catch (error) {
      console.error("Error updating profile photo:", error);
      alert("Failed to update profile picture.");
    }
  }
}


  async function uploadProfileImage(file) {
  if (!file || !uid) {
    console.error("Missing file or user ID for upload.");
    throw new Error("File or user ID is required.");
  }

  try {
    const storage = getStorage();
    const fileRef = storageRef(storage, `profile-pictures/${uid}/${Date.now()}_${file.name}`);
    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef); 
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error.message);
    throw new Error("Failed to upload image.");
  }
}


  // Update User Profile with New Photo URL
  async function updateProfilePhoto() {
  if (!imageFile || !uid) {
    console.error("No file selected or user is not logged in.");
    return;
  }

  try {
    // Upload image to Firebase Storage
    const photoURL = await uploadProfileImage(imageFile);

    // Update Firestore user document with new photoURL
    const userDocRef = doc(db, "users", uid);
    await updateDoc(userDocRef, { photoURL });

    // Update local state
    profile.photoURL = photoURL;
    imagePreview = null;
    imageFile = null;

    alert("Profile picture updated!");
  } catch (error) {
    console.error("Error updating profile photo:", error);
    alert("Failed to update profile picture.");
  }
}



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
      .filter((event) => event.userId === uid); // Events created by the user

    const favoritedEvents = eventsSnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((event) => event.isFavorite && event.favoritedBy?.includes(uid)); // Favorited events

    userPosts = postsSnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data(), type: "post" }))
      .filter((post) => post.userId === uid);

    userActivity = [...userEvents, ...userPosts].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return { favoritedEvents }; // Return favorited events to use later
  } catch (error) {
    console.error("Error fetching user activity:", error);
  }
}


</script>

{#if isLoading}
  <p>Loading profile...</p>
{:else if profile}
  <div class="profile-page">
    <!-- Profile Header -->
    <div class="profile-header text-center">
      <!-- Profile Picture Display -->
      {#if imagePreview}
        <img src={imagePreview} alt="Preview" class="profile-pic" />
      {:else}
        <img src={profile?.photoURL || "/placeholder.jpeg"} alt={profile?.name || "Profile"} class="profile-pic" />
      {/if}
    
      <h1>Welcome, {profile.name}!</h1>
      <p>Username: {profile.username}</p>
      <p>Email: {profile.email}</p>
    
      <!-- File Input -->
      <div class="file-input-wrapper">
        <label class="btn btn-secondary mt-2" for="file-input">
          New Profile Picture
        </label>
        <input
          id="file-input"
          type="file"
          accept="image/*"
          capture="environment"
          on:change={handleFileInput}
          hidden
        />
        {#if imageFile}
          <p class="file-name">Selected: {imageFile.name}</p>
        {/if}
      </div>
    </div>    
      

    <!-- Analytics Section -->
    <div class="analytics mt-4">
      <h3>Analytics</h3>
      <p><strong>Total Events:</strong> {userEvents.length}</p>
      <p><strong>Total Posts:</strong> {userPosts.length}</p>
    </div>

    <!-- Activity Timeline -->
    <div class="activity-timeline">
      <h3 class="activity-timeline-header">Activity Timeline</h3>
      {#if userActivity.length > 0}
        <div class="timeline-grid">
          {#each userActivity as activity}
            <div class="timeline-card">
              <p class="description">{activity.description}</p>
            </div>
          {/each}
        </div>
      {:else}
        <p>No activity found.</p>
      {/if}
    </div>    

    <!-- User Posts Section -->
    <div class="user-posts mt-4">
      <h3 class="user-posts-header">My Posts</h3>
      <div class="post-grid">
        {#if userPosts.length > 0}
          {#each userPosts as post}
            <div class="post-card">
              <img
                src={post.imageUrl || '/placeholder.jpeg'}
                alt={post.imageUrl ? 'User-uploaded post image' : ''}
                class="post-thumbnail"
                onerror="this.onerror=null;this.src='/placeholder.jpeg';"
              />
            </div>
          {/each}
        {:else}
          <p>No posts found.</p>
        {/if}
      </div>
    </div>
  </div>
  <!-- Favorited Events Section -->
<div class="favorited-events mt-4">
  <h3 class="favorited-events-header">My Favorited Events</h3>
  <div class="event-grid">
    {#if favoritedEvents.length > 0}
      {#each favoritedEvents as event}
        <div class="event-card">
          <img
            src={event.imageUrl || '/placeholder.jpeg'}
            alt={event.title || 'Event Image'}
            class="event-thumbnail"
            onerror="this.onerror=null;this.src='/placeholder.jpeg';"
          />
          <h4 class="event-title">{event.title}</h4>
          <p class="event-description">{event.description}</p>
          <p><strong>Location:</strong> {event.location}</p>
        </div>
      {/each}
    {:else}
      <p>No favorited events found.</p>
    {/if}
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
    object-fit: cover;
  }

  .activity-timeline {
    padding: 2rem 0;
  }

  .activity-timeline-header {
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
    color: #444;
    text-align: center;
  }

  .timeline-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
  }

  .timeline-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1rem;
    background-color: #fff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }



  .timeline-card .description {
    font-size: 1rem;
    color: #666;
    margin-bottom: 0.75rem;
  }


  .post-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
  }

  .post-card {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    height: 200px;
  }

  .post-thumbnail {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }

  @media (max-width: 768px) {
    .timeline-card {
      padding: 0.75rem;
    }
    .timeline-card .description {
      font-size: 0.9rem;
    }
  }
  .file-input-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;
}

.btn {
  display: inline-block;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: bold;
  color: #fff;
  background-color: grey;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
}

.btn:hover {
  background-color: pink;
}

.file-name {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #555;
}
.favorited-events {
  margin-top: 2rem;
}

.favorited-events-header {
  font-size: 1.5rem;
  color: #444;
  margin-bottom: 1rem;
}

.event-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.event-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.event-thumbnail {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.event-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.event-description {
  font-size: 0.9rem;
  color: #666;
}

</style>
