import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import app from '$lib/firebaseConfig';

const auth = getAuth(app);

export async function POST({ request }) {
  const { email, password } = await request.json();

  try {
    // Attempt to sign in the user
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Generate an ID token for the user
    const token = await user.getIdToken();

    // Return a successful response with token and uid
    return new Response(
      JSON.stringify({ token, uid: user.uid, message: 'Login successful' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Login error:', error);

    // Return an error response if login fails
    return new Response(
      JSON.stringify({ error: 'Invalid email or password' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
