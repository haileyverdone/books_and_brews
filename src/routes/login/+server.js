import db from '$lib/db'; // Import your db connection

export async function POST({ request }) {
  const { email, password } = await request.json();

  // Perform your database query to check if user exists and validate password
  // Assuming you have a function to handle this
  const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);

  if (user) {
    return new Response(JSON.stringify({ message: 'Login successful!' }), { status: 200 });
  } else {
    return new Response(JSON.stringify({ error: 'Invalid email or password' }), { status: 401 });
  }
}
