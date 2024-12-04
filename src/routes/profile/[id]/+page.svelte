<script>
  import { authState } from '$lib/stores';
  import { onMount } from 'svelte';
  import { fetchUserProfile} from '$lib/firebaseUtils';

  let profile = null;
  let errorMessage = '';
  let isLoading = true; // Initialize loading state
  let isLoggedIn = false;
  let uid = null;

  // Reactive subscription to authState
  $: ({ isLoading, isLoggedIn, uid } = $authState);

  // Redirect to login if not logged in
  onMount(async () => {
    if (isLoading) return; // Don't proceed if auth state is still loading

    if (!isLoggedIn) {
      window.location.href = '/login'; // Redirect to login if not logged in
    } else {
      try {
        profile = await fetchUserProfile(uid); // Fetch user profile
        if (!profile) {
          errorMessage = 'Profile not found. Please check your data.';
        }
      } catch (error) {
        errorMessage = 'Failed to load profile data. Please try again later.';
        console.error('Profile load error:', error);
      } finally {
        isLoading = false; // Mark loading as complete
      }
    }
  });
</script>

{#if isLoading}
  <p>Loading profile...</p>
{:else if profile}
  <div class="profile-page"> 
    <h1>Welcome, {profile.name}!</h1>
    <p>Username: {profile.username}</p>
    <p>Email: {profile.email}</p>
  </div>
{:else if errorMessage}
  <p class="error">{errorMessage}</p>
{/if}

<style>
  .profile-page {
    padding: 2rem;
    max-width: 600px;
    margin: auto;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.2rem;
  }

  .error {
    color: red;
    font-weight: bold;
  }
</style>
