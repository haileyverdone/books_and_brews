import { adminAuth } from '$lib/firebaseAdmin'; 

export async function POST({ request }) {
  try {
    const { email } = await request.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const userRecord = await adminAuth.getUserByEmail(email);
    if (!userRecord.emailVerified) {
      return new Response(
        JSON.stringify({ error: 'Email not verified. Please check your inbox for the verification link.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const token = await adminAuth.createCustomToken(userRecord.uid);

    // Send token and user info back to client
    return new Response(
      JSON.stringify({ token, uid: userRecord.uid, message: 'Login successful' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Login error:', error);

    let errorMessage = 'An error occurred. Please try again.';
    if (error.code === 'auth/invalid-email') errorMessage = 'Invalid email address.';
    if (error.code === 'auth/user-not-found') errorMessage = 'No user found with this email.';
    if (error.code === 'auth/wrong-password') errorMessage = 'Incorrect password.';

    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
