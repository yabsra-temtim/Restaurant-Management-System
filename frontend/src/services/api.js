import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Users
export const userService = {
  login: (data) => api.post('/auth/login', data),
  restaurantLogin: (data) => api.post('/auth/restaurant-login', data),
  getAll: () => api.get('/users'),
  getByRestaurant: (restaurantId) => api.get(`/users/restaurant/${restaurantId}`),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

// Restaurants
export const restaurantService = {
  getAll: () => api.get('/restaurants'),
  getById: (id) => api.get(`/restaurants/${id}`),
  create: (data) => api.post('/restaurants', data),
  update: (id, data) => api.put(`/restaurants/${id}`, data),
  delete: (id) => api.delete(`/restaurants/${id}`),
};

// Tables
export const tableService = {
  getByRestaurant: (restaurantId) => api.get(`/tables/restaurant/${restaurantId}`),
  getById: (id) => api.get(`/tables/${id}`),
  create: (data) => api.post('/tables', data),
  updateStatus: (id, status) => api.put(`/tables/${id}`, { status }),
  delete: (id) => api.delete(`/tables/${id}`),
};

// Menus
export const menuService = {
  getCategories: (restaurantId) => api.get(`/menus/categories/${restaurantId}`),
  getItems: (restaurantId) => api.get(`/menus/items/${restaurantId}`),
  getItemsByCategory: (categoryId) => api.get(`/menus/category/${categoryId}/items`),
  createCategory: (data) => api.post('/menus/categories', data),
  createItem: (data) => api.post('/menus/items', data),
  updateItem: (id, data) => api.put(`/menus/items/${id}`, data),
  deleteItem: (id) => api.delete(`/menus/items/${id}`),
};

// Orders
export const orderService = {
  getByRestaurant: (restaurantId) => api.get(`/orders/restaurant/${restaurantId}`),
  getActiveByRestaurant: (restaurantId) => api.get(`/orders/restaurant/${restaurantId}/active`),
  getBillingByRestaurant: (restaurantId) => api.get(`/orders/restaurant/${restaurantId}/billing`),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
  updateStatus: (id, status) => api.put(`/orders/${id}`, { status }),
  updateItemStatus: (orderItemId, status) => api.put(`/orders/items/${orderItemId}/status`, { status }),
  delete: (id) => api.delete(`/orders/${id}`),
};

// Reservations
export const reservationService = {
  getByRestaurant: (restaurantId) => api.get(`/reservations/restaurant/${restaurantId}`),
  getById: (id) => api.get(`/reservations/${id}`),
  create: (data) => api.post('/reservations', data),
  update: (id, data) => api.put(`/reservations/${id}`, data),
  delete: (id) => api.delete(`/reservations/${id}`),
};

// Payments
export const paymentService = {
  create: (data) => api.post('/payments', data),
  getByRestaurant: (restaurantId) => api.get(`/payments/restaurant/${restaurantId}`),
};

// Inventory
export const inventoryService = {
  getByRestaurant: (restaurantId) => api.get(`/inventory/restaurant/${restaurantId}`),
  update: (id, data) => api.put(`/inventory/${id}`, data),
  create: (data) => api.post('/inventory', data),
};

// Analytics
export const analyticsService = {
  getSalesSummary: (restaurantId) => api.get(`/analytics/sales-summary/${restaurantId}`),
  getBestSellers: (restaurantId) => api.get(`/analytics/best-sellers/${restaurantId}`),
  getDailySales: (restaurantId) => api.get(`/analytics/daily-sales/${restaurantId}`),
};

export default api;
