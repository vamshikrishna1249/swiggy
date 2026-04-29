const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  getAdminStats,
} = require('../controllers/orderController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.post('/', authMiddleware, placeOrder);
router.get('/user', authMiddleware, getUserOrders);
router.get('/admin/all', authMiddleware, adminMiddleware, getAllOrders);
router.get('/admin/stats', authMiddleware, adminMiddleware, getAdminStats);
router.get('/:id', authMiddleware, getOrderById);
router.put('/:id/status', authMiddleware, adminMiddleware, updateOrderStatus);

module.exports = router;
