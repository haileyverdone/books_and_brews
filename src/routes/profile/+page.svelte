<script>
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  let user = null;

  onMount(async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      window.location.href = '/login';  // Redirect if not logged in
    } else {
      user = data.session.user;
    }
  });

  function handleLogout() {
    supabase.auth.signOut();
    window.location.href = '/login';
  }
</script>

{#if user}
  <h1>Welcome, {user.email}</h1>
  <button on:click={handleLogout}>Logout</button>
{:else}
  <p>Loading...</p>
{/if}
