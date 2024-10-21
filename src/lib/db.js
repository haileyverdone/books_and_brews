import postgres from 'postgres';

// Check if PGCONNECT is defined, or throw an error
const connectionString = process.env.PGCONNECT;
if (!connectionString) {
  throw new Error('PGCONNECT environment variable is not defined');
}

// Connect to PostgreSQL using the connection string
const sql = postgres(connectionString);

export default sql;
