<script>
  import { supabase } from '$lib/supabase';

  let name = '';
  let username = '';
  let email = '';
  let password = '';
  let errorMessage = '';

  async function handleSignup() {
    errorMessage = '';  // Clear previous error messages

    // Ensure all fields are filled
    if (!name || !username || !email || !password) {
      errorMessage = 'All fields are required.';
      return;
    }

    // Create the user with email and password authentication via Supabase
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      errorMessage = signUpError.message;
      return;
    }

    // Get the newly signed-up user's data (id, etc.)
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      errorMessage = 'Error fetching user data: ' + userError.message;
      return;
    }

    // Insert additional profile info into the 'profiles' table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{ id: user.id, name, username, email, password }]); // Add profile data

    if (profileError) {
      errorMessage = 'Error inserting profile: ' + profileError.message;
    } else {
      window.location.href = '/login'; // Redirect to login after successful signup
    }
  }
</script>

<!-- Signup Form -->
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
