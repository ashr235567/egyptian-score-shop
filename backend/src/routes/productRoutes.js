const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
  getProducts,
  getProduct,
  getFilters,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
  deleteReview,
  getRelatedProducts
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');

router.get('/', getProducts);
router.get('/meta/filters', getFilters);
router.get('/:identifier', getProduct);
router.get('/:id/related', getRelatedProducts);

router.post(
  '/',
  protect,
  authorize('admin'),
  [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('brand').trim().notEmpty().withMessage('Brand is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('coverImage').notEmpty().withMessage('Cover image is required')
  ],
  validateRequest,
  createProduct
);

router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

router.post(
  '/:id/reviews',
  protect,
  [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').trim().notEmpty().withMessage('Comment is required').isLength({ max: 1000 })
  ],
  validateRequest,
  addReview
);
router.delete('/:id/reviews/:reviewId', protect, deleteReview);

module.exports = router;
