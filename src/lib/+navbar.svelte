<script>
  import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
  import { doc, getDoc } from 'firebase/firestore';
  import app, { db } from '$lib/firebaseConfig';
  import { authState } from '$lib/stores';

  let isLoggedIn = false, userEmail = '', uid = '', userProfile = null;
  let activeTab = '';

  const auth = getAuth(app);

  $: ({ isLoggedIn, userEmail, uid, userProfile } = $authState);

  // Navigation tabs
  let tabs = [
    { name: 'Home', icon: 'bi bi-house-fill', href: '/' },
    { name: 'Create', icon: 'bi bi-plus-circle-fill', href: '/create' },
    { name: 'Explore', icon: 'bi bi-search', href: '/explore' },
    { name: 'Events', icon: 'bi bi-calendar3', href: '/events' },
  ];

  // Set the active tab
  function setActiveTab(tabName) {
    activeTab = tabName;
    console.log("Setting active tab to:", tabName);
  }

  // Fetch user profile
  async function fetchUserProfile(uid) {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
       return userDoc.data();
      } else {
        console.log("No profile found.");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  }

 
    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userProfile = await fetchUserProfile(currentUser.uid); // Fetch user profile from Firestore
      authState.set({
        isLoggedIn: true,
        userEmail: currentUser.email,
        uid: currentUser.uid,
        userProfile: userProfile || null,
      });
      } else {
        authState.set({
          isLoggedIn: false,
          userEmail: '',
          uid: '',
          userProfile: null,
        });
      }
    });


  // Logout function
  async function handleLogout() {
    await signOut(auth);
    authState.set({
    isLoggedIn: false,
    userEmail: '',
    uid : '',
    userProfile: null,
    })
    window.location.href = '/';
  }

  // Log the current state for debugging
  $: console.log('Current auth state:', { isLoggedIn, userEmail, uid, userProfile });
  $: console.log('Current active tab:', activeTab);
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

    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ms-auto">
        {#each tabs as tab}
          <li class="nav-item">
            <a
              class="nav-link {activeTab === tab.name ? 'active' : ''}"
              href={tab.href}
              on:click={() => setActiveTab(tab.name)}
            >
              <i class="{tab.icon}"></i> 
              <span class="d-none d-lg-inline">{tab.name}</span>
            </a>
          </li>
        {/each}

        <li class="nav-item dropdown">
          <button class="btn btn-link nav-link dropdown-toggle" id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="bi bi-person-fill"></i> Profile
          </button>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
            {#if isLoggedIn}
              <li><span class="dropdown-item">Logged in as {userEmail}</span></li>
              {#if userProfile && userProfile.name}
                <li><a class="dropdown-item" href={`/profile/${uid}`}>View Profile</a></li>
              {:else}
                <li><span class="dropdown-item">Loading profile...</span></li>
              {/if}
              <li><button class="dropdown-item" on:click={handleLogout}>Log Out</button></li>
            {:else}
              <li><a class="dropdown-item" href="/login">Log In</a></li>
              <li><a class="dropdown-item" href="/register">Register</a></li>
            {/if}
          </ul>
        </li>
      </ul>
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
</style>
