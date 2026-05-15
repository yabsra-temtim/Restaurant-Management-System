import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [activeRestaurantId, setActiveRestaurantId] = useState(sessionStorage.getItem('activeRestaurantId'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user and token are stored in localStorage
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Failed to parse stored user:', err);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    setActiveRestaurantId(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('activeRestaurantId');
  };

  const setRestaurantSession = (id) => {
    setActiveRestaurantId(id);
    sessionStorage.setItem('activeRestaurantId', id);
  };

  const clearRestaurantSession = () => {
    setActiveRestaurantId(null);
    sessionStorage.removeItem('activeRestaurantId');
  };

  const value = {
    user,
    role: user?.role,
    restaurantId: user?.restaurant_id,
    activeRestaurantId,
    loading,
    login,
    logout,
    setRestaurantSession,
    clearRestaurantSession,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
