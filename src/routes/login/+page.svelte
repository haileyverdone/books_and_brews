<script>
  import { supabase } from '$lib/supabase';

  let email = '';
  let password = '';
  let error = '';

  async function login() {
    try {
      const { user, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (loginError) throw loginError;
      window.location.href = '/profile';
    } catch (err) {
      error = err.message;
    }
  }
</script>

<form on:submit|preventDefault={login}>
  <input type="email" bind:value={email} placeholder="Email" required />
  <input type="password" bind:value={password} placeholder="Password" required />
  <button type="submit">Login</button>
  {#if error}
    <p>{error}</p>
  {/if}
</form>
