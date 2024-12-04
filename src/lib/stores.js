import { writable } from "svelte/store";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "$lib/firebaseConfig";
import { fetchUserProfile } from "$lib/firebaseUtils";
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import { getApp } from 'firebase/app';

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


const firestore = getFirestore(getApp());

// Create a writable Svelte store
export const userStore = writable(null);

/**
 * Start watching a Firestore user document.
 * @param {string} userId - The ID of the user to watch.
 */
export function watchUser(userId) {
  console.log('watchUser called with userId:', userId);
  if (!userId) {
    console.error('User ID must be provided to watch the Firestore document.');
    userStore.set(null); // Clear the store if no userId is provided
    return;
  }

  // Reference to the user's Firestore document
  const userDocRef = doc(firestore, 'users', userId);

  // Set up the Firestore listener
  const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
    console.log('User document snapshot:', docSnapshot);
    console.log('updating auth state with isLoading true');
    authState.update((state) => {
      return { ...state, isLoading: true };
    });
    if (docSnapshot.exists()) {
      userStore.set({ id: docSnapshot.id, ...docSnapshot.data() });
    } else {
      console.warn(`User document with ID ${userId} does not exist.`);
      userStore.set(null); // Clear the store if the document is missing
    }
    // Return a function to stop watching the document
    console.log('updating auth state with isLoading false');
    authState.update((state) => {
      return { ...state, isLoading: false };
    });
  }, (error) => {
    console.error('Error watching user document:', error);
    userStore.set(null);
  });


  return unsubscribe;
}
