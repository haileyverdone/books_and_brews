import { writable } from 'svelte/store';

export const authState = writable({
  isLoggedIn: false,
  userEmail: '',
  uid: '',
  userProfile: null,
});
  