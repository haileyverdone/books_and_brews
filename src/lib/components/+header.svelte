<script>
  let tabs = [
    {name: 'Home', icon: 'as fa-home'},
    {name: 'Create', icon: 'fas fa-plus', },
    {name: 'Explore', icon: 'fas fa-search' },
    {name: 'Events', icon: 'fa-regular fa-calendar' },
    {name: 'Profile', icon: 'fas fa-user' }
  ];

  let activeTab = 'Home';

  function setActiveTab(tabName: string) {
    
    activeTab = tabName;
  }

</script>


<header class = "header">
    <div class="logo-container">
        <img src="/logo.png" alt ="Books & Brews Logo" class="logo" />
    </div>
    <div class="title-container"> 
        <h1> Books & Brews</h1>
        <div class="search-container"></div>
          <input type="text" placeholder="Search for your favorite books and coffee..." class="search-bar" />
    </div>
</header>


<nav class="tabs">
  {#each tabs as tab}
    <div
      role="button"
      class="tab {activeTab === tab.name ? 'active' : ''}"
      on:click={() => setActiveTab(tab.name)}
    >
      <i class="{tab.icon} tab-icon"></i>
      </div>
  {/each}
</nav>

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
    .header {
      display: center;
      align-items: center;
      color: white;      
      padding: 2rem 1rem;
      background-color: #4b412e;
    }
    .logo-container {
      position: absolute;
      left: 1rem;
    }

    h1 {
      font-size: 100px; 
      font-family:Cambria, Cochin, Georgia, Times, 'Times New Roman', serif
     }
    .logo {
      width: 250px;
    }
    .title-container h1{ 
        flex: 1;
        text-align: center;
    }
    .search-bar {
      width: 80%;
      max-width: 500px;
      padding: 0.5rem;
      border-radius: 8px;
      border: 1px solid #ccc;
      margin-top: 0.5rem;
    }
    .tabs {
      display: flex;
      justify-content: center;
      padding: 1rem;
      background-color: #f0f0f0;
      gap: 1rem;
      
    }
    .tab-icon {
      font-size: 32px;
      color: #0b0b0b;
      transition: transform 0.3s ease-in-out, color 0.3s;
    }
    .tabs :hover .tab-icon {
      transform: scale(1.2);
      color: aqua;
    }
  </style>