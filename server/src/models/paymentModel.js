const supabase = require('../config/db');

const createPaymentRecord = async (payment) => {
  const { error } = await supabase.from('payments').insert([payment]);
  if (error) throw new Error(error.message);
};

const updatePaymentStatus = async (orderId, updates) => {
  const { error } = await supabase
    .from('payments')
    .update(updates)
    .eq('order_id', orderId);
  if (error) throw new Error(error.message);
};

module.exports = { createPaymentRecord, updatePaymentStatus };
