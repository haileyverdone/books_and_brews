<script>
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';

  let profile = null;  // Store profile data
  let errorMessage = '';  // Store error messages

  // Function to fetch user profile data
  async function fetchUserProfile() {
    // Get the session of the current logged-in user
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    // If there is no session or error, redirect to login
    if (!sessionData || !sessionData.session || sessionError) {
      window.location.href = '/login';
      return;
    }

    const userId = sessionData.session.user.id; // Get the user id

    // Fetch profile data from the Supabase 'profiles' table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      errorMessage = 'Error fetching profile data';
    } else {
      profile = profileData;  // Store the fetched profile data
    }
  }

  // When the component mounts, fetch the user profile
  onMount(fetchUserProfile);
</script>

<!-- Profile Page -->
{#if profile}
  <div class="profile-page">
    <h1>Welcome, {profile.name}!</h1>
    <p>Username: {profile.username}</p>
    <p>Email: {profile.email}</p>
  </div>
{:else if errorMessage}
  <p>{errorMessage}</p>
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
</style>
