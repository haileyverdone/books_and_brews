<script>
  import { onMount } from "svelte";
  import { getAuth, onAuthStateChanged} from "firebase/auth";

  let profile = null;
  let errorMessage = "";

  async function fetchProfile(uid) {
    try {
      const response = await fetch(`/api/profile/${uid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch profile.");
      }

      return data.profile;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  }

  onMount(async () => {
      const auth = getAuth();

      onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          profile = await fetchProfile(user.uid);
        } catch (error) {
          errorMessage = error.message || "An error occurred.";
        }
      } else {
        errorMessage = "No user is logged in.";
      }
    });
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
