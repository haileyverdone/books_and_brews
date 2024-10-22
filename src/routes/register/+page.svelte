<script>
  import { onMount } from 'svelte';
  let email = '';
  let password = '';
  let confirmPassword = '';
  let errorMessage = '';

  async function register(event) {
    event.preventDefault(); // Prevent the default form submission

    // Perform validation
    if (!email || !password || !confirmPassword) {
      errorMessage = 'All fields are required';
      return;
    }
    if (password !== confirmPassword) {
      errorMessage = 'Passwords do not match';
      return;
    }

    // Send registration request to your API
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // Handle successful registration (e.g., redirect or show success message)
        console.log('Registration successful!');
      } else {
        const data = await response.json();
        errorMessage = data.error || 'Registration failed';
      }
    } catch (error) {
      errorMessage = 'An error occurred: ' + error.message;
    }
  }
</script>

<form on:submit|preventDefault={register}>
  <input type="email" placeholder="Email" bind:value={email} required />
  <input type="password" placeholder="Password" bind:value={password} required />
  <input type="password" placeholder="Confirm Password" bind:value={confirmPassword} required />
  <button type="submit">Register</button>
  {#if errorMessage}
    <p style="color: red;">{errorMessage}</p>
  {/if}
</form>
