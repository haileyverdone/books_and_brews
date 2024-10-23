import bcrypt from 'bcryptjs';
import db from '$lib/db';

export async function POST({ request }) {
  const { username, password } = await request.json();

  const hashedPassword = await bcrypt.hash(password, 10);
  await db.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);

  return new Response(JSON.stringify({ success: true }), { status: 201 });
}
