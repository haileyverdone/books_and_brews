import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import app from '$lib/firebaseConfig';

const auth = getAuth(app);
const db = getFirestore(app);

export async function POST({ request }) {
  const { name, username, email, password } = await request.json();

  try {
    // Register user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUID = userCredential.user.uid;

    // Store user data in Firestore under 'users' collection
    await setDoc(doc(db, 'users', firebaseUID), {
      name,
      username,
      email,
      createdAt: new Date()
    });

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
