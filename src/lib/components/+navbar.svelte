<script>
  let tabs = [
    {name: 'Home', icon: 'bi bi-house-fill', href:'/'},
    {name: 'Create', icon: ' bi bi-plus-circle-fill',href:'/create' },
    {name: 'Explore', icon: ' bi bi-search', href: '/explore' },
    {name: 'Events', icon: ' bi bi-calendar3', href: '/events' },
    {name: 'Profile', icon: ' bi bi-person-fill' ,href: '/profile' }
  ];

  let activeTab = 'Home';

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
    <div class="collapse navbar-collapse" id="navbarNav">
    <ul class="navbar-nav ms-auto">
      {#each tabs as tab}
        <li class="nav-item">
          <a
            class="nav-link {activeTab === tab.name ? 'active' : ''}"
            href={tab.href}
            on:click={() => setActiveTab(tab.name)} >
            <i class="{tab.icon}"></i> <span class="d-none d-lg-inline">{tab.name}</span>
          </a>
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
      font-size: 1.5 rem;
      margin-right: 8px;
    }
    .nav-link.active {
      color:white;
    }
    .custom-navbar{
      background-color: #4b412e;
      
    }
    h1 {
      color: black;
      font:bold;
    }
  </style>