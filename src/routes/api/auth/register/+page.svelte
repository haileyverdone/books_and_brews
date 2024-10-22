<script>
    let username = '';
    let email = '';
    let password = '';
  
    async function register(event) {
      event.preventDefault(); // Prevent default form submission behavior
  
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      });
  
      if (res.ok) {
        alert('Registration successful');
        // Optionally redirect the user to login or another page
      } else {
        alert('Registration failed');
      }
    }
  </script>
  
  <form on:submit|preventDefault={register}>
    <input type="text" placeholder="Username" bind:value={username} required />
    <input type="email" placeholder="Email" bind:value={email} required />
    <input type="password" placeholder="Password" bind:value={password} required />
    <button type="submit">Register</button>
  </form>