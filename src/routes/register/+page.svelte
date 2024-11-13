<script>
  let name = '';
  let username = '';
  let email = '';
  let password = '';
  let errorMessage = '';

  async function handleRegister() {
    errorMessage = '';

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error registering user');
      }

      // Redirect to the login page after successful registration
      window.location.href = '/login';
    } catch (err) {
      errorMessage = err.message;
      console.error('Registration error:', err); // Debugging info
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
