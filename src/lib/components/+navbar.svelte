<script>
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';

  let isLoggedIn = false;
  let userEmail = '';
  let userId = '';
  let user = null;
  let tabs = [
    { name: 'Home', icon: 'bi bi-house-fill', href: '/' },
    { name: 'Create', icon: 'bi bi-plus-circle-fill', href: '/create' },
    { name: 'Explore', icon: 'bi bi-search', href: '/explore' },
    { name: 'Events', icon: 'bi bi-calendar3', href: '/events' },
  ];

  let activeTab = '';

  onMount(async () => {
    const { data } = await supabase.auth.getSession();

    if (data.session) {
      isLoggedIn = true;
      user = data.session.user;
      userEmail = user.email;
      userId = user.id;
    }
  });

  async function handleLogout() {
    await supabase.auth.signOut();
    isLoggedIn = false;
    userEmail = '';
    userId='';
    window.location.href = '/';  
  }

  function setActiveTab(tabName) {
    activeTab = tabName;
  }
</script>

<div class="background-wrapper">
  <nav class="navbar navbar-expand-lg navbar-dark custom-navbar">
    <div class="container-fluid">
      <a class="navbar-brand" href="/">
        <h1>Books & Brews</h1>
      </a>
    </div>

    <button
      class="navbar-toggler ms-auto" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
      aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ms-auto">
        <!-- Render Navigation Tabs -->
        {#each tabs as tab}
        <li class="nav-item">
          <a class="nav-link {activeTab === tab.name ? 'active' : ''}" href={tab.href} on:click={() => setActiveTab(tab.name)}>
            <i class="{tab.icon}"></i> <span class="d-none d-lg-inline">{tab.name}</span>
          </a>
        </li>
        {/each}

        
        <li class="nav-item dropdown">
          <button class="btn btn-link nav-link dropdown-toggle" id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="bi bi-person-fill"></i> Profile
          </button>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
            {#if !isLoggedIn}
              <li><a class="dropdown-item" href="/login">Log In</a></li>
              <li><a class="dropdown-item" href="/register">Register</a></li>
            {:else}
              <li><span class="dropdown-item">Logged in as {userEmail}</span></li>
              <li><a class="dropdown-item" href={`/profile/${userId}`}>View Profile</a></li>
              <li><button class="dropdown-item" on:click={handleLogout}>Log Out</button></li>
            {/if}
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</div>


<style>


  .background-wrapper {
  background-color: white;  
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  min-height:200px;
  margin: 0 auto;
  width: 100%;  
  z-index: 1000; 
  }
  .nav-link {
    display: flex;
    align-items: center;
    color: black;      
    font-size: 1.25rem;
    transition: 0.3s ease-in-out;
  }

  .nav-link i {
    font-size: 2rem;
    margin-right: 10px;
  }

  .custom-navbar {
    background-color: grey;
 
    padding: 0.75rem 1rem;
    width: 100%;  
    margin: 0 auto;  
  }

  h1 {
    color: pink;
    font-family: Georgia, 'Times New Roman', Times, serif;
    font-size: 2.5rem;
  }

  .nav-link:hover {
    color: pink;
  }

  .navbar-collapse {
    justify-content: flex-end;
  }

  .navbar-toggler {
    margin-left: auto;
  }

  .navbar-nav {
    margin-left: auto;
    display: flex;
    justify-content: flex-end;
  }

  .dropdown-menu {
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,1);
    z-index: 2000;
  }
  @media (max-width: 992px) {
    .nav-link {
      font-size: 0.9rem;
    }
  }
</style>
