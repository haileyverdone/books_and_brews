import { writable } from "svelte/store";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "$lib/firebaseConfig"; 
import { fetchUserProfile } from "$lib/firebaseUtils";

export const authState = writable({
  isLoading: true,
  isLoggedIn: false,
  userEmail: '',
  uid: '',
  userProfile: null,
});


onAuthStateChanged(auth, async (user) => {
  console.log("Auth state changed:", user);

  if (user) {
    try {
      console.log("Fetching profile for UID:", user.uid);
      const profile = await fetchUserProfile(user.uid);
      console.log("Fetched profile:", profile);

      authState.set({
        isLoading: false,
        isLoggedIn: true,
        userEmail: user.email,
        uid: user.uid,
        userProfile: profile || null,
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      authState.set({
        isLoading: false,
        isLoggedIn: true,
        userEmail: user.email,
        uid: user.uid,
        userProfile: null,
      });
    }
  } else {
    console.log("No user is logged in.");
    authState.set({
      isLoading: false,
      isLoggedIn: false,
      userEmail: "",
      uid: "",
      userProfile: null,
    });
  }
});
authState.subscribe((state) => {
  console.log("Current authState:", state);
});



