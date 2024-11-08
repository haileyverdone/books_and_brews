import admin from 'firebase-admin';
import { Client } from 'pg';

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS); // Your Firebase Admin credentials
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

export async function GET({ params, request }) {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.split(' ')[1]; // Extract the token

  if (!token) {
    return { status: 401, body: { error: 'Unauthorized' } };
  }

  try {
    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Connect to PostgreSQL
    const client = new Client({ connectionString: process.env.PGCONNECT });
    await client.connect();
    
    // Example query
    const res = await client.query('SELECT * FROM profiles WHERE firebase_uid = $1', [decodedToken.uid]);
    await client.end();

    return { status: 200, body: res.rows[0] };
  } catch (error) {
    return { status: 500, body: { error: 'Server error' } };
  }
}
