<script>
  let username = '';
  let password = '';
  let error = '';

  async function handleRegister() {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch('/register', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      window.location.href = '/login';
    } else {
      error = 'Registration failed.';
    }
  }
</script>

<form on:submit|preventDefault={handleRegister}>
  <input type="text" bind:value={username} placeholder="Username" required />
  <input type="password" bind:value={password} placeholder="Password" required />
  <button type="submit">Register</button>
  {#if error}
    <p>{error}</p>
  {/if}
</form>
