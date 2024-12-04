import { writable } from "svelte/store";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "$lib/firebaseConfig";
import { fetchUserProfile } from "$lib/firebaseUtils";

export const authState = writable({
  isLoading: true,  // Initial loading state
  isLoggedIn: false,
  userEmail: "",
  uid: "",
  userProfile: null,
});

// Ensure `updateAuthState` properly resets the loading state
const updateAuthState = async (user) => {
  console.log("updateAuthState called. User:", user);
  if (user) {
    try {
      const profile = await fetchUserProfile(user.uid);
      authState.set({
        isLoading: false,
        isLoggedIn: true,
        userEmail: user.email,
        uid: user.uid,
        userProfile: profile || null,
      });
      console.log("Auth state updated with user profile:", profile);
    } catch (error) {
      console.error('Error updating auth state:', error);
      authState.set({
        isLoading: false,
        isLoggedIn: true,
        userEmail: user.email,
        uid: user.uid,
        userProfile: null,
      });
    }
  } else {
    console.log("No user is logged in.")
    authState.set({
      isLoading: false,
      isLoggedIn: false,
      userEmail: '',
      uid: '',
      userProfile: null,
    });
  }
};

onAuthStateChanged(auth, (user) => {
  console.log('Auth state changed:', user);
  updateAuthState(user);
});
