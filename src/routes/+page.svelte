<script>
  import { onMount } from "svelte";
  import { fetchPostCount, fetchActiveUserCount } from "$lib/firebaseFunctions";
  import { getAuth, onAuthStateChanged } from "firebase/auth";

  let totalPosts = 0;
  let activeMembers = 0;
  let isLoggedIn = false;

  async function fetchStats() {
    if (isLoggedIn) {
      try {
        totalPosts = await fetchPostCount();
      } catch (error) {
        console.error("Error fetching post count:", error);
      }
    }
    try {
      activeMembers = await fetchActiveUserCount();
    } catch (error) {
      console.error("Error fetching active members:", error);
    }
  }

  onMount(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      isLoggedIn = !!user; // Check if a user is logged in
      fetchStats();
    });
  });
</script>


<!-- Carousel -->
<div id="myCarousel" class="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="2000">
  <div class="carousel-inner">
    <div class="carousel-item active" style="background-color: #769898;">
      <div class="carousel-content">
        <h1>Welcome to Books & Brews</h1>
        <button class="cta-button" on:click={() => window.location.href = '/create'}>Create a Post</button>
      </div>
    </div>
    <div class="carousel-item" style="background-color: #d9dbe7;">
      <div class="carousel-content">
        <h2>Join book clubs and events near you</h2>
        <button class="cta-button" on:click={() => window.location.href = '/events'}>View Events</button>
      </div>
    </div>
    <div class="carousel-item" style="background-color: #d4df91;">
      <div class="carousel-content">
        <h2>Discover your next favorite coffee</h2>
        <button class="cta-button" on:click={() => window.location.href = '/explore'}>Explore Posts</button>
      </div>
    </div>
  </div>
  <button class="carousel-control-prev" type="button" data-bs-target="#myCarousel" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#myCarousel" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
</div>

<!-- Stats Section -->
<section class="stats">
  <h2>Our Community</h2>
  <div class="stats-grid">
    {#if isLoggedIn}
      <div class="stat">
        <h3>{totalPosts}</h3>
        <p>Posts Created</p>
      </div>
    {/if}
    <div class="stat">
      <h3>{activeMembers}</h3>
      <p>Active Members</p>
    </div>
  </div>
</section>

<!-- How-To Section -->
<section class="how-to">
  <h2>How to Get Started</h2>
  <div class="steps">
    <div class="step">
      <div class="step-header">
        <div class="step-number">1</div>
        <h3>Create an Account</h3>
      </div>
      <p>Sign up to join our community and unlock access to explore and share your favorite books and coffee spots.</p>
    </div>

    <div class="step">
      <div class="step-header">
        <div class="step-number">2</div>
        <h3>Explore and Create Posts</h3>
      </div>
      <p>Browse through user-generated posts or share your own experiences with books and coffee shops. Include images, reviews, and more!</p>
    </div>

    <div class="step">
      <div class="step-header">
        <div class="step-number">3</div>
        <h3>Join Events</h3>
      </div>
      <p>Discover book clubs and coffee events happening near you. Meet new people and enjoy meaningful conversations over your favorite brews.</p>
    </div>

    <div class="step">
      <div class="step-header">
        <div class="step-number">4</div>
        <h3>Engage with the Community</h3>
      </div>
      <p>Like, comment, and interact with posts. Build your profile and become a part of our growing community of book and coffee lovers.</p>
    </div>
  </div>
</section>


<style>
  .carousel-inner {
    margin: 0;
    padding: 0;
  }

  .carousel-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 400px;
    color: white;
  }

  .cta-button {
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 1rem;
    background-color: #795548;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .cta-button:hover {
    background-color: #5c3e38;
  }

  .stats {
    text-align: center;
    padding: 40px 20px;
    background-color: #f5f5f5;
  }

  .stats-grid {
    display: flex;
    justify-content: center;
    gap: 40px;
  }

  .stat {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }

  .stat h3 {
    font-size: 2rem;
    margin-bottom: 10px;
    color: #795548;
  }

  .stat p {
    margin: 0;
    font-size: 1rem;
    color: #555;
  }
  .how-to {
    padding: 60px 20px;
    background-color: #f0f8ff;
    text-align: center;
  }

  .how-to h2 {
    margin-bottom: 40px;
    font-size: 2.2rem;
    color: #333;
    font-weight: bold;
  }

  .steps {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 30px;
  }

  .step {
    background: white;
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.1);
    text-align: left;
  }

  .step-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }

  .step-number {
    font-size: 1.5rem;
    font-weight: bold;
    color: white;
    background-color: #795548;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    margin-right: 15px;
  }

  .step h3 {
    font-size: 1.4rem;
    color: #333;
    margin: 0;
  }

  .step p {
    margin: 0;
    font-size: 1rem;
    color: #555;
    line-height: 1.6;
  }
</style>
