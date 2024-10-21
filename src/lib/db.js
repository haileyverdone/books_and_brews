import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config(); 

const connectionString = process.env.PGCONNECT;
if (!connectionString) {
  throw new Error('PGCONNECT environment variable is not defined');
}

const db = postgres(connectionString);

export default db;