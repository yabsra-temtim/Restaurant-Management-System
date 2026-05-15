import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Get sales summary
router.get('/sales-summary/:restaurantId', async (req, res) => {
  const { restaurantId } = req.params;
  try {
    const result = await pool.query(
      `SELECT 
        COUNT(id) as total_orders,
        SUM(total_amount) as total_revenue,
        AVG(total_amount) as average_order_value
       FROM orders 
       WHERE restaurant_id = $1 AND status = 'completed'`,
      [restaurantId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get best selling items
router.get('/best-sellers/:restaurantId', async (req, res) => {
  const { restaurantId } = req.params;
  try {
    const result = await pool.query(
      `SELECT 
        mi.name, 
        SUM(oi.quantity) as total_sold,
        SUM(oi.quantity * oi.unit_price) as total_revenue
       FROM order_items oi
       JOIN menu_items mi ON oi.menu_item_id = mi.id
       JOIN orders o ON oi.order_id = o.id
       WHERE o.restaurant_id = $1 AND o.status = 'completed'
       GROUP BY mi.id, mi.name
       ORDER BY total_sold DESC
       LIMIT 5`,
      [restaurantId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get daily sales for the last 7 days
router.get('/daily-sales/:restaurantId', async (req, res) => {
  const { restaurantId } = req.params;
  try {
    const result = await pool.query(
      `SELECT 
        DATE(created_at) as date,
        SUM(total_amount) as revenue
       FROM orders
       WHERE restaurant_id = $1 AND status = 'completed' AND created_at >= CURRENT_DATE - INTERVAL '7 days'
       GROUP BY DATE(created_at)
       ORDER BY DATE(created_at) ASC`,
      [restaurantId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
