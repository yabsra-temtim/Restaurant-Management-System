import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const { id, name, role, restaurant_id } = user;
    
    // Sign JWT token
    const token = jwt.sign(
      { id, email, role, restaurant_id },
      process.env.JWT_SECRET || 'your_secret_key_here',
      { expiresIn: '24h' }
    );

    res.json({ 
      user: { id, name, email, role, restaurant_id },
      token 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Restaurant-specific login (secondary authentication)
router.post('/restaurant-login', async (req, res) => {
  const { restaurantId, email, password } = req.body;

  if (!restaurantId || !email || !password) {
    return res.status(400).json({ error: 'Missing credentials' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify restaurant access: User must be a global manager OR belong to this restaurant
    if (user.role !== 'manager' && user.restaurant_id !== restaurantId) {
      return res.status(403).json({ error: 'Access denied for this restaurant' });
    }

    // Automatic Clock In
    const activeSession = await pool.query(
      'SELECT * FROM staff_attendance WHERE user_id = $1 AND restaurant_id = $2 AND clock_out IS NULL',
      [user.id, restaurantId]
    );

    if (activeSession.rows.length === 0) {
      await pool.query(
        'INSERT INTO staff_attendance (user_id, restaurant_id) VALUES ($1, $2)',
        [user.id, restaurantId]
      );
    }

    res.json({ success: true, message: 'Restaurant access granted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
