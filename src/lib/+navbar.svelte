<script>
  import { signOut } from 'firebase/auth';
  import { auth } from "$lib/firebaseConfig";
  import { authState } from '$lib/stores';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  let tabs = [
    { name: 'Home', icon: 'bi bi-house-fill', href: '/' },
    { name: 'Create', icon: 'bi bi-plus-circle-fill', href: '/create' },
    { name: 'Explore', icon: 'bi bi-search', href: '/explore' },
    { name: 'Events', icon: 'bi bi-calendar3', href: '/events' },
  ];
  const profileSubpages = [
  { name: "Login", href: "/login" },
  { name: "Register", href: "/register" }
  ];


  let activeTab ='';
  $: {
  const matchingTab = tabs.find(tab => {
    if (tab.href === "/") {
      return $page.url.pathname === "/";
    } else if ($page.url.pathname.startsWith("/profile")) {
      return tab.name === "Profile";
    } else {
      return $page.url.pathname.startsWith(tab.href);
    }
  });

  if (matchingTab) {
    activeTab = matchingTab.name; 
  } else {
    activeTab = null; 
  }

  console.log("Active Tab:", activeTab);
}

  $: ({ isLoggedIn, isLoading, userEmail, uid, userProfile } = $authState);

  async function handleLogout() {
    try {
      await signOut(auth);
      console.log('User logged out successfully');
      goto('/'); 
    } catch (error) {
      console.error('Error during logout:', error);
      alert('Failed to log out. Please try again.');
    }
  }
</script>


<div class="background">
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

    <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
      <ul class="navbar-nav ms-auto">
        {#each tabs as tab}
          <li class="nav-item">
            <button
            class="nav-link {activeTab === tab.name ? 'active' : ''}"
            on:click={() => {
              console.log("Tab clicked:", tab.name);
              goto(tab.href); 
              document.activeElement.blur();
            }}
          >
            <i class="{tab.icon}"></i>
            <span class="d-none d-lg-inline">{tab.name}</span>
          </button>
          </li>
        {/each}

        <li class="nav-item dropdown">
          <button class="btn btn-link nav-link dropdown-toggle {activeTab === 'Profile' ? 'active' : ''}" id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="bi bi-person-fill"></i> Profile
          </button>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
            {#if isLoading}
            <li class="nav-item">
              <span class="dropdown-item">Loading...</span>
            </li>
            {:else if isLoggedIn}
            <li><span class="dropdown-item">Logged in as {userEmail}</span></li>
            {#if userProfile}
              <li><a class="dropdown-item" href={`/profile/${uid}`}>View Profile</a></li>
            {:else}
              <li><span class="dropdown-item">Loading profile...</span></li>
            {/if}
            <li><button class="dropdown-item" on:click={handleLogout}>Log Out</button></li>
          {:else}
            {#each profileSubpages as subpage}
              <li>
                <button
                  class="dropdown-item {activeTab === 'Profile' && $page.url.pathname === subpage.href ? 'active' : ''}"
                  on:click={() => {
                    goto(subpage.href);
                    document.activeElement.blur();
                  }}
                >
                  {subpage.name}
                </button>
              </li>
            {/each}
          {/if}
        </ul>
      </li>
    </div>
  </nav>
</div>    

<style>
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
    border-bottom: 10px;
  }

  h1 {
    color: pink;
    font-family: Georgia, 'Times New Roman', Times, serif;
    font-size: 2.5rem;
    margin: 0;
  }

  .nav-link:hover {
    color: pink;
  }


  .navbar-collapse {
    position: absolute;
    top: 100%;
    right: 0;
   
    width: 100%;
  }

  .navbar-toggler {
    margin-left: auto;
  }
  @media (max-width: 992px) {
  .navbar-collapse {
    justify-content: right;
  }

  .navbar-nav {
    flex-direction: row;
    align-items: center;
    display: flex;
    gap: 1.5rem;
   
  }
  .nav-item {
    text-align: center;
  }
  .nav-link{
    font-size: 1.5rem;
    color: black;
    transition: color 0.3s ease-in-out;
  }
}
 
</style>
