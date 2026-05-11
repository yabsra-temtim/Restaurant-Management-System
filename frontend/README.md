# Restaurant Management System - Frontend

A modern React.js application for managing restaurant operations.

## Features

- User Authentication
- Restaurant Dashboard
- Table Management
- Menu Management  
- Order Management
- Reservation System
- Real-time Updates
- Responsive Design

## Tech Stack

- **React 18** - UI Framework
- **Vite** - Build Tool
- **React Router v6** - Navigation
- **Tailwind CSS** - Styling
- **Axios** - HTTP Client
- **Lucide React** - Icons

## Setup

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build

```bash
npm run build
```

## Project Structure

```
src/
├── components/        # Reusable components
├── pages/            # Page components
├── context/          # React Context (Auth)
├── services/         # API service calls
├── App.jsx           # Main app component
├── main.jsx          # Entry point
└── index.css         # Global styles
```

## Pages

- **LoginPage** - User authentication
- **DashboardPage** - Restaurant selection and overview
- **TablesPage** - Table management
- **MenuPage** - Menu and items management
- **OrdersPage** - Order tracking and management

## API Integration

The app communicates with the backend API at `/api` which proxies to `http://localhost:5000` in development.

## Environment

The app is configured to proxy API requests to the backend server. Update `vite.config.js` if you need to change the backend URL.
