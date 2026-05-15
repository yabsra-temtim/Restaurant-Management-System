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
import authRouter from './routes/auth.js';
import paymentsRouter from './routes/payments.js';
import inventoryRouter from './routes/inventory.js';
import staffRouter from './routes/staff.js';
import analyticsRouter from './routes/analytics.js';

dotenv.config();

const app = express();
const PORT = 5001;

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
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/restaurants', restaurantsRouter);
app.use('/api/tables', tablesRouter);
app.use('/api/menus', menusRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/reservations', reservationsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/staff', staffRouter);
app.use('/api/analytics', analyticsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
