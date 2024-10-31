import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import app from '$lib/firebaseConfig';

const auth = getAuth(app);

export async function POST({ request }) {
  const { email, password } = await request.json();

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    return {
      status: 200,
      body: { uid: user.uid, email: user.email, message: 'Login successful' }
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      status: 401,
      body: { error: 'Invalid email or password' }
    };
  }
}
