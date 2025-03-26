const express = require('express');
const { check } = require('express-validator');
const { verifyToken ,signup, login, refreshAccessToken, logout } = require('../controllers/authController');

const router = express.Router();

router.get('/verify-token', verifyToken);

router.post('/signup', [
  check('email').isEmail().withMessage('Invalid email format'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], signup);

router.post('/login', login);
router.get('/refresh-token', refreshAccessToken);
router.post('/logout', logout);

module.exports = router;
