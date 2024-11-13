import { doc, setDoc } from 'firebase/firestore';
import { db } from '$lib/firebaseConfig'; // Ensure db is correctly initialized in firebaseConfig

async function saveUserDataToFirestore(uid, name, username, email) {
  try {
    await setDoc(doc(db, 'users', uid), { name, username, email });
    console.log('User data saved to Firestore successfully');
  } catch (error) {
    console.error('Error saving user data to Firestore:', error);
  }
}
