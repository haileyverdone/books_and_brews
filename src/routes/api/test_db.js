import sql from '$lib/db';

// A simple function to test the database connection
export async function testConnection() {
  try {
    const result = await sql`SELECT NOW()`;
    console.log('Database connected successfully:', result);
    return result;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}

// Call the test connection function if you want to test it
testConnection();

