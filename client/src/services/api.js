import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 8000, // 8s — Render free tier can be slow; fake data kicks in on timeout
});


// Attach auth token from localStorage if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sb-token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.error || err.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

// ─── Restaurant APIs ───────────────────────────────
export const fetchRestaurants = (params = {}) =>
  api.get('/restaurants', { params }).then((r) => r.data);

export const fetchRestaurantById = (id) =>
  api.get(`/restaurants/${id}`).then((r) => r.data);

export const fetchRestaurantMenu = (id) =>
  api.get(`/restaurants/${id}/menu`).then((r) => r.data);

// ─── Order APIs ────────────────────────────────────
export const placeOrder = (data) =>
  api.post('/orders', data).then((r) => r.data);

export const fetchUserOrders = () =>
  api.get('/orders/user').then((r) => r.data);

export const fetchOrderById = (id) =>
  api.get(`/orders/${id}`).then((r) => r.data);

// ─── Coupon APIs ───────────────────────────────────
export const validateCoupon = (code, orderTotal) =>
  api.get(`/coupons/${code}`, { params: { orderTotal } }).then((r) => r.data);

// ─── Admin APIs ────────────────────────────────────
export const fetchAdminStats = () =>
  api.get('/orders/admin/stats').then((r) => r.data);

export const fetchAllOrders = () =>
  api.get('/orders/admin/all').then((r) => r.data);

export const updateOrderStatus = (id, status) =>
  api.put(`/orders/${id}/status`, { status }).then((r) => r.data);

export const fetchAllRestaurantsAdmin = () =>
  api.get('/restaurants/admin/all').then((r) => r.data);

export const createRestaurant = (data) =>
  api.post('/restaurants', data).then((r) => r.data);

export const updateRestaurant = (id, data) =>
  api.put(`/restaurants/${id}`, data).then((r) => r.data);

export const deleteRestaurant = (id) =>
  api.delete(`/restaurants/${id}`).then((r) => r.data);

export const fetchAdminMenuItems = (restaurantId) =>
  api.get('/restaurants/admin/menu-items', { params: { restaurantId } }).then((r) => r.data);

export const createMenuItem = (data) =>
  api.post('/restaurants/admin/menu-items', data).then((r) => r.data);

export const updateMenuItem = (id, data) =>
  api.put(`/restaurants/admin/menu-items/${id}`, data).then((r) => r.data);

export const deleteMenuItem = (id) =>
  api.delete(`/restaurants/admin/menu-items/${id}`).then((r) => r.data);

export default api;
