const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all products with filter, search, sort, pagination
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res) => {
  const {
    keyword,
    brand,
    category,
    size,
    minPrice,
    maxPrice,
    sort,
    page = 1,
    limit = 12,
    featured,
    bestSeller,
    newArrival,
    onSale
  } = req.query;

  const query = { isActive: true };

  if (keyword) {
    query.$text = { $search: keyword };
  }
  if (brand) {
    query.brand = { $in: brand.split(',') };
  }
  if (category) {
    query.category = { $in: category.split(',') };
  }
  if (size) {
    query['variants.sizes.size'] = { $in: size.split(',') };
  }
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (featured === 'true') query.isFeatured = true;
  if (bestSeller === 'true') query.isBestSeller = true;
  if (newArrival === 'true') query.isNewArrival = true;
  if (onSale === 'true') query.isOnSale = true;

  let sortOption = { createdAt: -1 };
  switch (sort) {
    case 'price_asc':
      sortOption = { price: 1 };
      break;
    case 'price_desc':
      sortOption = { price: -1 };
      break;
    case 'rating':
      sortOption = { rating: -1 };
      break;
    case 'best_selling':
      sortOption = { sold: -1 };
      break;
    case 'newest':
      sortOption = { createdAt: -1 };
      break;
    case 'name_asc':
      sortOption = { name: 1 };
      break;
  }

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, parseInt(limit));
  const skip = (pageNum - 1) * limitNum;

  const [products, total] = await Promise.all([
    Product.find(query).sort(sortOption).skip(skip).limit(limitNum),
    Product.countDocuments(query)
  ]);

  res.status(200).json({
    success: true,
    count: products.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    products
  });
});

// @desc    Get single product by slug or id
// @route   GET /api/products/:identifier
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const { identifier } = req.params;
  const isObjectId = identifier.match(/^[0-9a-fA-F]{24}$/);

  const product = await Product.findOne(isObjectId ? { _id: identifier } : { slug: identifier }).populate(
    'reviews.user',
    'name avatar'
  );

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  res.status(200).json({ success: true, product });
});

// @desc    Get available filters (brands, categories, sizes, price range)
// @route   GET /api/products/meta/filters
// @access  Public
exports.getFilters = asyncHandler(async (req, res) => {
  const brands = await Product.distinct('brand', { isActive: true });
  const categories = await Product.distinct('category', { isActive: true });
  const sizes = await Product.distinct('variants.sizes.size', { isActive: true });
  const priceStats = await Product.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: null, min: { $min: '$price' }, max: { $max: '$price' } } }
  ]);

  res.status(200).json({
    success: true,
    brands: brands.sort(),
    categories: categories.sort(),
    sizes: sizes.sort((a, b) => Number(a) - Number(b)),
    priceRange: priceStats[0] ? { min: priceStats[0].min, max: priceStats[0].max } : { min: 0, max: 0 }
  });
});

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  Object.assign(product, req.body);
  await product.save();

  res.status(200).json({ success: true, product });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }
  await product.deleteOne();
  res.status(200).json({ success: true, message: 'Product deleted successfully' });
});

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private
exports.addReview = asyncHandler(async (req, res, next) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user.id.toString());
  if (alreadyReviewed) {
    return next(new ErrorResponse('You have already reviewed this product', 400));
  }

  product.reviews.push({
    user: req.user.id,
    name: req.user.name,
    rating: Number(rating),
    comment
  });

  product.recalculateRating();
  await product.save();

  res.status(201).json({ success: true, message: 'Review added successfully', product });
});

// @desc    Delete a review (admin or owner)
// @route   DELETE /api/products/:id/reviews/:reviewId
// @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  const review = product.reviews.id(req.params.reviewId);
  if (!review) {
    return next(new ErrorResponse('Review not found', 404));
  }

  if (review.user.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to delete this review', 403));
  }

  review.deleteOne();
  product.recalculateRating();
  await product.save();

  res.status(200).json({ success: true, message: 'Review deleted successfully' });
});

// @desc    Get related products (same brand or category)
// @route   GET /api/products/:id/related
// @access  Public
exports.getRelatedProducts = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  const related = await Product.find({
    _id: { $ne: product._id },
    isActive: true,
    $or: [{ brand: product.brand }, { category: product.category }]
  }).limit(8);

  res.status(200).json({ success: true, products: related });
});
