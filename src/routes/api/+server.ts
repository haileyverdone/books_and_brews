import sql from '$lib/db';

// Define the return type for the response if needed (optional)
export async function GET(): Promise<Response> {
  try {
    // Example query to test the connection
    const result = await sql`SELECT NOW()`;

    // Return the current time from the database
    return new Response(JSON.stringify({ time: result }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    // Return an error response in case of failure
    return new Response(JSON.stringify({ error: 'Database connection failed' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
