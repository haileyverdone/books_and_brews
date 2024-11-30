import { writable } from "svelte/store";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { fetchUserProfile } from "$lib/firebaseUtils";

export const authState = writable({
  isLoggedIn: false,
  userEmail: "",
  uid: "",
  userProfile: null,
  isLoading: true,
});

const auth = getAuth();

onAuthStateChanged(auth, async (user) => {
  console.log("Auth state changed:", user); // Should log the user object or `null`
  if (user) {
    try {
      const profile = await fetchUserProfile(user.uid);
      console.log("Fetched profile:", profile);
      authState.set({
        isLoggedIn: true,
        userEmail: user.email,
        uid: user.uid,
        userProfile: profile,
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      authState.set({
        isLoggedIn: true,
        userEmail: user.email,
        uid: user.uid,
        userProfile: null,
      });
    }
  } else {
    console.log("No user logged in");
    authState.set({
      isLoggedIn: false,
      userEmail: '',
      uid: '',
      userProfile: null,
    });
  }
});


