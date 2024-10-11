
<header class = "header">
    <div class="logo-container">
        <img src="/logo.png" alt ="Books & Brews Logo" class="logo" />
    </div>
    <div class="title-container"> 
        <h1> Books & Brews</h1>
        <input type="text" placeholder="Search for your favorite books and coffee..." class="search-bar" />
    </div>
</header>

<nav class="tabs">
    <a href="/create">Create</a>
    <a href="/explore">Explore</a>
    <a href="/events">Events</a>
    <a href="/profile">Profile</a>
</nav>

<style>
    .header {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      background-color: #4b412e;
      position: relative;
    }
    .logo-container {
      position: absolute;
      left: 1rem;
    }

    h1 {
      font-size: 100px; 
     }
    .logo {
      width: 180px;
    }
    .title-container h1{ 
        text-align: center;
    }
    .search-bar {
      margin-top: 0.5 rem;
      width: 100%;
      max-width: 600px;
      padding: 0.5 rem;
      border-radius: 10px;
      border: 1px solid black;
    }
    .tabs {
      display: flex;
      justify-content: space-around;
      background-color: #f5f5f5;
      padding: 1rem;
    }
    .tabs a {
      text-decoration: none;
      color: #0b0b0b;
      font-weight: bold;
    }
  </style>