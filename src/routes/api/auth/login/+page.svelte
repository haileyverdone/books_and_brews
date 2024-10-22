<script>
    let email = '';
    let password = '';
  
    async function login(event) {
      event.preventDefault();
  
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Login successful:', data);
        // Handle successful login (e.g., redirect or show user info)
      } else {
        console.error('Login failed:', data.error);
        // Handle errors (e.g., show error message)
      }
    }
  </script>
  
  <form on:submit|preventDefault={login}>
    <input type="email" placeholder="Email" bind:value={email} required />
    <input type="password" placeholder="Password" bind:value={password} required />
    <button type="submit">Login</button>
  </form>
  
  <style>
    /* Add your styles here */
  </style>