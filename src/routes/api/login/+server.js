import { login } from '../../../lib/auth.js';

export async function POST({ request }) {
  const { email, password } = await request.json();

  try {
    // Sign in the user with Firebase Auth through the `login` function
    const userCredential = await login(email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      throw new Error('Email not verified. Please check your inbox for the verification email.');
    }

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
      JSON.stringify({ error: error.message || 'Invalid email or password' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
