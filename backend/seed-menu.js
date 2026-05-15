import pool from './db.js';

async function seedMenu() {
  const restaurantId = '023af7e4-46a4-43d1-9a91-2261233f0e09';

  try {
    console.log('Seeding menu for desaleng hotel...');

    // 1. Create Categories
    const categories = [
      { name: 'Appetizers', description: 'Small bites to start your meal' },
      { name: 'Main Courses', description: 'Hearty and delicious meals' },
      { name: 'Drinks', description: 'Hot and cold beverages' },
      { name: 'Desserts', description: 'Sweet treats' }
    ];

    const categoryIds = [];
    for (const cat of categories) {
      const res = await pool.query(
        'INSERT INTO categories (restaurant_id, name, description) VALUES ($1, $2, $3) RETURNING id',
        [restaurantId, cat.name, cat.description]
      );
      categoryIds.push({ name: cat.name, id: res.rows[0].id });
    }

    console.log(`Created ${categoryIds.length} categories.`);

    // 2. Create Menu Items
    const items = [
      { category: 'Appetizers', name: 'Spring Rolls', price: 8.50, description: 'Vegetable spring rolls with sweet chili sauce' },
      { category: 'Appetizers', name: 'Garlic Bread', price: 6.00, description: 'Toasted baguette with garlic butter' },
      { category: 'Main Courses', name: 'Beef Burger', price: 15.00, description: 'Juicy beef patty with cheese and fries' },
      { category: 'Main Courses', name: 'Pasta Carbonara', price: 14.50, description: 'Creamy pasta with bacon and parmesan' },
      { category: 'Main Courses', name: 'Grilled Salmon', price: 18.00, description: 'Fresh salmon with steamed vegetables' },
      { category: 'Drinks', name: 'Fresh Orange Juice', price: 4.50, description: 'Freshly squeezed oranges' },
      { category: 'Drinks', name: 'Cappuccino', price: 5.00, description: 'Italian style coffee with milk' },
      { category: 'Desserts', name: 'Chocolate Lava Cake', price: 9.00, description: 'Warm cake with melting chocolate center' }
    ];

    for (const item of items) {
      const categoryId = categoryIds.find(c => c.name === item.category).id;
      await pool.query(
        'INSERT INTO menu_items (restaurant_id, category_id, name, price, description) VALUES ($1, $2, $3, $4, $5)',
        [restaurantId, categoryId, item.name, item.price, item.description]
      );
    }

    console.log(`Created ${items.length} menu items.`);
    console.log('Menu seeding successful!');

  } catch (err) {
    console.error('Seeding failed:', err.message);
  } finally {
    await pool.end();
  }
}

seedMenu();
