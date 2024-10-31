<script>
  import { register } from '$lib/auth.js'; // Firebase register function

  let name = '';
  let username = '';
  let email = '';
  let password = '';
  let errorMessage = '';

  async function handleSignup() {
    errorMessage = '';

    if (!name || !username || !email || !password) {
      errorMessage = 'All fields are required.';
      return;
    }

    try {
      // Register user with Firebase
      const user = await register(email, password);

      // Send user data to your server-side API to insert into PostgreSQL
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firebase_uid: user.uid,
          name,
          username,
          email
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create user profile');
      }

      // Redirect to login page after successful registration
      window.location.href = '/login';

    } catch (err) {
      errorMessage = err.message;
    }
  }
</script>

<div class="signup-container">
  <h1>Sign Up</h1>
  <form on:submit|preventDefault={handleSignup}>
    <div class="form-group">
      <label for="name">Name</label>
      <input id="name" type="text" bind:value={name} required />
    </div>
    <div class="form-group">
      <label for="username">Username</label>
      <input id="username" type="text" bind:value={username} required />
    </div>
    <div class="form-group">
      <label for="email">Email</label>
      <input id="email" type="email" bind:value={email} required />
    </div>
    <div class="form-group">
      <label for="password">Password</label>
      <input id="password" type="password" bind:value={password} required />
    </div>

    <button type="submit">Sign Up</button>

    {#if errorMessage}
      <p class="error">{errorMessage}</p>
    {/if}
  </form>

  <p>Already have an account? <a href="/login">Log In</a></p>
</div>


<style>
  .signup-container {
    display: flexbox;
    flex-direction: column;
    align-items: center;
    margin: auto;
    max-width: 500px;
    padding: 2rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: pink;
    margin-top: 3rem;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }

  .form-group {
    margin-bottom: 1.5rem;
    width: 100%;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
  }

  .form-group input {
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  button {
    width: 100%;
    padding: 1rem;
    font-size: 1rem;
    background-color: black;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background-color: gray;
  }

  .error {
    color: red;
    margin-top: 1rem;
  }
</style>
