const Razorpay = require('razorpay');
const crypto = require('crypto');
const supabase = require('../config/db');
const logger = require('../config/logger');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

const createOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR' } = req.body;
    const options = { amount: amount * 100, currency, receipt: `receipt_${Date.now()}` };
    const order = await razorpay.orders.create(options);

    res.json(order);
  } catch (err) {
    logger.error(`Error creating order: ${err.message}`);
    res.status(500).json({ message: 'Failed to create order' });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const generatedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");

    if (generatedSignature !== razorpay_signature) return res.status(400).json({ message: 'Payment verification failed' });

    res.json({ message: 'Payment verified successfully' });
  } catch (err) {
    logger.error(`Error verifying payment: ${err.message}`);
    res.status(500).json({ message: 'Failed to verify payment' });
  }
};

module.exports = { createOrder, verifyPayment };
