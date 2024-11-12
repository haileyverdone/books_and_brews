import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import app from '$lib/firebaseConfig';

const db = getFirestore(app);

export async function saveUserProfile(uid, name, username, email) {
  try {
    await setDoc(doc(db, 'profiles', uid), { name, username, email });
  } catch (error) {
    console.error('Error saving profile to Firestore:', error);
    throw error;
  }
}

export async function getUserProfile(uid) {
  const docRef = doc(db, 'profiles', uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
}
