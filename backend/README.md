# Restaurant Management System - Backend

A Node.js/Express REST API for managing restaurant operations with PostgreSQL.

## Features

- User Management
- Restaurant Management
- Table Management
- Menu & Categories Management
- Order Management
- Reservation System
- Payment Processing
- Inventory Tracking

## Setup

### Prerequisites
- Node.js (v14+)
- PostgreSQL (v12+)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your PostgreSQL connection string and other settings.

4. Set up the database:
```bash
psql -U postgres -f schema.sql
```

5. Start the server:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Restaurants
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get restaurant by ID
- `POST /api/restaurants` - Create new restaurant
- `PUT /api/restaurants/:id` - Update restaurant
- `DELETE /api/restaurants/:id` - Delete restaurant

### Tables
- `GET /api/tables/restaurant/:restaurantId` - Get tables for restaurant
- `GET /api/tables/:id` - Get table by ID
- `POST /api/tables` - Create new table
- `PUT /api/tables/:id` - Update table status
- `DELETE /api/tables/:id` - Delete table

### Menus
- `GET /api/menus/categories/:restaurantId` - Get categories
- `GET /api/menus/items/:restaurantId` - Get menu items
- `POST /api/menus/categories` - Create category
- `POST /api/menus/items` - Create menu item
- `PUT /api/menus/items/:id` - Update menu item
- `DELETE /api/menus/items/:id` - Delete menu item

### Orders
- `GET /api/orders/restaurant/:restaurantId` - Get orders
- `GET /api/orders/:id` - Get order with items
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status
- `DELETE /api/orders/:id` - Delete order

### Reservations
- `GET /api/reservations/restaurant/:restaurantId` - Get reservations
- `GET /api/reservations/:id` - Get reservation
- `POST /api/reservations` - Create reservation
- `PUT /api/reservations/:id` - Update reservation
- `DELETE /api/reservations/:id` - Cancel reservation

## Database Schema

The system includes the following tables:
- `users` - Staff members
- `restaurants` - Restaurant information
- `tables` - Restaurant tables
- `categories` - Menu categories
- `menu_items` - Menu items
- `orders` - Customer orders
- `order_items` - Items in orders
- `reservations` - Table reservations
- `payments` - Payment records
- `inventory` - Inventory items
