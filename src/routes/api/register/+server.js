import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import app from '$lib/firebaseConfig';
import { firestoreAdmin } from '$lib/firebaseAdmin';

const auth = getAuth(app);

export async function POST({ request }) {
  const { name, username, email, password } = await request.json();

  try {
    // Register user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUID = userCredential.user.uid;

    // Save user data to Firestore using Firebase Admin
    await firestoreAdmin.collection('users').doc(firebaseUID).set({
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
