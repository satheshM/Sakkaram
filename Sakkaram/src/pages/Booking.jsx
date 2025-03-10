import React, { useState, useEffect } from 'react';
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaTractor,
  FaRupeeSign,
  FaUser,
  FaPhone,
  FaCheckCircle,
  FaTimesCircle,
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { GetUserBookings,submitReview as postReview } from '../api/Bookings';

const Booking = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');

  // Sample booking data - in a real app, this would come from an API

  const [bookings, setBookings] = useState({ upcoming: [], past: [] });
  // const [bookings, setBookings] = useState({
  //   upcoming: [
  //     {
  //       id: 1,
  //       vehicleName: 'Mahindra 575 DI Tractor',
  //       vehicleType: 'Tractor',
  //       ownerName: 'Ramesh Kumar',
  //       ownerPhone: '+91 9876543210',
  //       date: '2025-03-15',
  //       time: '08:00 - 16:00',
  //       location: 'Coimbatore, Tamil Nadu',
  //       price: 4000,
  //       status: 'Confirmed',
  //       image:
  //         'https://5.imimg.com/data5/SELLER/Default/2021/12/QO/YC/XG/52189282/mahindra-575-di-tractor.jpg',
  //     },
  //     {
  //       id: 2,
  //       vehicleName: 'John Deere Harvester',
  //       vehicleType: 'Harvester',
  //       ownerName: 'Suresh Patel',
  //       ownerPhone: '+91 9876543211',
  //       date: '2025-03-20',
  //       time: '09:00 - 17:00',
  //       location: 'Salem, Tamil Nadu',
  //       price: 9600,
  //       status: 'Pending',
  //       image:
  //         'https://5.imimg.com/data5/SELLER/Default/2021/1/KO/FV/IY/3042719/john-deere-w70-self-propelled-combine-harvester-500x500.jpg',
  //     },
  //   ],
  //   past: [
  //     {
  //       id: 3,
  //       vehicleName: 'Swaraj 744 FE Tractor',
  //       vehicleType: 'Tractor',
  //       ownerName: 'Mahesh Singh',
  //       ownerPhone: '+91 9876543212',
  //       date: '2025-02-10',
  //       time: '07:00 - 15:00',
  //       location: 'Madurai, Tamil Nadu',
  //       price: 4400,
  //       status: 'Completed',
  //       rating: 5,
  //       feedback: 'Excellent tractor and very helpful owner. Will book again!',
  //       image:
  //         'https://5.imimg.com/data5/SELLER/Default/2022/9/SY/OM/QG/159745018/swaraj-744-fe-tractor-500x500.jpg',
  //     },
  //     {
  //       id: 4,
  //       vehicleName: 'Massey Ferguson Rotavator',
  //       vehicleType: 'Rotavator',
  //       ownerName: 'Ganesh Kumar',
  //       ownerPhone: '+91 9876543213',
  //       date: '2025-01-25',
  //       time: '08:00 - 12:00',
  //       location: 'Trichy, Tamil Nadu',
  //       price: 1400,
  //       status: 'Cancelled',
  //       cancellationReason: 'Heavy rainfall on the scheduled day',
  //       image:
  //         'https://5.imimg.com/data5/SELLER/Default/2022/1/SI/TP/NG/144593388/massey-ferguson-rotavator-500x500.jpg',
  //     },
  //   ],
  // });
  // Ensure correct structure and map API fields to frontend fields
  const transformBooking = (booking) => ({
    id: booking.id,
    vehicleName: booking.vehicleModel, // Mapping vehicleModel -> vehicleName
    vehicleType: booking.vehicleType,
    ownerName: booking.owner, // Mapping owner -> ownerName
    ownerPhone: booking.ownerPhone || '+91 0000000000', // Default phone if not present
    date: booking.bookingDate, // Mapping bookingDate -> date
    time: `Duration: ${booking.duration} hr(s)`, // Formatting time field
    location: booking.location,
    price: booking.totalPrice, // Mapping totalPrice -> price
    status: booking.status,
    image: booking.image, // Mapping image
    cancellationReason: booking.cancellationReason || '', // Optional field
    rating: booking.rating || null, // Optional field
    feedback: booking.feedback || '', // Optional field
  });
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await GetUserBookings();

        if (response.status === 200) {
          const myBookings = await response.json();

          setBookings({
            upcoming: myBookings.upcoming
              ? myBookings.upcoming.map(transformBooking)
              : [],
            past: myBookings.past ? myBookings.past.map(transformBooking) : [],
          });
        } else {
          console.log('failed to fetch bookings');
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  // Handle booking cancellation
  const cancelBooking = () => {
    if (!cancellationReason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }

    // Find the booking to cancel
    const bookingToCancel = bookings.upcoming.find(
      (b) => b.id === selectedBooking.id
    );

    if (bookingToCancel) {
      // Remove from upcoming
      const updatedUpcoming = bookings.upcoming.filter(
        (b) => b.id !== selectedBooking.id
      );

      // Add to past with cancelled status
      const cancelledBooking = {
        ...bookingToCancel,
        status: 'Cancelled',
        cancellationReason,
      };

      setBookings({
        upcoming: updatedUpcoming,
        past: [cancelledBooking, ...bookings.past],
      });

      setShowCancelModal(false);
      setSelectedBooking(null);
      setCancellationReason('');
    }
  };

  // Handle submitting a review
 
  const submitReview = async (bookingId, rating, feedback) => {
    try {
        const payload ={
    bookingId:bookingId,
     rating:rating,
     status: "Reviewed",
      feedback:feedback}
      // Make API call to submit the review
      const response = await postReview(payload )
  
      if (!response.ok) {
        throw new Error("Failed to submit review");
      }
  
      const result = await response.json();
  
      // Update the booking with the review if API call is successful
      const updatedPast = bookings.past.map((booking) =>
        booking.id === bookingId
          ? { ...booking, rating, feedback, status: "Reviewed" }
          : booking
      );
  
      setBookings({
        ...bookings,
        past: updatedPast,
      });
  
      setSelectedBooking(null);
      console.log("Review submitted successfully:", result);
    } catch (error) {
      console.error("Error submitting review:", error.message);
    }
  };
  

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      case 'Reviewed':
        return 'bg-purple-100 text-purple-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get active bookings based on tab
  const activeBookings = bookings[activeTab] || [];

  return (
    <div className="bg-gray-100 min-h-screen pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Bookings</h1>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'upcoming'
                  ? 'border-b-2 border-green-500 text-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming Bookings
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'past'
                  ? 'border-b-2 border-green-500 text-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('past')}
            >
              Past Bookings
            </button>
          </div>
        </div>

        {/* Booking List */}
        {activeBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FaTractor className="mx-auto text-gray-400 text-5xl mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No bookings found
            </h3>
            <p className="text-gray-500 mb-4">
              {activeTab === 'upcoming'
                ? "You don't have any upcoming bookings."
                : "You don't have any past bookings."}
            </p>
            {activeTab === 'upcoming' && (
              <a
                href="/vehicles"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
              >
                Find Vehicles to Book
              </a>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedBooking(booking)}
              >
                <div className="relative">
                  <img
                    src={booking.image}
                    alt={booking.vehicleName}
                    className="w-full h-40 object-cover"
                  />
                  <div
                    className={`absolute top-0 right-0 ${getStatusColor(
                      booking.status
                    )} px-2 py-1 m-2 rounded text-xs font-medium`}
                  >
                    {booking.status}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">
                    {booking.vehicleName}
                  </h3>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-2 text-green-500" />
                      <span>
                        {new Date(booking.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FaClock className="mr-2 text-green-500" />
                      <span>{booking.time}</span>
                    </div>
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-green-500" />
                      <span>{booking.location}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-500">Amount</p>
                      <p className="font-bold text-green-600">
                        ₹{booking.price.toLocaleString()}
                      </p>
                    </div>

                    {booking.status === 'Completed' && !booking.rating && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBooking(booking);
                        }}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                      >
                        Leave Review
                      </button>
                    )}

                    {booking.status === 'Confirmed' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBooking(booking);
                          setShowCancelModal(true);
                        }}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                      >
                        Cancel
                      </button>
                    )}

                    {booking.rating && (
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < booking.rating
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Booking Details Modal */}
        {selectedBooking && !showCancelModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative">
                <img
                  src={selectedBooking.image}
                  alt={selectedBooking.vehicleName}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <div
                  className={`absolute top-2 left-2 ${getStatusColor(
                    selectedBooking.status
                  )} px-3 py-1 rounded-full text-xs font-medium`}
                >
                  {selectedBooking.status}
                </div>
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">
                  {selectedBooking.vehicleName}
                </h2>
                <p className="text-gray-600 mb-4">
                  {selectedBooking.vehicleType}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold mb-2">Booking Details</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center">
                        <FaCalendarAlt className="mr-2 text-green-500" />
                        <div>
                          <p className="font-medium">Date</p>
                          <p>
                            {new Date(selectedBooking.date).toLocaleDateString(
                              'en-US',
                              {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              }
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <FaClock className="mr-2 text-green-500" />
                        <div>
                          <p className="font-medium">Time</p>
                          <p>{selectedBooking.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-green-500" />
                        <div>
                          <p className="font-medium">Location</p>
                          <p>{selectedBooking.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Owner Information</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center">
                        <FaUser className="mr-2 text-green-500" />
                        <div>
                          <p className="font-medium">Name</p>
                          <p>{selectedBooking.ownerName}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <FaPhone className="mr-2 text-green-500" />
                        <div>
                          <p className="font-medium">Contact</p>
                          <p>{selectedBooking.ownerPhone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedBooking.status === 'Cancelled' &&
                  selectedBooking.cancellationReason && (
                    <div className="mb-6">
                      <h3 className="font-semibold mb-2">
                        Cancellation Reason
                      </h3>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <p className="text-red-700">
                          {selectedBooking.cancellationReason}
                        </p>
                      </div>
                    </div>
                  )}

                {selectedBooking.status === 'Completed' &&
                  selectedBooking.feedback && (
                    <div className="mb-6">
                      <h3 className="font-semibold mb-2">Your Review</h3>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-5 h-5 ${
                                i < (selectedBooking.rating || 0)
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-blue-700">
                          {selectedBooking.feedback}
                        </p>
                      </div>
                    </div>
                  )}

                {selectedBooking.status === 'Completed' &&
                  !selectedBooking.rating && (
                    <div className="mb-6">
                      <h3 className="font-semibold mb-2">Leave a Review</h3>
                      <ReviewForm
                        booking={selectedBooking}
                        onSubmit={submitReview}
                      />
                    </div>
                  )}

                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Payment Details</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span>Rental Charge</span>
                      <span>₹{selectedBooking.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Service Fee</span>
                      <span>
                        ₹
                        {Math.round(
                          selectedBooking.price * 0.05
                        ).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold pt-2 border-t">
                      <span>Total Amount</span>
                      <span>
                        ₹
                        {Math.round(
                          selectedBooking.price * 1.05
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end">
                  {selectedBooking.status === 'Confirmed' && (
                    <button
                      onClick={() => setShowCancelModal(true)}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                    >
                      Cancel Booking
                    </button>
                  )}

                  {selectedBooking.status === 'Pending' && (
                    <div className="text-green-600 flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-green-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Waiting for owner confirmation
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cancellation Modal */}
        {showCancelModal && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-4">Cancel Booking</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to cancel your booking for{' '}
                {selectedBooking.vehicleName} on{' '}
                {new Date(selectedBooking.date).toLocaleDateString()}?
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Please provide a reason for cancellation:
                </label>
                <textarea
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  rows="3"
                  placeholder="Reason for cancellation..."
                  required
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    setCancellationReason('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Keep Booking
                </button>
                <button
                  onClick={cancelBooking}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  disabled={!cancellationReason.trim()}
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Review Form Component
const ReviewForm = ({ booking, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(booking.id, rating, feedback);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-blue-50 p-4 rounded-lg">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Rating
        </label>
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="focus:outline-none"
            >
              <svg
                className={`w-6 h-6 ${
                  star <= rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Feedback
        </label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          rows="3"
          placeholder="Share your experience..."
          required
        ></textarea>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        Submit Review
      </button>
    </form>
  );
};

export default Booking;
