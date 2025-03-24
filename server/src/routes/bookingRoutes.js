const express = require('express');
const { check } = require('express-validator');
const {
  createBooking,
  getUserBookings,
  getOwnerBookings,
  updateBookingStatus,
  submitReview,
  cancelBooking,
} = require('../controllers/bookingController');
const authenticateToken = require('../middlewares/authMiddleware');
const validateInput = require('../middlewares/validateMiddleware');

const router = express.Router();

router.post(
  '/',
  authenticateToken,
  validateInput([
    check('vehicleId').notEmpty().withMessage('Vehicle ID is required'),
    check('bookingDate').notEmpty().withMessage('Booking date is required'),
    check('duration').isNumeric().withMessage('Duration must be a number'),
    check('totalPrice').isNumeric().withMessage('Total price must be a number'),
  ]),
  createBooking
);

router.get('/user', authenticateToken, getUserBookings);
router.get('/owner', authenticateToken, getOwnerBookings);
router.patch('/status', authenticateToken, updateBookingStatus);
router.patch('/review', authenticateToken, submitReview);
router.delete('/:id', authenticateToken, cancelBooking);

module.exports = router;
