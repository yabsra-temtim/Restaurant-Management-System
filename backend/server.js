import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';
import ordersRouter from './routes/orders.js';
import menusRouter from './routes/menus.js';
import tablesRouter from './routes/tables.js';
import reservationsRouter from './routes/reservations.js';
import usersRouter from './routes/users.js';
import restaurantsRouter from './routes/restaurants.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'ok', timestamp: result.rows[0].now });
  } catch (err) {
    console.error('Health check failed:', err);
    res.status(500).json({ status: 'error', message: 'Database connection failed' });
  }
});

// Routes
app.use('/api/users', usersRouter);
app.use('/api/restaurants', restaurantsRouter);
app.use('/api/tables', tablesRouter);
app.use('/api/menus', menusRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/reservations', reservationsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
