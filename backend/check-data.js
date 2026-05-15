import pool from './db.js';

async function checkData() {
  try {
    const restaurants = await pool.query('SELECT * FROM restaurants');
    console.log('--- Restaurants ---');
    console.log(`Count: ${restaurants.rowCount}`);
    console.table(restaurants.rows);

    const users = await pool.query('SELECT id, name, email, role FROM users');
    console.log('--- Users ---');
    console.log(`Count: ${users.rowCount}`);
    console.table(users.rows);

  } catch (err) {
    console.error('Error checking data:', err.message);
  } finally {
    await pool.end();
  }
}

checkData();
