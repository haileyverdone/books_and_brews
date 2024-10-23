import db from '$lib/db';
import { Auth } from '$lib/auth';

export async function GET({ request }) {
  const token = request.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const auth = new Auth();
  const decoded = auth.verifyToken(token);

  const user = await db.query('SELECT * FROM users WHERE id = $1', [decoded.userId]);

  return new Response(JSON.stringify(user), { status: 200 });
}
