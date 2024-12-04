import { writable } from "svelte/store";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "$lib/firebaseConfig";
import { fetchUserProfile } from "$lib/firebaseUtils";

// Define the auth state
export const authState = writable({
  isLoading: true,  // Initial loading state
  isLoggedIn: false,
  userEmail: "",
  uid: "",
  userProfile: null,
});

// Function to update auth state
const updateAuthState = async (user) => {
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
      console.log("Auth state updated for user:", user);
    } catch (error) {
      console.error("Error fetching user profile:", error);
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
};

// Firebase onAuthStateChanged listener
onAuthStateChanged(auth, (user) => {
  console.log("Auth state changed:", user);
  updateAuthState(user);
});

// Ensure state updates when switching tabs (browser-only code)
if (typeof window !== "undefined") {
  window.addEventListener("visibilitychange", async () => {
    if (document.visibilityState === "visible") {
      const user = auth.currentUser;
      console.log("Tab switched, checking current user:", user);
      await updateAuthState(user);
    }
  });
}

// Debugging: Log the current auth state periodically
authState.subscribe((state) => {
  console.log("Updated auth state:", state);
});
