import db from '$lib/db/db.js'; // Ensure this path is correct

export async function GET() {
  try {
    // Example query to check the database connection
    const result = await db`SELECT NOW()`;

    // Return the current time from the database
    return new Response(JSON.stringify({ time: result }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Database error:', error); // Log any error that occurs
    return new Response(JSON.stringify({ error: 'Database connection failed' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
