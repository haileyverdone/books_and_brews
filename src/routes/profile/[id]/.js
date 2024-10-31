// src/routes/api/profile/[id].js (server-side API route)
import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  connectionString: process.env.PGCONNECT,
});

export async function GET({ params }) {
  await client.connect();
  try {
    const res = await client.query('SELECT * FROM profiles WHERE firebase_uid = $1', [params.id]);
    await client.end();

    if (res.rows.length === 0) {
      return {
        status: 404,
        body: { error: 'Profile not found' },
      };
    } else {
      return {
        status: 200,
        body: { profile: res.rows[0] },
      };
    }
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      body: { error: 'Server error fetching profile data' },
    };
  }
}
