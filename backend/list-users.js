import pool from './db.js';

async function listUsers() {
  try {
    const res = await pool.query('SELECT name, email, role, restaurant_id FROM users');
    console.table(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

listUsers();
