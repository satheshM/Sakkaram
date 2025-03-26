const express = require('express');
const authenticateToken = require('../middlewares/authMiddleware');
const { createOrder, verifyPayment } = require('../controllers/paymentController');

const router = express.Router();

router.post('/create-order', authenticateToken, createOrder);
router.post('/verify-payment', authenticateToken, verifyPayment);

module.exports = router;
