<script>
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import { page } from '$app/stores';

  let profile = null;  
  let errorMessage = '';  

  onMount(async () => {
    const { params } = $page;  

  
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', params.id)
      .single();

    if (profileError) {
      errorMessage = 'Error fetching profile data';
    } else {
      profile = profileData;  
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
