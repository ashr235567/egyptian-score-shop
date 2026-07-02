const asyncHandler = require('express-async-handler');
const Coupon = require('../models/Coupon');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Validate a coupon code against an order subtotal (public, used at checkout)
// @route   POST /api/coupons/validate
// @access  Private
exports.validateCoupon = asyncHandler(async (req, res, next) => {
  const { code, subtotal } = req.body;

  const coupon = await Coupon.findOne({ code: code.toUpperCase() });
  if (!coupon || !coupon.isValidNow()) {
    return next(new ErrorResponse('Coupon is invalid or expired', 400));
  }
  if (subtotal < coupon.minOrderValue) {
    return next(new ErrorResponse(`Minimum order value for this coupon is ${coupon.minOrderValue} EGP`, 400));
  }

  if (req.user) {
    const userUsage = coupon.usedBy.find((u) => u.user.toString() === req.user.id.toString());
    if (userUsage && userUsage.count >= coupon.perUserLimit) {
      return next(new ErrorResponse('You have already used this coupon the maximum number of times', 400));
    }
  }

  let discountAmount = coupon.discountType === 'percentage' ? (subtotal * coupon.discountValue) / 100 : coupon.discountValue;
  if (coupon.maxDiscountAmount) discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
  discountAmount = Math.min(discountAmount, subtotal);

  res.status(200).json({
    success: true,
    coupon: { code: coupon.code, discountType: coupon.discountType, discountValue: coupon.discountValue },
    discountAmount
  });
});

// ----- ADMIN -----

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
exports.getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: coupons.length, coupons });
});

// @desc    Create coupon
// @route   POST /api/coupons
// @access  Private/Admin
exports.createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json({ success: true, coupon });
});

// @desc    Update coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
exports.updateCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    return next(new ErrorResponse('Coupon not found', 404));
  }
  Object.assign(coupon, req.body);
  await coupon.save();
  res.status(200).json({ success: true, coupon });
});

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
exports.deleteCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    return next(new ErrorResponse('Coupon not found', 404));
  }
  await coupon.deleteOne();
  res.status(200).json({ success: true, message: 'Coupon deleted successfully' });
});
