<script>
  import { supabase } from '$lib/supabase';
  
  let email = '';
  let password = '';
  let errorMessage = '';

  async function handleLogin() {
    const { user, error } = await supabase.auth.signIn({
      email,
      password,
    });

    if (error) {
      errorMessage = error.message;
    } else {
      window.location.href = '/profile';  // Redirect to profile after login
    }
  }
</script>

<!-- Login Form -->
<div class="login-container">
  <h1>Log In</h1>
  <form on:submit|preventDefault={handleLogin}>
    <div class="form-group">
      <label for="email">Email</label>
      <input id="email" type="email" bind:value={email} required />
    </div>
    
    <div class="form-group">
      <label for="password">Password</label>
      <input id="password" type="password" bind:value={password} required />
    </div>

    <button type="submit">Log In</button>

    {#if errorMessage}
      <p class="error">{errorMessage}</p>
    {/if}
  </form>

  <p>Don't have an account? <a href="/register">Sign Up</a></p>
</div>

<style>
  .login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;
    max-width: 400px;
    padding: 1rem;
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
    background-color: grey;
  }

  .error {
    color: red;
    margin-top: 1rem;
  }
</style>
