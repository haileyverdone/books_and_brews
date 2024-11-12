import { getFirestore, doc, getDoc } from 'firebase/firestore';
import admin from 'firebase-admin';
import app from '$lib/firebaseConfig';

const db = getFirestore(app);

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIAL);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export async function GET({ params, request }) {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader && authHeader.split(' ')[1]; // Extract the token from the Authorization header

  if (!token) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized - Token missing' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Verify the token using Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Fetch the user profile from Firestore
    const userDoc = await getDoc(doc(db, 'users', params.id));

    if (userDoc.exists()) {
      return new Response(
        JSON.stringify({ profile: userDoc.data() }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({ error: 'Profile not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error fetching profile:', error);

    return new Response(
      JSON.stringify({ error: 'Server error fetching profile' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
