const Razorpay = require('razorpay');
const crypto = require('crypto');
const { createPaymentRecord, verifyPayment } = require('../models/paymentModel');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

const createOrder = async (amount, currency = 'INR') => {
  const options = { amount: amount * 100, currency, receipt: `receipt_${Date.now()}` };
  return await razorpay.orders.create(options);
};

const verifyPaymentSignature = async (orderId, paymentId, signature) => {
  const generatedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  if (generatedSignature !== signature) throw new Error('Payment verification failed');

  return await verifyPayment(orderId, { payment_id: paymentId, signature, status: 'Success' });
};

module.exports = { createOrder, verifyPaymentSignature };
