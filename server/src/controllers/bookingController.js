const supabase = require('../config/db');
const logger = require('../config/logger');

const createBooking = async (req, res) => {
  try {
    const { vehicleId, bookingDate, duration, totalPrice } = req.body;
    const userId = req.user.id;

    const { data, error } = await supabase.from('bookings').insert([
      {
        vehicle_id: vehicleId,
        user_id: userId,
        booking_date: bookingDate,
        duration,
        total_price: totalPrice,
        status: 'Pending',
      },
    ]).select().single();

    if (error) throw error;

    res.status(201).json({ message: 'Booking created successfully', booking: data });
  } catch (err) {
    logger.error(`Error creating booking: ${err.message}`);
    res.status(500).json({ message: 'Failed to create booking' });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { data, error } = await supabase.from('bookings').select('*').eq('user_id', userId);

    if (error) throw error;

    res.json({ upcoming: data.filter(b => ['Pending', 'Confirmed', 'Ongoing'].includes(b.status)), past: data.filter(b => ['Completed', 'Cancelled'].includes(b.status)) });
  } catch (err) {
    logger.error(`Error fetching user bookings: ${err.message}`);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
};

const getOwnerBookings = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { data, error } = await supabase.from('bookings').select('*').eq('owner_id', ownerId);

    if (error) throw error;

    res.json({
      bookingRequests: data.filter(b => b.status === 'Pending'),
      activeBookings: data.filter(b => ['Confirmed', 'Ongoing'].includes(b.status)),
      bookingHistory: data.filter(b => ['Completed', 'Cancelled'].includes(b.status)),
    });
  } catch (err) {
    logger.error(`Error fetching owner bookings: ${err.message}`);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    const userId = req.user.id;

    const { data: booking, error: fetchError } = await supabase.from('bookings').select('id, owner_id, user_id').eq('id', id).single();
    if (fetchError || !booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.owner_id !== userId && booking.user_id !== userId) return res.status(403).json({ message: 'Unauthorized' });

    const { data, error } = await supabase.from('bookings').update({ status }).eq('id', id).select().single();
    if (error) throw error;

    res.json({ message: 'Booking status updated', booking: data });
  } catch (err) {
    logger.error(`Error updating booking: ${err.message}`);
    res.status(500).json({ message: 'Failed to update booking' });
  }
};

const submitReview = async (req, res) => {
  try {
    const { bookingId, rating, feedback } = req.body;
    const userId = req.user.id;

    const { data: booking, error: fetchError } = await supabase.from('bookings').select('user_id').eq('id', bookingId).single();
    if (fetchError || !booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.user_id !== userId) return res.status(403).json({ message: 'Unauthorized' });

    const { data, error } = await supabase.from('bookings').update({ rating, feedback, status: 'Reviewed' }).eq('id', bookingId).select().single();
    if (error) throw error;

    res.json({ message: 'Review submitted successfully', booking: data });
  } catch (err) {
    logger.error(`Error submitting review: ${err.message}`);
    res.status(500).json({ message: 'Failed to submit review' });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { data: booking, error: fetchError } = await supabase.from('bookings').select('user_id').eq('id', id).single();
    if (fetchError || !booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.user_id !== userId) return res.status(403).json({ message: 'Unauthorized' });

    const { error } = await supabase.from('bookings').delete().eq('id', id);
    if (error) throw error;

    res.json({ message: 'Booking cancelled successfully' });
  } catch (err) {
    logger.error(`Error cancelling booking: ${err.message}`);
    res.status(500).json({ message: 'Failed to cancel booking' });
  }
};

module.exports = { createBooking, getUserBookings, getOwnerBookings, updateBookingStatus, submitReview, cancelBooking };
