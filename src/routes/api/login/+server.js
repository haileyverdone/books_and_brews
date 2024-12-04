import { adminAuth } from '$lib/firebaseAdmin'; 

export async function POST({ request }) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password is required' }),
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
    console.log("Generated custom token:", token);

    return new Response(
      JSON.stringify({ token, uid: userRecord.uid, message: 'Login successful' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Login error:', error);
    const errorMessage = error.message || 'An error occurred. Please try again.';

    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
