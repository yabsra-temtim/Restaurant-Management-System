import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Process a payment for an order
router.post('/', async (req, res) => {
  const { order_id, amount, payment_method, transaction_id } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Create payment record
    const paymentResult = await client.query(
      'INSERT INTO payments (order_id, amount, payment_method, status, transaction_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [order_id, amount, payment_method, 'completed', transaction_id || null]
    );

    // Update order status to 'completed' (or 'partially_paid' if split billing)
    // For now, assume full payment
    await client.query(
      'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      ['completed', order_id]
    );

    // Get order details to free up the table
    const orderResult = await client.query('SELECT table_id FROM orders WHERE id = $1', [order_id]);
    const tableId = orderResult.rows[0].table_id;

    // Free up table
    await client.query(
      'UPDATE tables SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      ['available', tableId]
    );

    await client.query('COMMIT');
    res.status(201).json(paymentResult.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  } finally {
    client.release();
  }
});

// Get payments for a restaurant
router.get('/restaurant/:restaurantId', async (req, res) => {
  const { restaurantId } = req.params;
  try {
    const result = await pool.query(
      `SELECT p.*, o.total_amount as order_total 
       FROM payments p 
       JOIN orders o ON p.order_id = o.id 
       WHERE o.restaurant_id = $1 
       ORDER BY p.created_at DESC`,
      [restaurantId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
