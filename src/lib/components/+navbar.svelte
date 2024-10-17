<script>
  let tabs = [
    {name: 'Home', icon: 'bi bi-house-fill', href:'/'},
    {name: 'Create', icon: ' bi bi-plus-circle-fill',href:'/create' },
    {name: 'Explore', icon: ' bi bi-search', href: '/explore' },
    {name: 'Events', icon: ' bi bi-calendar3', href: '/events' },
    {name: 'Profile', icon: ' bi bi-person-fill' ,href: '/profile' , subtabs:[{name: 'Register', href:'/register'}, {name:'Log In', href:'/login'}]}
  ];

  let activeTab = '';

  /**
	 * @param {string} tabName
	 */
  function setActiveTab(tabName) {
    
    activeTab = tabName;
  }

</script>


<nav class = "navbar navbar-expand-lg navbar-dark custom-navbar">
    <div class="container-fluid">
      <a class="navbar-brand" href="/">
        <h1> Books & Brews</h1> 
      </a>
    </div>
    <button
      class="navbar-toggler ms-auto" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
    <ul class="navbar-nav ms-auto">
      {#each tabs as tab}
        <li class="nav-item{tab.subtabs ? 'dropdown' : ''}">
          <a
            class="nav-link {activeTab === tab.name ? 'active' : ''}"
            href={tab.href}
            on:click={() => setActiveTab(tab.name)} 
            data-bs-toggle={tab.subtabs ? 'dropdown' : ''}
            aria-expanded="false">
            <i class="{tab.icon}"></i> <span class="d-none d-lg-inline">{tab.name}</span>
          </a>
          {#if tab.subtabs}
          <ul class="dropdown-menu dropdown-menu-end">
            {#each tab.subtabs as subtab}
              <li><a class="dropdown-item" href={subtab.href}>{subtab.name}</a>
            {/each}
          </ul>
          {/if}
        </li>
      {/each}
    </ul>
  </div>
</nav>


<style>
    .nav-link {
      display:flex;
      align-items: center;
      color: black;      
      font-size: 1.25 rem;
      transition:  0.3s ease-in-out;
    }
    .nav-link i {
      font-size: 2 rem;
      margin-right: 10px;
    }
    .custom-navbar{
      background-color: #3d3932;
      
    }
    .custom-navbar:hover {
      color: pink;
    }
    h1 {
      color: pink;
      font-weight:bold;
    }
    .nav-link:hover {
    color: pink;
    }
    .navbar-collapse {
      justify-content: flex-end;
    }
    .dropdown-menu {
      right: 0;
      left: auto;
    }
    .navbar-nav{
      text-align: right;
    }

  
  </style> 