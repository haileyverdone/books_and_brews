<script>
  import { authState } from '$lib/stores';

let profile = null;
let errorMessage = "";

$: if ($authState.userProfile) {
  profile = $authState.userProfile;
} else {
  errorMessage = "No user is logged in.";
}
</script>

{#if profile}
  <div class="profile-page">
    <h1>Welcome, {profile.name}!</h1>
    <p>Username: {profile.username}</p>
    <p>Email: {profile.email}</p>
  </div>
{:else if errorMessage}
  <p class="error">{errorMessage}</p>
{/if}

<style>
  .profile-page {
    padding: 2rem;
    max-width: 600px;
    margin: auto;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.2rem;
  }

  .error {
    color: red;
    font-weight: bold;
  }
</style>
