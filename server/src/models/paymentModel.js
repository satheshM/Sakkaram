const supabase = require('../config/db');

const createPaymentRecord = async (payment) => {
  const { error } = await supabase.from('payments').insert([payment]);
  if (error) throw new Error(error.message);
};

// const updatePaymentStatus = async (orderId, updates) => {
//   const { error,data } = await supabase
//     .from('payments')
//     .update(updates)
//     .eq('order_id', orderId);
//   if (error) throw new Error(error.message);
//   else{

//     const { error } = await supabase
//     .from('bookings')
//     .update(payment_status ='Completed')
//     .eq('id', data.booking_id);

//   }
// };

const updatePaymentStatus = async (orderId, updates) => {
  // Step 1: Update the payments table
  const { error: paymentError } = await supabase
    .from('payments')
    .update(updates)
    .eq('order_id', orderId)
    .select('booking_id') // Fetch booking_id
    .single();

  if (paymentError) throw new Error(paymentError.message);

  // Step 2: If payment is successful, update the bookings table
  if (updates.status === 'Success') {
    const { error: bookingError } = await supabase
      .from('bookings')
      .update({ payment_status: 'Completed' }) // Correct syntax
      .eq('id', updates.booking_id);

    if (bookingError) throw new Error(bookingError.message);
  }
};


module.exports = { createPaymentRecord, updatePaymentStatus };
