import db from '$lib/db'; // Import your db connection
import bcrypt from 'bcrypt'; // For hashing passwords

export async function POST({ request }) {
  const { email, password } = await request.json();

  // Check if user already exists
  const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);

  if (existingUser) {
    return new Response(JSON.stringify({ error: 'User already exists' }), { status: 400 });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Insert the new user into the database
  await db.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, hashedPassword]);

  return new Response(JSON.stringify({ message: 'Registration successful!' }), { status: 201 });
}
