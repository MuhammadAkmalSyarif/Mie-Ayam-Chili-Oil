const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/checkout', orderController.createOrder);
router.post('/midtrans-webhook', orderController.handleWebhook);

// Protected routes
router.get('/', authMiddleware, orderController.getAllOrders);
router.get('/:id', authMiddleware, orderController.getOrderById);
router.patch('/:id/status', authMiddleware, orderController.updateOrderStatus);
router.delete('/', authMiddleware, orderController.deleteAllOrders);

module.exports = router;

