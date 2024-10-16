<script>
  let tabs = [
    {name: 'Home', icon: 'bi-house-fill'},
    {name: 'Create', icon: 'bi-plus-circle-fill', },
    {name: 'Explore', icon: 'bi-search' },
    {name: 'Events', icon: 'bi-calendar3' },
    {name: 'Profile', icon: 'bi-person-fill' }
  ];

  let activeTab = 'Home';

  /**
	 * @param {string} tabName
	 */
  function setActiveTab(tabName) {
    
    activeTab = tabName;
  }

</script>


<header class = "navbar">
    <div class="logo">
        <img src="/logo.png" alt ="Books & Brews Logo" class="logo" />
    </div>
    <div class="title-container"> 
        <h1> Books & Brews</h1>
       
    </div>

<nav class="tabs">
  {#each tabs as tab}
    <div
      role="button"
      tabindex="0"
      class="tab {activeTab === tab.name ? 'active' : ''}"
      on:click={() => setActiveTab(tab.name)}
      on:keydown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          setActiveTab(tab.name);
        }
      }}
    >
      <i class="{tab.icon} tab-icon"></i>
    </div>
  {/each}
</nav>
</header>




<div class="tab-content">
  {#if activeTab === 'Create'}
    <p>Content for the Create tab.</p>
  {/if}
  {#if activeTab === 'Explore'}
    <p>Content for the Explore tab.</p>
  {/if}
  {#if activeTab === 'Events'}
    <p>Content for the Events tab.</p>
  {/if}
  {#if activeTab === 'Profile'}
    <p>Content for the Profile tab.</p>
  {/if}
</div>

<style>
    .navbar {
      display:flex;
      justify-content: space-between;
      align-items: center;
      color: white;      
      padding: 1rem 2rem;
      background-color: #4b412e;
    }
    .logo img {
      height: 100px;
    }
    .title-container { 
        flex-grow: 1;
        text-align: center;
    }
    .title-container h1 {
      font-size: 5rem;
      margin: 0;
      font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
    }
    .search-bar {
      width: 100%;
      max-width: 500px;
      padding: 0.75rem;
      border-radius: 8px;
      border: 1px solid #ccc;
      outline: none;
      background-color: white;
      color:black;
    }
    .tabs {
      display: flex;
      justify-content: center;
      gap: 1rem;
      
    }
    .tab {
      cursor: pointer;
      transition: background-color 0.3s ease-in-out;

    }
    .tab.active {
      color: #f0f0f0;
    }
    .tab-icon {
      font-size: 35px;
      color: #0b0b0b;
    }
    .tab-icon:hover {
      color: aqua;
    }
  </style>