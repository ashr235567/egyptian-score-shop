const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get wishlist
// @route   GET /api/users/wishlist
// @access  Private
exports.getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate('wishlist');
  res.status(200).json({ success: true, wishlist: user.wishlist });
});

// @desc    Add product to wishlist
// @route   POST /api/users/wishlist/:productId
// @access  Private
exports.addToWishlist = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.productId);
  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  const user = await User.findById(req.user.id);
  if (!user.wishlist.includes(product._id)) {
    user.wishlist.push(product._id);
    await user.save();
  }

  res.status(200).json({ success: true, wishlist: user.wishlist });
});

// @desc    Remove product from wishlist
// @route   DELETE /api/users/wishlist/:productId
// @access  Private
exports.removeFromWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  user.wishlist = user.wishlist.filter((id) => id.toString() !== req.params.productId);
  await user.save();
  res.status(200).json({ success: true, wishlist: user.wishlist });
});

// @desc    Add address
// @route   POST /api/users/addresses
// @access  Private
exports.addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (req.body.isDefault) {
    user.addresses.forEach((a) => (a.isDefault = false));
  }
  if (user.addresses.length === 0) req.body.isDefault = true;

  user.addresses.push(req.body);
  await user.save();
  res.status(201).json({ success: true, addresses: user.addresses });
});

// @desc    Update address
// @route   PUT /api/users/addresses/:addressId
// @access  Private
exports.updateAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const address = user.addresses.id(req.params.addressId);
  if (!address) {
    return next(new ErrorResponse('Address not found', 404));
  }

  if (req.body.isDefault) {
    user.addresses.forEach((a) => (a.isDefault = false));
  }

  Object.assign(address, req.body);
  await user.save();
  res.status(200).json({ success: true, addresses: user.addresses });
});

// @desc    Delete address
// @route   DELETE /api/users/addresses/:addressId
// @access  Private
exports.deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  user.addresses = user.addresses.filter((a) => a._id.toString() !== req.params.addressId);
  await user.save();
  res.status(200).json({ success: true, addresses: user.addresses });
});

// ----- ADMIN -----

// @desc    Get all customers (admin)
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search, role } = req.query;
  const query = {};
  if (role) query.role = role;
  if (search) {
    query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
  }

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, parseInt(limit));

  const [users, total] = await Promise.all([
    User.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    User.countDocuments(query)
  ]);

  res.status(200).json({ success: true, count: users.length, total, page: pageNum, pages: Math.ceil(total / limitNum), users });
});

// @desc    Get single user (admin)
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }
  res.status(200).json({ success: true, user });
});

// @desc    Update user active status / role (admin)
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const { isActive, role } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }
  if (isActive !== undefined) user.isActive = isActive;
  if (role !== undefined) user.role = role;
  await user.save();
  res.status(200).json({ success: true, user });
});

// @desc    Delete user (admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }
  await user.deleteOne();
  res.status(200).json({ success: true, message: 'User deleted successfully' });
});
