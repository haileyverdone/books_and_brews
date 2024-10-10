<script>
    import {goto} from '$app/navigation';
</script>

<header>
    <h1> Books & Brews</h1>
    <nav>
        <ul>
            <li on:click={() => goto('/explore')}>Explore</li>
            <li on:click={() => goto('/profile')}>Profile</li>
            <li on:click={() => goto('/events')}>Events</li> 
        </ul>
    </nav>
</header>

<style>
    header {
        background: #f8f9fa; /* Light background color */
        padding: 1rem; /* Spacing around the header */
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow */
        display: flex; /* Flexbox layout */
        justify-content: space-between; /* Space out items */
        align-items: center; /* Center items vertically */
    }

    h1 {
        margin: 0; /* Remove default margin */
        font-size: 1.5rem; /* Font size for the title */
        color: #333; /* Dark color for text */
    }

    nav ul {
        list-style-type: none; /* Remove bullet points */
        display: flex; /* Horizontal layout */
        gap: 1.5rem; /* Spacing between links */
        margin: 0; /* Remove default margin */
        padding: 0; /* Remove default padding */
    }

    nav li {
        cursor: pointer; /* Change cursor to pointer on hover */
        color: #007bff; /* Link color */
        transition: color 0.2s; /* Smooth color transition */
    }

    nav li:hover {
        color: #0056b3; /* Darker color on hover */
    }
</style>