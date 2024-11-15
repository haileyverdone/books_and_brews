import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import app from './firebaseConfig';

const auth = getAuth(app);
const db = getFirestore(app);

// Authentication functions
export async function register(email, password) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(userCredential.user); // Send verification email
  return userCredential;
}

export async function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

// Firestore functions
export async function saveUserProfile(uid, profileData) {
  await setDoc(doc(db, 'users', uid), profileData);
}

export async function getUserProfile(uid) {
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (userDoc.exists()) {
    return userDoc.data();
  } else {
    throw new Error('User profile not found');
  }
}
