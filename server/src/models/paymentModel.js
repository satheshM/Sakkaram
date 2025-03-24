const supabase = require('../config/db');

const createPaymentRecord = async (paymentData) => {
  return await supabase.from('payments').insert([paymentData]).select().single();
};

const verifyPayment = async (orderId, paymentDetails) => {
  return await supabase.from('payments').update(paymentDetails).eq('order_id', orderId).select().single();
};

module.exports = { createPaymentRecord, verifyPayment };
