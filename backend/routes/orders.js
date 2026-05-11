import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Get all orders for a restaurant
router.get('/restaurant/:restaurantId', async (req, res) => {
  const { restaurantId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM orders WHERE restaurant_id = $1 ORDER BY created_at DESC',
      [restaurantId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get order by ID with items
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const orderResult = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const itemsResult = await pool.query(
      'SELECT oi.*, mi.name as menu_item_name FROM order_items oi JOIN menu_items mi ON oi.menu_item_id = mi.id WHERE oi.order_id = $1',
      [id]
    );

    res.json({
      ...orderResult.rows[0],
      items: itemsResult.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Create new order
router.post('/', async (req, res) => {
  const { restaurant_id, table_id, created_by, items } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Create order
    const orderResult = await client.query(
      'INSERT INTO orders (restaurant_id, table_id, status, created_by) VALUES ($1, $2, $3, $4) RETURNING *',
      [restaurant_id, table_id, 'pending', created_by]
    );

    const orderId = orderResult.rows[0].id;
    let total = 0;

    // Add order items
    for (const item of items) {
      const menuItemResult = await client.query(
        'SELECT price FROM menu_items WHERE id = $1',
        [item.menu_item_id]
      );

      if (menuItemResult.rows.length === 0) {
        throw new Error(`Menu item ${item.menu_item_id} not found`);
      }

      const price = menuItemResult.rows[0].price;
      const itemTotal = price * item.quantity;
      total += itemTotal;

      await client.query(
        'INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, special_instructions, status) VALUES ($1, $2, $3, $4, $5, $6)',
        [orderId, item.menu_item_id, item.quantity, price, item.special_instructions || null, 'pending']
      );
    }

    // Update order total
    await client.query(
      'UPDATE orders SET total_amount = $1 WHERE id = $2',
      [total, orderId]
    );

    // Update table status
    await client.query(
      'UPDATE tables SET status = $1 WHERE id = $2',
      ['occupied', table_id]
    );

    await client.query('COMMIT');

    const finalOrder = await pool.query('SELECT * FROM orders WHERE id = $1', [orderId]);
    res.status(201).json(finalOrder.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  } finally {
    client.release();
  }
});

// Update order status
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // If order is completed, free up the table
    if (status === 'completed') {
      await pool.query(
        'UPDATE tables SET status = $1 WHERE id = $2',
        ['available', result.rows[0].table_id]
      );
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Delete order
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM orders WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
