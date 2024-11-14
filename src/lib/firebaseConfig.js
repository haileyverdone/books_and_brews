import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; 
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAshuOPMXNUwpbyzkHKey2RwI8VRKWs7qw",
  authDomain: "books-and-brews-cf45b.firebaseapp.com",
  projectId: "books-and-brews-cf45b",
  storageBucket: "books-and-brews-cf45b.firebasestorage.app",
  messagingSenderId: "97062470051",
  appId: "1:97062470051:web:cb89f60b2bb181e9a21a16",
  measurementId: "G-S6Q2ZDWREH"
};

const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);
export default app; 
