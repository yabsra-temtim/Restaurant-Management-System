import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle database client:', err.message);
  if (err.code === 'ENETUNREACH') {
    console.error('CRITICAL: Database host is unreachable. Please check your network connection or VPN.');
  } else if (err.code === 'ECONNREFUSED') {
    console.error('CRITICAL: Database connection refused. Is the database server running?');
  }
});

export default pool;
