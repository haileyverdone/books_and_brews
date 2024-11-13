import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import app from '$lib/firebaseConfig';
import { doc, setDoc, getFirestore } from 'firebase/firestore';

const auth = getAuth(app);
const db = getFirestore(app);

async function saveUserDataToFirestore(uid, name, username, email) {
  try {
    await setDoc(doc(db, 'users', uid), { name, username, email });
    console.log('User data saved to Firestore successfully');
  } catch (error) {
    console.error('Error saving user data to Firestore:', error);
    throw error; // Rethrow error to catch it in the main POST handler if needed
  }
}

export async function POST({ request }) {
  try {
    const { name, username, email, password } = await request.json();
    console.log('Received registration data:', { name, username, email });

    // Register the user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUID = userCredential.user.uid;
    console.log('User registered in Firebase Auth with UID:', firebaseUID);

    // Save user data to Firestore
    await saveUserDataToFirestore(firebaseUID, name, username, email);

    // Return a success response
    return new Response(
      JSON.stringify({ message: 'Registration successful' }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error during user registration or Firestore save:', error);

    const errorMessage = error.code === 'auth/email-already-in-use'
      ? 'Email is already in use'
      : 'Failed to register user';

    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
