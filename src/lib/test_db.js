import db from './db.js'; // Adjust the path as necessary

export async function getCurrentTime() {
  const result = await db`SELECT NOW()`;
  return result;
}
