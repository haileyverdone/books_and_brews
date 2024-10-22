<script>
  import { onMount } from 'svelte';
  let email = '';
  let password = '';
  let errorMessage = '';

  async function login(event) {
    event.preventDefault(); // Prevent the default form submission

    // Perform validation
    if (!email || !password) {
      errorMessage = 'Email and password are required';
      return;
    }

    // Send login request to your API
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // Handle successful login (e.g., redirect or show success message)
        console.log('Login successful!');
      } else {
        const data = await response.json();
        errorMessage = data.error || 'Login failed';
      }
    } catch (error) {
      errorMessage = 'An error occurred: ' + error.message;
    }
  }
</script>

<form on:submit|preventDefault={login}>
  <input type="email" placeholder="Email" bind:value={email} required />
  <input type="password" placeholder="Password" bind:value={password} required />
  <button type="submit">Login</button>
  {#if errorMessage}
    <p style="color: red;">{errorMessage}</p>
  {/if}
</form>
