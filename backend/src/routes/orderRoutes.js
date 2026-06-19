const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/checkout', orderController.createOrder);
router.post('/midtrans-webhook', orderController.handleWebhook);
router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.patch('/:id/status', orderController.updateOrderStatus);
router.delete('/', orderController.deleteAllOrders);

module.exports = router;
