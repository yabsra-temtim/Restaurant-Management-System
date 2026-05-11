import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Get all restaurants
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM restaurants ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get restaurant by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM restaurants WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Create new restaurant
router.post('/', async (req, res) => {
  const { name, address, phone, email, owner_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO restaurants (name, address, phone, email, owner_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, address, phone, email, owner_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Update restaurant
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, address, phone, email } = req.body;
  try {
    const result = await pool.query(
      'UPDATE restaurants SET name = COALESCE($1, name), address = COALESCE($2, address), phone = COALESCE($3, phone), email = COALESCE($4, email), updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
      [name, address, phone, email, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Delete restaurant
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM restaurants WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.json({ message: 'Restaurant deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
