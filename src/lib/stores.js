import { writable } from "svelte/store";
import {  onAuthStateChanged } from "firebase/auth";
import { auth } from "$lib/firebaseConfig"; 
import { fetchUserProfile } from "$lib/firebaseUtils";

export const authState = writable({
  isLoggedIn: false,
  userEmail: "",
  uid: "",
  userProfile: null,
});


onAuthStateChanged(auth, async (user) => {
  console.log("Auth state changed:", user); // Should log the user object or `null`
  if (user) {
    if (user) {
      console.log("User is logged in:", {
        email: user.email,
        uid: user.uid,
      });
    }
    try {
      const profile = await fetchUserProfile(user.uid);
      console.log("Fetched profile:", profile);
      authState.set({
        isLoggedIn: true,
        userEmail: user.email,
        uid: user.uid,
        userProfile: profile || null,
      });
      console.log("Auth state updated: User logged in", {
        isLoggedIn: true,
        userEmail: user.email,
        uid: user.uid,
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
    console.log("Auth state updated: User logged out");
  }
});


