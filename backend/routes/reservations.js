import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Get all reservations for a restaurant
router.get('/restaurant/:restaurantId', async (req, res) => {
  const { restaurantId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM reservations WHERE restaurant_id = $1 ORDER BY reservation_date DESC',
      [restaurantId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get reservation by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM reservations WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Create new reservation
router.post('/', async (req, res) => {
  const { restaurant_id, table_id, customer_name, customer_phone, reservation_date, party_size, special_requests } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO reservations (restaurant_id, table_id, customer_name, customer_phone, reservation_date, party_size, special_requests, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [restaurant_id, table_id, customer_name, customer_phone, reservation_date, party_size, special_requests, 'confirmed']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Update reservation
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { customer_name, customer_phone, reservation_date, party_size, special_requests, status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE reservations SET customer_name = COALESCE($1, customer_name), customer_phone = COALESCE($2, customer_phone), reservation_date = COALESCE($3, reservation_date), party_size = COALESCE($4, party_size), special_requests = COALESCE($5, special_requests), status = COALESCE($6, status), updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
      [customer_name, customer_phone, reservation_date, party_size, special_requests, status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Cancel reservation
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM reservations WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.json({ message: 'Reservation cancelled successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
