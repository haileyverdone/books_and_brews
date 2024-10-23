<script>
  let username = '';
  let password = '';
  let error = '';

  async function handleLogin() {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch('/login', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      window.location.href = '/profile';
    } else {
      error = 'Login failed. Try again.';
    }
  }
</script>

<form on:submit|preventDefault={handleLogin}>
  <input type="text" bind:value={username} placeholder="Username" required />
  <input type="password" bind:value={password} placeholder="Password" required />
  <button type="submit">Login</button>
  {#if error}
    <p>{error}</p>
  {/if}
</form>
