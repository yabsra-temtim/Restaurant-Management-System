import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Get inventory for a restaurant
router.get('/restaurant/:restaurantId', async (req, res) => {
  const { restaurantId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM inventory WHERE restaurant_id = $1 ORDER BY item_name ASC',
      [restaurantId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Update inventory item
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { current_stock, low_stock_threshold } = req.body;
  try {
    const result = await pool.query(
      'UPDATE inventory SET current_stock = $1, low_stock_threshold = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [current_stock, low_stock_threshold, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Add new inventory item
router.post('/', async (req, res) => {
  const { restaurant_id, item_name, unit, current_stock, low_stock_threshold } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO inventory (restaurant_id, item_name, unit, current_stock, low_stock_threshold) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [restaurant_id, item_name, unit, current_stock, low_stock_threshold]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
