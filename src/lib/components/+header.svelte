
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
      justify-content: space-between;
      padding: 1rem;
      background-color: #f7f7f7;
    }
    .logo-container {
      flex: 1;
    }
    .logo {
      width: 120px;
      ;
    }
    .title-container h1{
        text-align: center;
        margin: 0;
        color: black;
    }
    .search-bar {
      margin-top: 0.5 rem;
      width: 60%;
      padding: 0.5rem;
      border-radius: 8px;
      border: 1px solid black;
      align-items: center;
    }
    .user-actions {
      display: flex;
      align-items: center;
    }
    .tabs {
      display: flex;
      justify-content: space-around;
      background-color: #f0f0f0;
      padding: 1rem;
    }
    .tabs a {
      text-decoration: none;
      color: #333;
      font-weight: bold;
    }
    main {
      padding: 1rem;
    }
  </style>