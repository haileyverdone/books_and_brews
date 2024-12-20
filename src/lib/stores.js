import { writable } from "svelte/store";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "$lib/firebaseConfig";
import { fetchUserProfile } from "$lib/firebaseUtils";
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import { getApp } from 'firebase/app';

export const authState = writable({
  isLoading: true, 
  isLoggedIn: false,
  userEmail: "",
  uid: "",
  userProfile: null,
});

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

  if (!userId) {
    console.error('User ID must be provided to watch the Firestore document.');
    userStore.set(null); // Clear the store if no userId is provided
    return;
  }

  // Reference to the user's Firestore document
  const userDocRef = doc(firestore, 'users', userId);

  // Set up the Firestore listener
  const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
    if (docSnapshot.exists()) {
      const userData = { id: docSnapshot.id, ...docSnapshot.data() };

      // Update userStore
      userStore.set(userData);

      // Sync to authState
      authState.update((state) => ({
        ...state,
        userProfile: userData,
        isLoading: false,
      }));
    } else {
      console.warn(`User document with ID ${userId} does not exist.`);
      userStore.set(null);
      authState.update((state) => ({
        ...state,
        userProfile: null,
        isLoading: false,
      }));
    }
  }, (error) => {
    console.error('Error watching user document:', error);
    userStore.set(null);
    authState.update((state) => ({
      ...state,
      userProfile: null,
      isLoading: false,
    }));
  });

  return unsubscribe; // Return the unsubscribe function
}
