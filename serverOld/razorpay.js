const Razorpay = require('razorpay');

// ✅ Initialize Razorpay
const razorpay = new Razorpay({
  key_id: 'rzp_test_b1A45GxApr12tC', // Replace with your test key
  key_secret: 'eX23SrTBzN95la1NNnJ5y5nt', // Replace with your secret key
});

const createOrder = async () => {
  try {
    const options = {
      amount: 50000, // ₹500 in paise
      currency: 'INR',
      receipt: 'order_rcptid_11',
    };

    const order = await razorpay.orders.create(options);
    console.log('✅ Order Created:', order);
  } catch (error) {
    console.error('❌ Error Creating Order:', error);
  }
};

// 🔥 Run the test
createOrder();
