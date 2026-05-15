import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { NewRestaurantPage } from './pages/NewRestaurantPage';
import { TablesPage } from './pages/TablesPage';
import { KitchenPage } from './pages/KitchenPage';
import { POSPage } from './pages/POSPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { StaffPage } from './pages/StaffPage';
import { InventoryPage } from './pages/InventoryPage';
import { RestaurantHub } from './pages/RestaurantHub';
import { MenuPage } from './pages/MenuPage';
import { OrdersPage } from './pages/OrdersPage';
import './index.css';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/restaurant/new"
          element={
            <PrivateRoute>
              <NewRestaurantPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/restaurant/:restaurantId"
          element={
            <PrivateRoute>
              <RestaurantHub />
            </PrivateRoute>
          }
        />
        <Route
          path="/restaurant/:restaurantId/inventory"
          element={
            <PrivateRoute>
              <InventoryPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/restaurant/:restaurantId/staff"
          element={
            <PrivateRoute>
              <StaffPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/restaurant/:restaurantId/analytics"
          element={
            <PrivateRoute>
              <AnalyticsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/restaurant/:restaurantId/tables"
          element={
            <PrivateRoute>
              <TablesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/restaurant/:restaurantId/kitchen"
          element={
            <PrivateRoute>
              <KitchenPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/restaurant/:restaurantId/pos"
          element={
            <PrivateRoute>
              <POSPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/restaurant/:restaurantId/menu"
          element={
            <PrivateRoute>
              <MenuPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/restaurant/:restaurantId/orders"
          element={
            <PrivateRoute>
              <OrdersPage />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
