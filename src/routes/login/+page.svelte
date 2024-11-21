<script>
  import { goto } from '$app/navigation';
  import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';

  const auth = getAuth();
  let email = '';
  let password = ''; 
  let errorMessage = '';

  async function handleLogin() {
    errorMessage = '';

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        errorMessage = 'Email not verified. Please check your inbox.';
        return;
      }

      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email}),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Invalid email or password');
      }

      sessionStorage.setItem('authToken', data.token); // Store the token
      await goto(`/profile/${data.uid}`); // Redirect to the profile page
    } catch (err) {
      errorMessage = err.message || 'An error occured during login.'; // Display the error message
      console.error('Login error:', err);
    }
  }
</script>

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
</div>

<style>
  .login-container {
    display: flex;
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

  button:disabled {
    background-color: grey;
    cursor: not-allowed;
  }

  button:hover:enabled {
    background-color: grey;
  }

  .error {
    color: red;
    margin-top: 1rem;
  }
</style>
