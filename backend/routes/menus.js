import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Get all menu categories for a restaurant
router.get('/categories/:restaurantId', async (req, res) => {
  const { restaurantId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM categories WHERE restaurant_id = $1 ORDER BY name',
      [restaurantId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get all menu items for a restaurant
router.get('/items/:restaurantId', async (req, res) => {
  const { restaurantId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM menu_items WHERE restaurant_id = $1 ORDER BY name',
      [restaurantId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get menu items by category
router.get('/category/:categoryId/items', async (req, res) => {
  const { categoryId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM menu_items WHERE category_id = $1 AND available = true ORDER BY name',
      [categoryId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Create category
router.post('/categories', async (req, res) => {
  const { restaurant_id, name, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO categories (restaurant_id, name, description) VALUES ($1, $2, $3) RETURNING *',
      [restaurant_id, name, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Create menu item
router.post('/items', async (req, res) => {
  const { restaurant_id, category_id, name, description, price, image_url } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO menu_items (restaurant_id, category_id, name, description, price, image_url, available) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [restaurant_id, category_id, name, description, price, image_url, true]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Update menu item
router.put('/items/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price, available, image_url } = req.body;
  try {
    const result = await pool.query(
      'UPDATE menu_items SET name = COALESCE($1, name), description = COALESCE($2, description), price = COALESCE($3, price), available = COALESCE($4, available), image_url = COALESCE($5, image_url), updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
      [name, description, price, available, image_url, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Delete menu item
router.delete('/items/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM menu_items WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json({ message: 'Menu item deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
