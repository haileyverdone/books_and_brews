<script>
import { authState, userStore, watchUser } from '$lib/stores';

  let profile = null;
  $: profile = $userStore;

	let errorMessage = '';
	let isLoading = true; // Initialize loading state
	let isLoggedIn = false;
	let uid = null;

  $: ({ isLoading, isLoggedIn, uid } = $authState);

  $: if (isLoggedIn && uid) {
		watchUser(uid); // Start watching the user
	}
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
