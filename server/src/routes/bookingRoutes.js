const express = require('express');
const { check } = require('express-validator');
const {
  addBooking,
  fetchUserBookings,
  fetchOwnerBookings,
  modifyBookingStatus, // ✅ Ensure this is imported
  cancelBooking,
  submitReview 
} = require('../controllers/bookingController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/farmer', authenticateToken, fetchUserBookings);
router.get('/owner', authenticateToken, fetchOwnerBookings);

router.post(
  '/',
  authenticateToken,
  [
    check('vehicleId').notEmpty().withMessage('Vehicle ID is required'),
    check('bookingDate').notEmpty().withMessage('Booking date is required'),
    check('duration').isNumeric().withMessage('Duration must be a number'),
  ],
  addBooking
);

router.patch('/status', authenticateToken, modifyBookingStatus); // ✅ FIXED
router.delete('/:id', authenticateToken, cancelBooking);

router.patch(
  '/submitReview',
  authenticateToken,
  [
    check('bookingId').notEmpty().withMessage('Booking ID is required'),
    check('rating').isNumeric().withMessage('Rating must be a number'),
    check('feedback').notEmpty().withMessage('Feedback is required'),
    check('status').notEmpty().withMessage('Status is required'),
  ],
  submitReview
);

module.exports = router;
