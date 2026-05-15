import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Get staff attendance for a restaurant
router.get('/attendance/:restaurantId', async (req, res) => {
  const { restaurantId } = req.params;
  try {
    const result = await pool.query(
      `SELECT sa.*, u.name as user_name 
       FROM staff_attendance sa 
       JOIN users u ON sa.user_id = u.id 
       WHERE sa.restaurant_id = $1 
       ORDER BY sa.clock_in DESC`,
      [restaurantId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Clock in
router.post('/clock-in', async (req, res) => {
  const { user_id, restaurant_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO staff_attendance (user_id, restaurant_id) VALUES ($1, $2) RETURNING *',
      [user_id, restaurant_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Clock out
router.post('/clock-out', async (req, res) => {
  const { user_id, restaurant_id } = req.body;
  try {
    const result = await pool.query(
      'UPDATE staff_attendance SET clock_out = CURRENT_TIMESTAMP WHERE user_id = $1 AND restaurant_id = $2 AND clock_out IS NULL RETURNING *',
      [user_id, restaurant_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No active session found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
