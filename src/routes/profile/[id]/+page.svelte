<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores'; // Access route params

  let profile = null;
  let errorMessage = '';

  onMount(async () => {
    const { params } = $page; // Access the route parameter `id` from the URL

    try {
      const response = await fetch(`/profile/${params.id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error fetching profile data');
      }

      profile = data.profile; // Set the profile data if fetch is successful
    } catch (err) {
      errorMessage = err.message; // Capture and display any error message
    }
  });
</script>

{#if profile}
  <div class="profile-page">
    <h1>Welcome, {profile.name}!</h1>
    <p>Username: {profile.username}</p>
    <p>Email: {profile.email}</p>
  </div>
{:else if errorMessage}
  <p class="error">{errorMessage}</p>
{:else}
  <p>Loading profile data...</p>
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
