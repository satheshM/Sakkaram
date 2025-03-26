// const Razorpay = require('razorpay');
// const crypto = require('crypto');
// const { createPaymentRecord, updatePaymentStatus } = require('../models/paymentModel');

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_SECRET,
// });

// const createOrder = async (bookingId, amount, currency, userId) => {
//   const options = {
//     amount: amount * 100, // Convert to paise
//     currency: currency || 'INR',
//     receipt: `receipt_${Date.now()}`,
//   };

//   const order = await razorpay.orders.create(options);

//   await createPaymentRecord({
//     order_id: order.id,
//     amount,
//     currency,
//     status: 'Pending',
//     booking_id: bookingId,
//     user_id: userId,
//   });

//   return order;
// };

// const verifyPayment = async (orderId, paymentId, signature, userId) => {
//   const generated_signature = crypto
//     .createHmac('sha256', process.env.RAZORPAY_SECRET)
//     .update(`${orderId}|${paymentId}`)
//     .digest('hex');

//   if (generated_signature !== signature) throw new Error('Payment verification failed');

//   await updatePaymentStatus(orderId, {
//     payment_id: paymentId,
//     signature,
//     status: 'Success',
//   });

//   return { success: true, message: 'Payment verified successfully' };
// };

// module.exports = { createOrder, verifyPayment };
