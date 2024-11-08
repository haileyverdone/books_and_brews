import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import app from '$lib/firebaseConfig';

const auth = getAuth(app);

export async function POST({ request }) {
  const { email, password } = await request.json();

  try {
    // Sign in the user with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Generate an ID token for the signed-in user
    const token = await user.getIdToken();

    // Return the response with user details and token
    return new Response(
      JSON.stringify({
        uid: user.uid,
        email: user.email,
        message: 'Login successful',
        token: token
      }), 
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Login error:', error);

    // Return error response
    return new Response(
      JSON.stringify({ error: 'Invalid email or password' }), 
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
