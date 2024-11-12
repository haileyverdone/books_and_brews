import { fetchProtectedData } from '$lib/api';

let profileData = null;
let errorMessage = '';

onMount(async () => {
  try {
    profileData = await fetchProtectedData('/api/profile');
  } catch (error) {
    errorMessage = error.message;
  }
});
