import React from "react";
import { Link } from "react-router-dom";
import Testimonial from "../components/Testimonial";  // Import Testimonial Component
import VehicleCard from "../components/VehicleCard";  // Import Vehicle Card Component

const LandingPage = () => {
  return (
    <div className="bg-gray-100">
      {/* Hero Section */}
      <div className="text-center py-20 px-4">
        <h2 className="text-4xl font-bold mb-4">
          Book an Agricultural Vehicle Anytime, Anywhere 🚜
        </h2>
        <p className="text-gray-600 mb-6">
          Instantly find and book tractors, harvesters, and other farm vehicles with ease.
        </p>

        {/* Search Bar */}
        <div className="flex items-center bg-white p-2 rounded shadow-md w-full max-w-md mx-auto">
          <input
            type="text"
            placeholder="Enter pickup location..."
            className="flex-1 p-2 outline-none"
          />
          <button className="bg-green-500 text-white px-4 py-2 rounded">
            Find a Vehicle
          </button>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white text-center py-12 px-4">
        <h2 className="text-3xl font-bold mb-4">How Sakkaram Works?</h2>
        <div className="flex justify-center flex-wrap gap-6">
          {[
            { step: "1", title: "Enter Location", desc: "Choose your farm or field location." },
            { step: "2", title: "Select Vehicle", desc: "Pick from tractors, harvesters & more." },
            { step: "3", title: "Book Instantly", desc: "Confirm booking & vehicle arrives!" },
          ].map(({ step, title, desc }) => (
            <div key={step} className="bg-gray-100 p-6 rounded shadow-md w-64">
              <h3 className="text-xl font-bold mb-2">{title}</h3>
              <p className="text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </div>

     

      {/* Testimonials Section */}
      <div className="bg-white py-12 px-4 text-center">
       
        <Testimonial />  {/* ✅ Include Testimonial Component */}
      </div>

     

      {/* CTA Section */}
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold">Start Booking Now!</h2>
        <Link to="/vehicles">
          <button className="bg-green-600 text-white px-6 py-2 rounded mt-4">
            Book a Vehicle
          </button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
