# Restaurant Management System

A modern, full-stack restaurant management system built with React.js and PostgreSQL.

## Project Structure

```
restaurant-management-system/
├── backend/          # Node.js/Express API
│   ├── routes/       # API endpoints
│   ├── server.js     # Express server
│   ├── db.js         # Database connection
│   ├── schema.sql    # Database schema
│   └── package.json
├── frontend/         # React.js application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── App.jsx
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

## Quick Start

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Set up PostgreSQL database
# Update .env with your database URL

# Initialize database schema
psql -U postgres -f schema.sql

# Start the server
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on `http://localhost:3000`

## Features

### Core Features
- 🍽️ Restaurant Management
- 📊 Order Management
- 🗂️ Menu & Category Management
- 🪑 Table Management
- 📋 Reservations System
- 💰 Payment Processing
- 📦 Inventory Tracking
- 👥 Staff Management

### Technical Features
- Real-time order updates
- Role-based access control
- Responsive design
- Modern UI with Tailwind CSS
- RESTful API
- PostgreSQL database

## Database Schema

The system includes comprehensive database tables for:
- Users (staff)
- Restaurants
- Tables
- Menu Categories & Items
- Orders & Order Items
- Reservations
- Payments
- Inventory

## API Endpoints

### Key Endpoints
- `/api/restaurants` - Restaurant management
- `/api/tables` - Table management
- `/api/menus` - Menu management
- `/api/orders` - Order management
- `/api/reservations` - Reservation management
- `/api/users` - User management

## Technology Stack

### Backend
- Node.js
- Express.js
- PostgreSQL
- UUID for primary keys
- CORS enabled

### Frontend
- React 18
- Vite
- React Router v6
- Tailwind CSS
- Axios
- Lucide React Icons

## Getting Started

1. Clone the repository
2. Set up PostgreSQL database
3. Configure environment variables
4. Install dependencies for both backend and frontend
5. Start the backend server
6. Start the frontend development server
7. Access the application at `http://localhost:3000`

## Login

Default user email format: `user@restaurant.com`
Use any password for demo purposes (authentication is simplified).

## Contributing

Feel free to contribute to this project by submitting pull requests or reporting issues.

## License

MIT License - feel free to use this project for your own purposes.
