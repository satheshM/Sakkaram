const supabase = require('../config/db');

// const createBooking = async (booking) => {
//   const { data, error } = await supabase
//     .from('bookings')
//     .insert([booking])
//     .select()
//     .single();

//   if (error) throw new Error(error.message);
//   return data;
// };
const createBooking = async (booking) => {
  // ✅ Step 1: Fetch the owner ID using vehicleId
  const { data: vehicle, error: vehicleError } = await supabase
    .from("vehicles")
    .select("owner_id")
    .eq("id", booking.vehicleId)
    .single();

  if (vehicleError || !vehicle) {
    throw new Error("Invalid vehicleId. Vehicle not found.");
  }

  // ✅ Step 2: Insert the booking with ownerId
  const { data, error } = await supabase
    .from("bookings")
    .insert([{ ...booking, owner_id: vehicle.owner_id }]) // Adding owner_id
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};
const getUserBookings = async (userId) => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('farmer_id', userId);

  if (error) throw new Error(error.message);
  return data;
};

const getOwnerBookings = async (ownerId) => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('owner_id', ownerId);

  if (error) throw new Error(error.message);
  return data;
};

const getBookingById = async (bookingId) => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .single();

  if (error) return null;
  return data;
};

const updateBookingStatus = async (bookingId, status, cancellationReason = null) => {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status, cancellation_reason: cancellationReason })
    .eq('id', bookingId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

const deleteBooking = async (bookingId) => {
  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', bookingId);

  if (error) throw new Error(error.message);
  return { message: 'Booking deleted successfully' };
};

const updateBookingReview = async (id, rating, feedback, status) => {
  const { data, error } = await supabase
    .from('bookings')
    .update({ rating, feedback, status })
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};

module.exports = { createBooking, getUserBookings, getOwnerBookings, getBookingById, updateBookingStatus, deleteBooking, updateBookingReview };
