const { validationResult } = require('express-validator');
const {
  createBooking,
  getUserBookings,
  getOwnerBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
  updateBookingReview 
} = require('../models/bookingModel');

const addBooking = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    
    const newBooking = await createBooking({ farmer_id: req.user.id, ...req.body });
    res.status(201).json({ success: true, message: 'Booking created successfully', booking: newBooking });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const fetchUserBookings = async (req, res) => {
  try {
    const bookings = await getUserBookings(req.user.id);
    const categorizedBookings = {
      // upcoming: bookings.filter((b) => ['Pending', 'Ongoing', 'Confirmed'].includes(b.status)),
      upcoming: bookings.filter(
        (b) =>
          ['Pending', 'Ongoing','Confirmed'].includes(b.status) ||
          (b.status === 'Completed' && b.payment_status === 'Pending') // Include Confirmed only if payment is Pending
      ),
      // past: bookings.filter((b) => ['Completed', 'Cancelled', 'Rejected', 'Reviewed'].includes(b.status)),
      past: bookings.filter(
        (b) =>
          [ 'Cancelled', 'Rejected', 'Reviewed'].includes(b.status) ||
          (b.status === 'Completed' && b.payment_status !== 'Pending') // Move Confirmed to past if payment is not Pending
      )
    
    };
    res.json({ success: true, ...categorizedBookings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const fetchOwnerBookings = async (req, res) => {
  try {
    const bookings = await getOwnerBookings(req.user.id);
    const categorizedBookings = {
      bookingRequests: bookings.filter((b) => b.status === 'Pending'),
      activeBookings: bookings.filter((b) => ['Ongoing', 'Confirmed'].includes(b.status)),
      bookingHistory: bookings.filter((b) => ['Completed', 'Cancelled', 'Rejected', 'Reviewed'].includes(b.status)),
    };
    res.json({ success: true, ...categorizedBookings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const modifyBookingStatus = async (req, res) => {
  const { id, status, cancellationReason,totalPrice,total_hours } = req.body;
  try {
    console.log("totalPrice"+totalPrice+"total_hours"+total_hours)
    const booking = await getBookingById(id);
    if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });

    // ✅ Only the Owner or Farmer can modify the booking
    if (booking.owner_id !== req.user.id && booking.farmer_id !== req.user.id)
      return res.status(403).json({ success: false, error: 'Unauthorized' });

    const updatedBooking = await updateBookingStatus(id, status, cancellationReason,totalPrice,total_hours);
    res.json({ success: true, message: 'Booking status updated', booking: updatedBooking });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await getBookingById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });

    // ✅ Only the Farmer who booked it can cancel
    if (booking.farmer_id !== req.user.id) return res.status(403).json({ success: false, error: 'Unauthorized' });

    await deleteBooking(req.params.id);
    res.json({ success: true, message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


const submitReview = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  const { bookingId, rating, feedback, status } = req.body;
  const userId = req.user.id; // Get authenticated user ID

  try {
    // ✅ 1️⃣ Check if the booking exists
    const booking = await getBookingById(bookingId);
    if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });

    // ✅ 2️⃣ Ensure only the **farmer** who booked can submit a review
    if (booking.farmer_id !== userId) {
      return res.status(403).json({ success: false, error: 'Unauthorized to submit review' });
    }

    // ✅ 3️⃣ Update the booking with the review
    const updatedBooking = await updateBookingReview(bookingId, rating, feedback, status);

    res.json({ success: true, message: 'Successfully reviewed', booking: updatedBooking });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { addBooking, fetchUserBookings, fetchOwnerBookings, modifyBookingStatus, cancelBooking,submitReview };

