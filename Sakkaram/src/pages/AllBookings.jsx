import React, { useState, useEffect } from 'react';
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaUser,
  FaTractor,
  FaCheck,
  FaTimes,
  FaEye,
} from 'react-icons/fa';
import { GetOwnerBookings, UpdateBookingStatus } from '../api/Bookings';
const AllBookings = () => {
  // Sample Data for Bookings
  // const [requests, setRequests] = useState([
  //   {
  //     id: 1,
  //     farmer: 'Ramesh Kumar',
  //     farmerPhone: '+91 9876543210',
  //     vehicle: 'Mahindra 575 DI Tractor',
  //     vehicleId: 1,
  //     status: 'Pending',
  //     date: '2025-03-15',
  //     time: '08:00 - 16:00',
  //     location: 'Coimbatore, Tamil Nadu',
  //     price: 4000,
  //     message: 'Need for plowing my paddy field. Please confirm availability.',
  //     image:
  //       'https://5.imimg.com/data5/SELLER/Default/2021/12/QO/YC/XG/52189282/mahindra-575-di-tractor.jpg',
  //   },
  //   {
  //     id: 2,
  //     farmer: 'Suresh Patel',
  //     farmerPhone: '+91 9876543211',
  //     vehicle: 'John Deere Harvester',
  //     vehicleId: 2,
  //     status: 'Pending',
  //     date: '2025-03-20',
  //     time: '09:00 - 17:00',
  //     location: 'Salem, Tamil Nadu',
  //     price: 9600,
  //     message:
  //       'Harvesting season is approaching. Need your harvester for my 5-acre wheat field.',
  //     image:
  //       'https://5.imimg.com/data5/SELLER/Default/2021/1/KO/FV/IY/3042719/john-deere-w70-self-propelled-combine-harvester-500x500.jpg',
  //   },
  // ]);
  const [requests, setRequests] = useState([]);
  const [activeBookings, setActiveBookings] = useState([]);
  const [bookingHistory, setBookingHistory] = useState([]);

  const transformBooking = (booking) => ({
    id: booking.id, // Keep the same ID
    farmer: booking.owner, // Assuming 'owner' refers to the farmer
    farmerPhone: '000-000-0000', // No phone number available in the input data
    vehicle: `${booking.vehicleModel} ${booking.vehicleType}`, // Combine model & type
    vehicleId: booking.vehicleId, // Keep vehicle ID
    status: booking.status, // Status remains the same
    date: booking.bookingDate, // Use `bookingDate` for the date
    time: `${booking.duration} hour(s)`, // Show duration as time
    location: booking.location, // Location remains the same
    price: booking.totalPrice, // Use total price
    rating: booking.rating || 5, // If rating exists, use it; otherwise, null
    feedback: booking.feedback || '', // If feedback exists, use it; otherwise, empty string
    image: booking.image, // Use the vehicle image
    message: booking.message || 'No Message',
    cancellationReason: booking.cancellationReason || 'no cancelation reason',
  });

  useEffect(() => {
    const fetchOwnerBookings = async () => {
      try {
        const response = await GetOwnerBookings();

        if (response.status === 200) {
          const allBookings = await response.json();

          setRequests(allBookings.bookingRequest.map(transformBooking) || []); // Pending bookings
          setActiveBookings(
            allBookings.activeBookings.map(transformBooking) || []
          ); // Ongoing bookings
          setBookingHistory(
            allBookings.bookingHistory.map(transformBooking) || []
          );
        } else {
          console.log('failed to fetch owner bookings');
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchOwnerBookings();
  }, []);

  // const [activeBookings, setActiveBookings] = useState([
  //   {
  //     id: 3,
  //     farmer: 'Ravi Kumar',
  //     farmerPhone: '+91 9876543212',
  //     vehicle: 'Mahindra 575 DI Tractor',
  //     vehicleId: 1,
  //     status: 'Ongoing',
  //     date: '2025-03-12',
  //     time: '07:00 - 15:00',
  //     location: 'Coimbatore, Tamil Nadu',
  //     price: 4000,
  //     message: 'Already confirmed. Will meet at the location.',
  //     image:
  //       'https://5.imimg.com/data5/SELLER/Default/2021/12/QO/YC/XG/52189282/mahindra-575-di-tractor.jpg',
  //   },
  // ]);

  // const [bookingHistory, setBookingHistory] = useState([
  //   {
  //     id: 4,
  //     farmer: 'Vijay Singh',
  //     farmerPhone: '+91 9876543213',
  //     vehicle: 'Mahindra 575 DI Tractor',
  //     vehicleId: 1,
  //     status: 'Completed',
  //     date: '2025-02-10',
  //     time: '08:00 - 16:00',
  //     location: 'Coimbatore, Tamil Nadu',
  //     price: 4000,
  //     rating: 5,
  //     feedback: 'Excellent service! The tractor was in perfect condition.',
  //     image:
  //       'https://5.imimg.com/data5/SELLER/Default/2021/12/QO/YC/XG/52189282/mahindra-575-di-tractor.jpg',
  //   },
  //   {
  //     id: 5,
  //     farmer: 'Anand Patel',
  //     farmerPhone: '+91 9876543214',
  //     vehicle: 'John Deere Harvester',
  //     vehicleId: 2,
  //     status: 'Cancelled',
  //     date: '2025-02-05',
  //     time: '09:00 - 17:00',
  //     location: 'Salem, Tamil Nadu',
  //     price: 9600,
  //     cancellationReason:
  //       'Farmer requested cancellation due to weather conditions',
  //     image:
  //       'https://5.imimg.com/data5/SELLER/Default/2021/1/KO/FV/IY/3042719/john-deere-w70-self-propelled-combine-harvester-500x500.jpg',
  //   },
  // ]);

  const [activeTab, setActiveTab] = useState('requests');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancellationReason, setCancellationReason] = useState('');

  // Handle Accept/Reject for Booking Requests

  const handleAction = async (id, action, reason) => {
    try {
      const newStatus = action === 'accept' ? 'Ongoing' : 'Rejected';

      // Call API to update booking status
      const updatedStatus = {
        id: id,
        status: newStatus,
        cancellationReason: reason ? reason : '',
      };
      const response = await UpdateBookingStatus(updatedStatus);

      if (response.status === 200) {
        setRequests((prevRequests) =>
          prevRequests.filter((req) => req.id !== id)
        );

        if (action === 'accept') {
          const acceptedBooking = requests.find((req) => req.id === id);
          if (acceptedBooking) {
            setActiveBookings((prevBookings) => [
              ...prevBookings,
              { ...acceptedBooking, status: 'Ongoing' },
            ]);
          }
        } else {
          const rejectedBooking = requests.find((req) => req.id === id);
          if (rejectedBooking) {
            setBookingHistory((prevHistory) => [
              ...prevHistory,
              {
                ...rejectedBooking,
                status: 'Rejected',
                cancellationReason: 'Owner declined the request',
              },
            ]);
          }
        }

        setSelectedBooking(null);
      } else {
        console.error('Failed to update booking status');
      }
    } catch (error) {
      console.error(
        'Error updating booking:',
        error.response?.data || error.message
      );
    }
  };

  // Mark booking as complete
  const completeBooking = async (id) => {
    const payload = {
      id: id,
      status: 'Completed',
      cancellationReason: '',
    };
    const response = await UpdateBookingStatus(payload);

    if (response.status === 200) {
      const completedBooking = activeBookings.find(
        (booking) => booking.id === id
      );
      if (completedBooking) {
        setBookingHistory([
          ...bookingHistory,
          { ...completedBooking, status: 'Completed' },
        ]);
        setActiveBookings(
          activeBookings.filter((booking) => booking.id !== id)
        );
      }
      setSelectedBooking(null);
    }
  };

  // Cancel active booking
  const cancelBooking = async (id) => {
    if (!cancellationReason.trim()) {
      alert('Please provide a reason for cancellation!');
      return;
    }
    const payload = {
      id: id,
      status: 'Cancelled',
      cancellationReason: cancellationReason,
    };
    const response = await UpdateBookingStatus(payload);

    if (response.status === 200) {
      const cancelledBooking = activeBookings.find(
        (booking) => booking.id === id
      );
      if (cancelledBooking) {
        setBookingHistory([
          ...bookingHistory,
          {
            ...cancelledBooking,
            status: 'Cancelled',
            cancellationReason,
          },
        ]);
        setActiveBookings(
          activeBookings.filter((booking) => booking.id !== id)
        );
      }
      setSelectedBooking(null);
      setCancellationReason('');
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Ongoing':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelled':
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get data based on active tab
  const getActiveData = () => {
    switch (activeTab) {
      case 'requests':
        return requests;
      case 'active':
        return activeBookings;
      case 'history':
        return bookingHistory;
      default:
        return [];
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Manage Bookings
        </h1>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            {[
              {
                id: 'requests',
                label: 'Booking Requests',
                count: requests.length,
              },
              {
                id: 'active',
                label: 'Active Bookings',
                count: activeBookings.length,
              },
              {
                id: 'history',
                label: 'Booking History',
                count: bookingHistory.length,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`px-4 py-3 text-sm font-medium relative ${
                  activeTab === tab.id
                    ? 'border-b-2 border-green-500 text-green-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span
                    className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                      tab.id === 'requests'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Booking List */}
        {getActiveData().length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FaTractor className="mx-auto text-gray-400 text-5xl mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No bookings found
            </h3>
            <p className="text-gray-500">
              {activeTab === 'requests'
                ? "You don't have any pending booking requests."
                : activeTab === 'active'
                ? "You don't have any active bookings."
                : "You don't have any booking history yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getActiveData().map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedBooking(booking)}
              >
                <div className="relative">
                  <img
                    src={booking.image}
                    alt={booking.vehicle}
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
                  <h3 className="font-bold text-lg mb-2">{booking.vehicle}</h3>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <FaUser className="mr-2 text-green-500" />
                      <span>{booking.farmer}</span>
                    </div>
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
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-500">Amount</p>
                      <p className="font-bold text-green-600">
                        ₹{booking.price.toLocaleString()}
                      </p>
                    </div>

                    {booking.status === 'Pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction(booking.id, 'accept');
                          }}
                          className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
                          title="Accept"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction(booking.id, 'reject');
                          }}
                          className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                          title="Reject"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    )}

                    {booking.status === 'Ongoing' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          completeBooking(booking.id);
                        }}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                      >
                        Mark Complete
                      </button>
                    )}

                    {booking.status === 'Completed' && booking.rating && (
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

                    {(booking.status === 'Cancelled' ||
                      booking.status === 'Rejected') && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBooking(booking);
                        }}
                        className="text-gray-500 hover:text-gray-700"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Booking Details Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative">
                <img
                  src={selectedBooking.image}
                  alt={selectedBooking.vehicle}
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
                  {selectedBooking.vehicle}
                </h2>

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
                    <h3 className="font-semibold mb-2">Farmer Information</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center">
                        <FaUser className="mr-2 text-green-500" />
                        <div>
                          <p className="font-medium">Name</p>
                          <p>{selectedBooking.farmer}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <FaPhoneAlt className="mr-2 text-green-500" />
                        <div>
                          <p className="font-medium">Contact</p>
                          <p>{selectedBooking.farmerPhone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedBooking.message && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Message from Farmer</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700">{selectedBooking.message}</p>
                    </div>
                  </div>
                )}

                {(selectedBooking.status === 'Cancelled' ||
                  selectedBooking.status === 'Rejected') &&
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
                      <h3 className="font-semibold mb-2">Farmer Feedback</h3>
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
                <div className="flex justify-between">
                  {selectedBooking.status === 'Pending' && (
                    <>
                      <button
                        onClick={() =>
                          handleAction(selectedBooking.id, 'reject')
                        }
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                      >
                        Reject Request
                      </button>
                      <button
                        onClick={() =>
                          handleAction(selectedBooking.id, 'accept')
                        }
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                      >
                        Accept Request
                      </button>
                    </>
                  )}

                  {selectedBooking.status === 'Ongoing' && (
                    <>
                      <div>
                        <button
                          onClick={() =>
                            setSelectedBooking({
                              ...selectedBooking,
                              showCancellation: true,
                            })
                          }
                          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                        >
                          Cancel Booking
                        </button>
                      </div>
                      <button
                        onClick={() => completeBooking(selectedBooking.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Mark as Completed
                      </button>
                    </>
                  )}
                </div>

                {/* Cancellation Form */}
                {selectedBooking.showCancellation && (
                  <div className="mt-6 p-4 border border-red-200 rounded-lg bg-red-50">
                    <h3 className="font-semibold mb-2 text-red-700">
                      Cancellation Reason
                    </h3>
                    <textarea
                      value={cancellationReason}
                      onChange={(e) => setCancellationReason(e.target.value)}
                      placeholder="Please provide a reason for cancellation..."
                      className="w-full p-2 border border-red-300 rounded-md mb-3"
                      rows="3"
                    ></textarea>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() =>
                          setSelectedBooking({
                            ...selectedBooking,
                            showCancellation: false,
                          })
                        }
                        className="px-3 py-1 border border-gray-300 rounded-md text-gray-700"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => cancelBooking(selectedBooking.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                        disabled={!cancellationReason.trim()}
                      >
                        Confirm Cancellation
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllBookings;
