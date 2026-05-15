import bcrypt from 'bcryptjs';
import pool from './db.js';

async function testLogin() {
  const email = 'manager@restaurant.com';
  const password = 'password';

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      console.log('User not found');
      return;
    }

    console.log('User found:', user.email);
    console.log('Stored hash:', user.password);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Is password valid?', isPasswordValid);

  } catch (err) {
    console.error('Error testing login:', err.message);
  } finally {
    await pool.end();
  }
}

testLogin();
