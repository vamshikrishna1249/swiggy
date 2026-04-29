const express = require('express');
const router = express.Router();
const {
  getRestaurants,
  getRestaurantById,
  getRestaurantMenu,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getAllRestaurantsAdmin,
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require('../controllers/restaurantController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Public
router.get('/', getRestaurants);
router.get('/:id', getRestaurantById);
router.get('/:id/menu', getRestaurantMenu);

// Admin
router.get('/admin/all', authMiddleware, adminMiddleware, getAllRestaurantsAdmin);
router.post('/', authMiddleware, adminMiddleware, createRestaurant);
router.put('/:id', authMiddleware, adminMiddleware, updateRestaurant);
router.delete('/:id', authMiddleware, adminMiddleware, deleteRestaurant);

// Menu Items (admin)
router.get('/admin/menu-items', authMiddleware, adminMiddleware, getMenuItems);
router.post('/admin/menu-items', authMiddleware, adminMiddleware, createMenuItem);
router.put('/admin/menu-items/:id', authMiddleware, adminMiddleware, updateMenuItem);
router.delete('/admin/menu-items/:id', authMiddleware, adminMiddleware, deleteMenuItem);

module.exports = router;
