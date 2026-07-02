const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 60 }),
    body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').optional().trim()
  ],
  validateRequest,
  register
);

router.post(
  '/login',
  [body('email').isEmail().withMessage('Please provide a valid email'), body('password').notEmpty().withMessage('Password is required')],
  validateRequest,
  login
);

router.post('/logout', logout);
router.get('/me', protect, getMe);
router.put('/update-details', protect, updateDetails);
router.put(
  '/update-password',
  protect,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
  ],
  validateRequest,
  updatePassword
);
router.post('/forgot-password', [body('email').isEmail()], validateRequest, forgotPassword);
router.put(
  '/reset-password/:resettoken',
  [body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')],
  validateRequest,
  resetPassword
);

module.exports = router;
