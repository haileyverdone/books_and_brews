// src/routes/api/test/+server.js
import { db } from '$lib/firebaseAdmin';

export async function GET() {
  try {
    const userDocRef = db.collection('users').doc('testUser');
    await userDocRef.set({
      name: 'Test User',
      email: 'testuser@example.com'
    });
    return new Response(JSON.stringify({ message: 'Firestore test user created successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating test user:', error);
    return new Response(JSON.stringify({ error: 'Failed to create test user' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
