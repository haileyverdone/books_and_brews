import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import app from '$lib/firebaseConfig';

const auth = getAuth(app);

export async function POST({ request }) {
  const { email, password } = await request.json();

  try {
    // Sign in the user with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Generate a token on successful login
    const token = await user.getIdToken();

    // Send token and user info back to client
    return new Response(
      JSON.stringify({ token, uid: user.uid, message: 'Login successful' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({ error: 'Invalid email or password' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
