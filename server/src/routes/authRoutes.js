const express = require('express');
const { check } = require('express-validator');
const { signup, login, refreshToken, logout } = require('../controllers/authController');
const validateInput = require('../middlewares/validateMiddleware');

const router = express.Router();

// 🔹 Signup Route
router.post(
  '/signup',
  validateInput([
    check('email').isEmail().withMessage('Invalid email format'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    check('role').notEmpty().withMessage('Role is required'),
  ]),
  signup
);

// 🔹 Login Route
router.post(
  '/login',
  validateInput([
    check('email').isEmail().withMessage('Invalid email format'),
    check('password').notEmpty().withMessage('Password is required'),
  ]),
  login
);

// 🔹 Refresh Token
router.get('/refresh-token', refreshToken);

// 🔹 Logout
router.post('/logout', logout);

module.exports = router;
