<script>
  import { authState } from '$lib/stores';
  import { onMount } from 'svelte';

  let profile = null;
  let errorMessage = '';
  let isLoading = true; // Initialize loading state
  let isLoggedIn = false;
  let userProfile = null;

  $: {
    ({ isLoading, isLoggedIn, userProfile } = $authState);
    if (isLoggedIn && userProfile) {
      profile = userProfile;
      errorMessage = '';
    } else {
      profile = null;
      errorMessage = 'No user is logged in.';
    }
  }

  onMount(() => {
    // Ensure this check runs only on the client
    if (!isLoggedIn) {
      window.location.href = '/login'; // Redirect to login if not logged in
    }
  });
</script>

{#if isLoading}
  <p>Loading profile...</p>
{:else if isLoggedIn && userProfile}
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
