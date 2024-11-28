<script>
  import { authState } from '$lib/stores'; // Import the authentication state
  import { goto } from '$app/navigation';

  let isLoggedIn = false;

  // Automatically track `authState` updates
  $: {
    isLoggedIn = $authState.isLoggedIn;
  }

  function handleLoginRedirect() {
    goto('/login');
  }

  function handleRegisterRedirect() {
    goto('/register');
  }
</script>

{#if isLoggedIn}
  <div>
    <h1>Events Page</h1>
    <p>Welcome! Explore the events happening around you.</p>
    <!-- Add your events content here -->
  </div>
{:else}
  <div class="landing-page">
    <h1>Events Page</h1>
    <p>You must log in or create an account to view events.</p>
    <button on:click={handleLoginRedirect}>Log In</button>
    <button on:click={handleRegisterRedirect}>Create Account</button>
  </div>
{/if}

<style>
  .landing-page {
    text-align: center;
    margin: 2rem;
  }

  button {
    margin: 1rem;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    background-color: #333;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  button:hover {
    background-color: #555;
  }
</style>
