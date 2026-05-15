import pool from './db.js';

async function migrate() {
  try {
    console.log('Adding restaurant_id to users table...');
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS restaurant_id UUID;');
    console.log('Migration successful!');
  } catch (err) {
    console.error('Migration failed:', err.message);
  } finally {
    await pool.end();
  }
}

migrate();
