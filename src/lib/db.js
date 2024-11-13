import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  connectionString: process.env.PGCONNECT, 
});

export default client;
