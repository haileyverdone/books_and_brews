import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import app from '$lib/firebaseConfig';

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app);
const firestore = getFirestore(app);

export async function POST({ request }) {
  const { name, username, email, password } = await request.json();

  try {
    // Register user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUID = userCredential.user.uid;

    // Save user data to Firestore using Firestore Client SDK
    await setDoc(doc(firestore, 'users', firebaseUID), {
      name,
      username,
      email,
      createdAt: new Date()
    });

    // Return success response
    return new Response(
      JSON.stringify({ message: 'Registration successful' }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error registering user:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to register user' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
