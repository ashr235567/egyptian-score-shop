const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrder,
  trackOrder,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');

router.get('/track/:orderNumber', trackOrder);

router.post(
  '/',
  optionalAuth,
  [
    body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
    body('shippingAddress.fullName').trim().notEmpty().withMessage('Full name is required'),
    body('shippingAddress.phone').trim().notEmpty().withMessage('Phone number is required'),
    body('shippingAddress.governorate').trim().notEmpty().withMessage('Governorate is required'),
    body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
    body('shippingAddress.street').trim().notEmpty().withMessage('Street is required')
  ],
  validateRequest,
  createOrder
);

router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrder);

router.get('/', protect, authorize('admin'), getAllOrders);
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);

module.exports = router;
