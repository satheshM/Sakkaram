const Razorpay = require('razorpay');
const crypto = require('crypto');
const { createPaymentRecord, updatePaymentStatus } = require('../models/paymentModel');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

const createOrder = async (req, res) => {
  try {
    const { bookingId, amount, currency = 'INR' } = req.body;
    const userId = req.user.id; // Authenticated user ID

    // ✅ 1️⃣ Create an order in Razorpay
    const options = {
      amount: amount * 100, // Convert to paise
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // ✅ 2️⃣ Store the order in the database
    await createPaymentRecord({
      order_id: order.id,
      amount,
      currency,
      status: 'Pending',
      booking_id: bookingId,
      user_id: userId,
    });

    // ✅ 3️⃣ Return order details
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create order' });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const userId = req.user.id; // Authenticated user ID

    // ✅ 1️⃣ Verify Razorpay signature
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ success: false, error: 'Payment verification failed' });
    }

    // ✅ 2️⃣ Update payment status in database
    await updatePaymentStatus(razorpay_order_id, {
      payment_id: razorpay_payment_id,
      signature: razorpay_signature,
      status: 'Success',
    });

    // ✅ 3️⃣ Send success response
    res.json({ success: true, message: 'Payment verified successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Payment verification failed'+error });
  }
};

module.exports = { createOrder, verifyPayment };
