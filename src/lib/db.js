import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const db = postgres(process.env.DATABASE_URL, {
  ssl: process.env.NODE_ENV === 'production'
});

export default db;
