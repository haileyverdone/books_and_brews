

<script>
    import { onMount } from 'svelte';
    import { createTestUser } from './'; // Adjust the path if separate file
  
    onMount(() => {
      createTestUser(); // Runs when the component mounts
    });
  </script>
  
  <div>
    <h1>Testing Firestore Connection</h1>
    <button on:click={createTestUser}>Create Test User in Firestore</button>
  </div>
  <h3>Events Page</h3>


<style>
    h3{
        margin-top: 3rem;
        text-align: center;
    }
</style>