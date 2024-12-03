<script>
  import { goto } from '$app/navigation';
  import { signInWithEmailAndPassword } from 'firebase/auth';
  import { auth } from '$lib/firebaseConfig';

  let email = '';
  let password = '';
  let errorMessage = '';
  let isLoading = false;

  async function handleLogin() {
    errorMessage = '';
    isLoading = true;

    try {
      // Sign in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('Firebase Auth Login Successful:', user);

      if (!user.emailVerified) {
        errorMessage = 'Email not verified. Please check your inbox.';
        return;
      }

      // Redirect to profile page
      await goto(`/profile/${user.uid}`);
    } catch (err) {
      errorMessage = err.message || 'An error occurred during login.';
      console.error('Login error:', err);
    } finally {
      isLoading = false;
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
    <button type="submit" disabled={isLoading}>
      {isLoading ? 'Logging In...' : 'Log In'}
    </button>
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
