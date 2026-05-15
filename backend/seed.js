import bcrypt from 'bcryptjs';
import pool from './db.js';
import dotenv from 'dotenv';

dotenv.config();

const adminEmail = process.env.SEED_ADMIN_EMAIL || 'manager@restaurant.com';
const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'password';
const adminName = process.env.SEED_ADMIN_NAME || 'Restaurant Manager';
const adminRole = process.env.SEED_ADMIN_ROLE || 'manager';

async function seedAdminUser() {
  try {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [adminEmail]);
    if (existing.rows.length > 0) {
      console.log(`Admin user already exists: ${adminEmail}`);
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
      [adminName, adminEmail, hashedPassword, adminRole]
    );
    console.log(`Created admin user: ${adminEmail}`);
  } catch (error) {
    console.error('Failed to seed admin user:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seedAdminUser();
