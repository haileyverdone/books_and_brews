import { adminFirestore , adminAuth } from '$lib/firebaseAdmin'; 
import admin from 'firebase-admin';

export async function POST({ request }) {
    try{
      const body  = await request.json();
      const { name, username, email} = body;

      if (!name || !username || !email) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const userRecord = await adminAuth.getUserByEmail(email);
      const uid = userRecord.uid;

        await adminFirestore.collection('users').doc(uid).set({
          name,
          username,
          email,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        
    return new Response(
      JSON.stringify({ message: 'Registration successful. Please verify your email!' }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error registering user:', error);
    let clientMessage = 'Failed to register user.';
    if (error.code === 'auth/email-already-in-use') {
      clientMessage = 'This email is already registered. Please log in.';
    } else if (error.code === 'auth/invalid-email') {
      clientMessage = 'Invalid email address. Please check and try again.';
    } else if (
      error.message &&
      error.message.includes('Password must contain an upper case character')
    ) {
      clientMessage = 'Password must contain at least one uppercase character';
    }
  
    return new Response(
      JSON.stringify({ error: clientMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
