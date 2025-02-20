import React, { useState } from "react";

// Sample data for bookings
const initialBookings = [
  { id: 1, vehicle: "Tractor", owner: "Ramesh", status: "Confirmed", date: "2025-02-18" },
  { id: 2, vehicle: "Harvester", owner: "Suresh", status: "Pending", date: "2025-02-19" },
  { id: 3, vehicle: "Plow", owner: "Mahesh", status: "Cancelled", date: "2025-02-20" },
];

const Booking = () => {
  const [bookings, setBookings] = useState(initialBookings);

  // Cancel booking
  const cancelBooking = (id) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === id ? { ...booking, status: "Cancelled" } : booking
      )
    );
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-green-700 mb-6">Your Bookings</h1>
      
      {bookings.length === 0 ? (
        <p className="text-gray-600">No bookings found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="p-4 bg-white shadow rounded-lg border">
              <h3 className="text-xl font-semibold">{booking.vehicle}</h3>
              <p className="text-gray-600">Owner: {booking.owner}</p>
              <p className="text-gray-500">Date: {booking.date}</p>
              <p
                className={`text-sm font-bold ${
                  booking.status === "Cancelled" ? "text-red-500" : "text-green-600"
                }`}
              >
                Status: {booking.status}
              </p>
              {booking.status !== "Cancelled" && (
                <button
                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded w-full"
                  onClick={() => cancelBooking(booking.id)}
                >
                  Cancel Booking
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Booking;
