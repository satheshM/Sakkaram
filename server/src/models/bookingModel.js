const supabase = require('../config/db');

const createBooking = async (bookingData) => {
  return await supabase.from('bookings').insert([bookingData]).select().single();
};

const getBookingsByUser = async (userId) => {
  return await supabase.from('bookings').select('*').eq('user_id', userId);
};

const getBookingsByOwner = async (ownerId) => {
  return await supabase.from('bookings').select('*').eq('owner_id', ownerId);
};

const updateBookingStatus = async (id, status) => {
  return await supabase.from('bookings').update({ status }).eq('id', id).select().single();
};

const submitReview = async (id, reviewData) => {
  return await supabase.from('bookings').update(reviewData).eq('id', id).select().single();
};

const deleteBooking = async (id) => {
  return await supabase.from('bookings').delete().eq('id', id);
};

module.exports = { createBooking, getBookingsByUser, getBookingsByOwner, updateBookingStatus, submitReview, deleteBooking };
