const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
  validateCoupon,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon
} = require('../controllers/couponController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');

router.post(
  '/validate',
  optionalAuth,
  [body('code').trim().notEmpty().withMessage('Coupon code is required'), body('subtotal').isFloat({ min: 0 })],
  validateRequest,
  validateCoupon
);

router.get('/', protect, authorize('admin'), getCoupons);
router.post(
  '/',
  protect,
  authorize('admin'),
  [
    body('code').trim().notEmpty().withMessage('Coupon code is required'),
    body('discountType').isIn(['percentage', 'fixed']),
    body('discountValue').isFloat({ min: 0 }),
    body('expiresAt').notEmpty().withMessage('Expiry date is required')
  ],
  validateRequest,
  createCoupon
);
router.put('/:id', protect, authorize('admin'), updateCoupon);
router.delete('/:id', protect, authorize('admin'), deleteCoupon);

module.exports = router;
