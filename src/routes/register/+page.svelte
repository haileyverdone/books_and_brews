<script>
  import { goto } from '$app/navigation';
  import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

  let name = '';
  let username = '';
  let email = '';
  let password = '';
  let errorMessage = '';
  let message = '';

  async function handleRegister() {
    const auth = getAuth();
    errorMessage = '';
    message = '';

    try {
      //create user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      //send verification email
      await sendEmailVerification(user);

      //save additonal user data
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, username, email, uid: user.uid, }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save user profile.');
      }
      message = 'Registration successful! Please verify your email. Redirecting to login...';
      setTimeout(() => goto('/login'), 3000);
    } catch (error) {
      errorMessage = error.message || 'An error occurred during registration.';
      console.error('Registration error:', error);
      }
  }
</script>

<div class="signup-container">
  <h1>Sign Up</h1>
  <form on:submit|preventDefault={handleRegister}>
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
  <p>{message}</p>
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
