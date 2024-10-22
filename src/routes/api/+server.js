import sql from '$lib/db'; // Import your database connection

// Define a function to handle login
export async function POST(request) {
  const { email, password } = await request.json();

  try {
    const result = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;

    if (result.length === 0) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
      });
    }

    const user = result[0];
    // Here, you would typically compare the password with a hashed version
    // If the password is valid, proceed with login
    return new Response(JSON.stringify({ user }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Database error' }), {
      status: 500,
    });
  }
}