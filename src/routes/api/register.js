import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import app from '$lib/firebaseConfig';
import { Client } from 'pg'; // Using PostgreSQL 'pg' library

const auth = getAuth(app);

export async function POST({ request }) {
  const { name, username, email, password } = await request.json();

  // Initialize PostgreSQL client
  const client = new Client({
    connectionString: process.env.PGCONNECT,
  });

  try {
    // Register the user in Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUID = userCredential.user.uid;

    // Insert the user into the PostgreSQL database
    await client.connect();
    const insertQuery = `
      INSERT INTO profiles (firebase_uid, name, username, email) 
      VALUES ($1, $2, $3, $4)
    `;
    await client.query(insertQuery, [firebaseUID, name, username, email]);
    await client.end();

    // Return success response
    return {
      status: 201,
      body: { message: 'Registration successful' },
    };
  } catch (error) {
    console.error('Error registering user:', error);
    await client.end();
    return {
      status: 500,
      body: { error: 'Failed to register user' },
    };
  }
}