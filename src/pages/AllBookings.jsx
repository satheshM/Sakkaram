import React, { useState } from "react";

const AllBookings = () => {
  // Sample Data for Bookings
  const [requests, setRequests] = useState([
    { id: 1, farmer: "Ramesh", vehicle: "Tractor", status: "Pending" },
    { id: 2, farmer: "Suresh", vehicle: "Harvester", status: "Pending" },
  ]);

  const [activeBookings, setActiveBookings] = useState([
    { id: 3, farmer: "Ravi", vehicle: "Tractor", status: "Ongoing" },
  ]);

  const [bookingHistory, setBookingHistory] = useState([
    { id: 4, farmer: "Vijay", vehicle: "Tractor", amount: "₹2,000", date: "10-Feb" },
  ]);

  // Handle Accept/Reject for Booking Requests
  const handleAction = (id, action) => {
    if (action === "Accepted") {
      const acceptedBooking = requests.find((req) => req.id === id);
      setActiveBookings([...activeBookings, { ...acceptedBooking, status: "Ongoing" }]);
    }
    setRequests(requests.filter((req) => req.id !== id));
  };

  return (
    <div className="p-6">
      {/* 📌 Section 1: Booking Requests */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Booking Requests</h2>
        {requests.length > 0 ? (
          requests.map((req) => (
            <div key={req.id} className="border p-4 rounded mb-2 bg-gray-100">
              <p><strong>Farmer:</strong> {req.farmer}</p>
              <p><strong>Vehicle:</strong> {req.vehicle}</p>
              <p><strong>Status:</strong> {req.status}</p>
              {req.status === "Pending" && (
                <>
                  <button onClick={() => handleAction(req.id, "Accepted")} className="bg-green-500 px-3 py-1 rounded mr-2 text-white">
                    Accept
                  </button>
                  <button onClick={() => handleAction(req.id, "Rejected")} className="bg-red-500 px-3 py-1 rounded text-white">
                    Reject
                  </button>
                </>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No new booking requests.</p>
        )}
      </div>

      {/* 📌 Section 2: Active Bookings */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Active Bookings</h2>
        {activeBookings.length > 0 ? (
          activeBookings.map((booking) => (
            <div key={booking.id} className="border p-4 rounded mb-2 bg-blue-100">
              <p><strong>Farmer:</strong> {booking.farmer}</p>
              <p><strong>Vehicle:</strong> {booking.vehicle}</p>
              <p><strong>Status:</strong> {booking.status}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No active bookings.</p>
        )}
      </div>

      {/* 📌 Section 3: Booking History */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Booking History</h2>
        {bookingHistory.length > 0 ? (
          bookingHistory.map((item) => (
            <div key={item.id} className="border p-4 rounded mb-2 bg-green-100">
              <p><strong>Farmer:</strong> {item.farmer}</p>
              <p><strong>Vehicle:</strong> {item.vehicle}</p>
              <p><strong>Amount:</strong> {item.amount}</p>
              <p><strong>Date:</strong> {item.date}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No booking history available.</p>
        )}
      </div>
    </div>
  );
};

export default AllBookings;
