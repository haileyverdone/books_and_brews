import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import app from '$lib/firebaseConfig';
import pkg from 'pg';

const { Client } = pkg; // Import the PostgreSQL client from the CommonJS module

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

    // Connect to PostgreSQL and insert the user data
    await client.connect();
    const insertQuery = `
      INSERT INTO profiles (firebase_uid, name, username, email) 
      VALUES ($1, $2, $3, $4)
    `;
    await client.query(insertQuery, [firebaseUID, name, username, email]);
    await client.end();

    // Return success response
    return new Response(
      JSON.stringify({ message: 'Registration successful' }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error registering user:', error);

    // Close the client if an error occurs
    await client.end();

    // Return error response
    return new Response(
      JSON.stringify({ error: 'Failed to register user' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
