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
  console.log("Auth state changed:", user);
  if (user) {
    try {
      const userProfileResponse = await fetchUserProfile(user.uid);
      console.log("Fetched user profile:", userProfileResponse);
      authState.set({
        isLoggedIn: true,
        userEmail: user.email,
        uid: user.uid,
        userProfile: userProfileResponse.data || null,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      authState.set({
        isLoggedIn: true,
        userEmail: user.email,
        uid: user.uid,
        userProfile: null,
        isLoading: false,
      });
    }
  } else {
    console.log("No user logged in");
    authState.set({
      isLoggedIn: false,
      userEmail: "",
      uid: "",
      userProfile: null,
      isLoading: false,
    });
  }
});
