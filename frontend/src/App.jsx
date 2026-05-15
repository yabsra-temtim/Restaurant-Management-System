import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
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
import { CashierPage } from './pages/CashierPage';
import { RestaurantLoginPage } from './pages/RestaurantLoginPage';
import './index.css';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-pulse text-primary-500 font-bold">Verifying Session...</div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const RestaurantRoute = ({ children }) => {
  const { user, loading, activeRestaurantId } = useAuth();
  const { restaurantId } = useParams();

  if (loading) return <div className="p-8 text-center">Verifying Access...</div>;

  // Basic access check: user role or assigned restaurant
  const hasAccess = 
    user?.role === 'manager' || 
    user?.restaurant_id === restaurantId;

  if (!hasAccess) {
    return <Navigate to="/dashboard" />;
  }

  // Secondary check: Has the user "unlocked" this specific restaurant in the current session?
  if (activeRestaurantId !== restaurantId) {
    return <Navigate to={`/restaurant/${restaurantId}/login`} />;
  }

  return children;
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
              <RestaurantRoute>
                <RestaurantHub />
              </RestaurantRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/restaurant/:restaurantId/login"
          element={
            <PrivateRoute>
              <RestaurantLoginPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/restaurant/:restaurantId/inventory"
          element={
            <PrivateRoute>
              <RestaurantRoute>
                <InventoryPage />
              </RestaurantRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/restaurant/:restaurantId/staff"
          element={
            <PrivateRoute>
              <RestaurantRoute>
                <StaffPage />
              </RestaurantRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/restaurant/:restaurantId/analytics"
          element={
            <PrivateRoute>
              <RestaurantRoute>
                <AnalyticsPage />
              </RestaurantRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/restaurant/:restaurantId/tables"
          element={
            <PrivateRoute>
              <RestaurantRoute>
                <TablesPage />
              </RestaurantRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/restaurant/:restaurantId/kitchen"
          element={
            <PrivateRoute>
              <RestaurantRoute>
                <KitchenPage />
              </RestaurantRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/restaurant/:restaurantId/pos"
          element={
            <PrivateRoute>
              <RestaurantRoute>
                <POSPage />
              </RestaurantRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/restaurant/:restaurantId/pos/:tableId"
          element={
            <PrivateRoute>
              <RestaurantRoute>
                <POSPage />
              </RestaurantRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/restaurant/:restaurantId/menu"
          element={
            <PrivateRoute>
              <RestaurantRoute>
                <MenuPage />
              </RestaurantRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/restaurant/:restaurantId/orders"
          element={
            <PrivateRoute>
              <RestaurantRoute>
                <OrdersPage />
              </RestaurantRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/restaurant/:restaurantId/cashier"
          element={
            <PrivateRoute>
              <RestaurantRoute>
                <CashierPage />
              </RestaurantRoute>
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
