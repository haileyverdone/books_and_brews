<script>
  import { onMount } from "svelte";
  import { fetchPostCount, fetchActiveUserCount } from '$lib/firebaseFunctions';

  let totalPosts = 0;
  let activeMembers = 0;

  // Fetch stats when the component loads
  async function fetchStats() {
    try {
      totalPosts = await fetchPostCount();
      activeMembers = await fetchActiveUserCount();
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }

  onMount(fetchStats);
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
    <div class="stat">
      <h3>{totalPosts}</h3>
      <p>Posts Created</p>
    </div>
    <div class="stat">
      <h3>{activeMembers}</h3>
      <p>Active Members</p>
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
</style>
