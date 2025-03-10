import React from "react";
import { Link } from "react-router-dom";
import Testimonial from "../components/Testimonial";
import VehicleCard from "../components/VehicleCard";
import { FaTractor, FaMoneyBillWave, FaShieldAlt, FaMapMarkerAlt } from "react-icons/fa";

const LandingPage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-green-700 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1586771107445-d3ca888129ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80')",
            backgroundBlendMode: "overlay"
          }}
        ></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="py-20 md:py-28">
            <div className="text-center md:text-left md:max-w-2xl">
              <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                <span className="block">Instant Agricultural</span>
                <span className="block text-green-300">Vehicle Booking</span>
              </h1>
              <p className="mt-3 text-base text-gray-200 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl md:mx-0">
                Connect with local vehicle owners and book tractors, harvesters, and more in minutes. Modern farming made accessible to everyone.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row sm:justify-center md:justify-start gap-4">
                <Link to="/signup" className="rounded-md shadow">
                  <div className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-black bg-green-300 hover:bg-green-400 md:py-4 md:text-lg md:px-10 transition-colors">
                    Get Started
                  </div>
                </Link>
                <Link to="/vehicles" className="rounded-md">
                  <div className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-800 bg-opacity-60 hover:bg-opacity-70 md:py-4 md:text-lg md:px-10 transition-colors">
                    Browse Vehicles
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white shadow-md rounded-lg max-w-4xl mx-auto px-4 sm:px-6 -mt-10 relative z-20">
        <div className="py-5">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Find Agricultural Vehicles Near You</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaMapMarkerAlt className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Enter your location"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
              <select className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                <option value="">All Vehicles</option>
                <option value="tractor">Tractor</option>
                <option value="harvester">Harvester</option>
                <option value="rotavator">Rotavator</option>
                <option value="sprayer">Sprayer</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why Choose Sakkaram?
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              We're revolutionizing agricultural vehicle rentals with our easy-to-use platform.
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: <FaTractor className="h-8 w-8 text-green-500" />,
                  title: "Wide Selection",
                  description: "Choose from a variety of agricultural vehicles including tractors, harvesters, and more."
                },
                {
                  icon: <FaMoneyBillWave className="h-8 w-8 text-green-500" />,
                  title: "Affordable Pricing",
                  description: "Transparent hourly and daily rates with no hidden fees or charges."
                },
                {
                  icon: <FaShieldAlt className="h-8 w-8 text-green-500" />,
                  title: "Verified Owners",
                  description: "All vehicle owners are verified to ensure quality and reliability of service."
                },
                {
                  icon: <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>,
                  title: "Instant Booking",
                  description: "Book vehicles instantly for same-day use or schedule in advance for future needs."
                }
              ].map((feature, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-base text-gray-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">Process</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              How Sakkaram Works
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Booking an agricultural vehicle has never been easier.
            </p>
          </div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-green-200 transform -translate-y-1/2 z-0"></div>
            
            <div className="relative z-10 grid grid-cols-1 gap-8 md:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Search & Select",
                  description: "Enter your location and find available vehicles near you. Compare prices and features."
                },
                {
                  step: "2",
                  title: "Book & Pay",
                  description: "Choose your rental period and make a secure payment through our platform."
                },
                {
                  step: "3",
                  title: "Use & Return",
                  description: "Pick up the vehicle at the agreed time and location. Return after your work is complete."
                }
              ].map((step, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 text-center">{step.title}</h3>
                  <p className="mt-2 text-base text-gray-500 text-center">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Showcase */}
      <VehicleCard />

      {/* Testimonials */}
      <Testimonial />

      {/* CTA Section */}
      <div className="bg-green-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to transform your farming?</span>
            <span className="block text-green-300">Join thousands of satisfied users today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link to="/signup" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-gray-50">
                Get Started
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link to="/login" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-800 hover:bg-green-900">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;