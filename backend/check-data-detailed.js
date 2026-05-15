import pool from './db.js';

async function checkData() {
  try {
    const restaurants = await pool.query('SELECT * FROM restaurants');
    console.log('--- Restaurants ---');
    console.table(restaurants.rows);

    if (restaurants.rows.length > 0) {
      const restaurantId = restaurants.rows[0].id;
      
      const tables = await pool.query('SELECT * FROM tables WHERE restaurant_id = $1', [restaurantId]);
      console.log(`--- Tables for ${restaurants.rows[0].name} ---`);
      console.log(`Count: ${tables.rowCount}`);
      console.table(tables.rows);

      const categories = await pool.query('SELECT * FROM categories WHERE restaurant_id = $1', [restaurantId]);
      console.log(`--- Categories for ${restaurants.rows[0].name} ---`);
      console.log(`Count: ${categories.rowCount}`);
      console.table(categories.rows);

      const items = await pool.query('SELECT * FROM menu_items WHERE restaurant_id = $1', [restaurantId]);
      console.log(`--- Menu Items for ${restaurants.rows[0].name} ---`);
      console.log(`Count: ${items.rowCount}`);
      console.table(items.rows);
    }

  } catch (err) {
    console.error('Error checking data:', err.message);
  } finally {
    await pool.end();
  }
}

checkData();
