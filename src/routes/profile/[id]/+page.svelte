<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";

  let profile = null;
  let errorMessage = "";

  onMount(async () => {
    const params = $page.params;

    if (!params.id) {
      errorMessage = "No profile ID provided.";
      console.error(errorMessage);
      return;
    }

    try {
      // Get the authentication token from localStorage
      const token = localStorage.getItem("authToken");

      if (!token) {
        errorMessage = "You need to be logged in to view this profile.";
        console.error(errorMessage);
        return;
      }

      console.log(`Fetching profile for ID: ${params.id}`);

      const response = await fetch(`/api/profile/${params.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Send token for authorization
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error fetching profile data");
      }

      profile = data.profile;
      console.log("Fetched profile data:", profile);
    } catch (err) {
      errorMessage = err.message;
      console.error("Error fetching profile:", err);
    }
  });
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
