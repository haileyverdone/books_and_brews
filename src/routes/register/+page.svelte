<script>
  import { supabase } from '$lib/supabase';

  let email = '';
  let password = '';
  let error = '';

  async function register() {
    try {
      const { user, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError) throw signUpError;
      window.location.href = '/login';
    } catch (err) {
      error = err.message;
    }
  }
</script>

<form on:submit|preventDefault={register}>
  <input type="email" bind:value={email} placeholder="Email" required />
  <input type="password" bind:value={password} placeholder="Password" required />
  <button type="submit">Register</button>
  {#if error}
    <p>{error}</p>
  {/if}
</form>
