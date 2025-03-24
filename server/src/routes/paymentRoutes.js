const express = require('express');
const { createOrder, verifyPayment } = require('../controllers/paymentController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/create-order', authenticateToken, createOrder);
router.post('/verify-payment', authenticateToken, verifyPayment);

module.exports = router;
