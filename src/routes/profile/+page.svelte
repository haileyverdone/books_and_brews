<script>
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  let user = null;

  onMount(async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      window.location.href = '/login';  // Redirect if not logged in
    } else {
      user = data.session.user;
    }
  });
</script>

