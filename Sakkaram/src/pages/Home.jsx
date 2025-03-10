import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaTractor, FaCalendarCheck, FaWallet, FaChartLine } from "react-icons/fa";

const Home = () => {
  const { user, role } = useAuth();
  const [greeting, setGreeting] = useState("");
  const [stats, setStats] = useState({
    bookings: role === "farmer" ? 3 : 8,
    earnings: role === "farmer" ? 0 : 12500,
    vehicles: role === "farmer" ? 0 : 3,
    notifications: 2
  });

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  // Farmer Dashboard
  const FarmerDashboard = () => (
    <div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/vehicles" className="bg-green-50 p-4 rounded-lg text-center hover:bg-green-100 transition-colors">
            <FaTractor className="text-green-600 text-2xl mx-auto mb-2" />
            <span className="text-sm font-medium">Find Vehicles</span>
          </Link>
          <Link to="/booking" className="bg-blue-50 p-4 rounded-lg text-center hover:bg-blue-100 transition-colors">
            <FaCalendarCheck className="text-blue-600 text-2xl mx-auto mb-2" />
            <span className="text-sm font-medium">My Bookings</span>
          </Link>
          <Link to="/wallet" className="bg-purple-50 p-4 rounded-lg text-center hover:bg-purple-100 transition-colors">
            <FaWallet className="text-purple-600 text-2xl mx-auto mb-2" />
            <span className="text-sm font-medium">Wallet</span>
          </Link>
          <Link to="/profile" className="bg-yellow-50 p-4 rounded-lg text-center hover:bg-yellow-100 transition-colors">
            <svg className="text-yellow-600 text-2xl mx-auto mb-2 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-sm font-medium">Profile</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
          {stats.bookings > 0 ? (
            <div className="space-y-3">
              <div className="border-l-4 border-green-500 pl-3 py-2">
                <p className="font-medium">Mahindra Tractor</p>
                <p className="text-sm text-gray-500">Booked for: Tomorrow</p>
                <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded mt-1">Confirmed</span>
              </div>
              <div className="border-l-4 border-yellow-500 pl-3 py-2">
                <p className="font-medium">John Deere Harvester</p>
                <p className="text-sm text-gray-500">Booked for: Next Week</p>
                <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded mt-1">Pending</span>
              </div>
              <Link to="/booking" className="text-green-600 text-sm font-medium hover:underline block mt-2">View all bookings →</Link>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500 mb-3">No bookings yet</p>
              <Link to="/vehicles" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors">
                Find Vehicles
              </Link>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Nearby Vehicles</h2>
          <div className="space-y-3">
            <div className="flex items-center">
              <img src="https://5.imimg.com/data5/SELLER/Default/2021/12/QO/YC/XG/52189282/mahindra-575-di-tractor.jpg" 
                alt="Tractor" className="w-16 h-12 object-cover rounded mr-3" />
              <div>
                <p className="font-medium">Mahindra 575 DI</p>
                <p className="text-sm text-gray-500">5km away • ₹500/hr</p>
              </div>
            </div>
            <div className="flex items-center">
              <img src="https://5.imimg.com/data5/SELLER/Default/2021/1/KO/FV/IY/3042719/john-deere-w70-self-propelled-combine-harvester-500x500.jpg" 
                alt="Harvester" className="w-16 h-12 object-cover rounded mr-3" />
              <div>
                <p className="font-medium">John Deere Harvester</p>
                <p className="text-sm text-gray-500">8km away • ₹1200/hr</p>
              </div>
            </div>
            <Link to="/vehicles" className="text-green-600 text-sm font-medium hover:underline block mt-2">View all vehicles →</Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Weather Forecast</h2>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <svg className="h-10 w-10 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="text-2xl font-bold ml-2">32°C</span>
            </div>
            <p className="text-gray-600">Sunny, Perfect for fieldwork</p>
            <div className="flex justify-between mt-4 text-sm">
              <div className="text-center">
                <p>Tomorrow</p>
                <svg className="h-6 w-6 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
                <p>30°C</p>
              </div>
              <div className="text-center">
                <p>Wed</p>
                <svg className="h-6 w-6 mx-auto text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
                <p>28°C</p>
              </div>
              <div className="text-center">
                <p>Thu</p>
                <svg className="h-6 w-6 mx-auto text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <p>31°C</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Farming Tips</h2>
        <div className="space-y-4">
          <div className="border-b pb-3">
            <h3 className="font-medium">Best Practices for Monsoon Sowing</h3>
            <p className="text-sm text-gray-600 mt-1">Learn the optimal techniques for sowing during the monsoon season to maximize yield.</p>
            <a href="#" className="text-green-600 text-sm hover:underline">Read more</a>
          </div>
          <div className="border-b pb-3">
            <h3 className="font-medium">Tractor Maintenance Guide</h3>
            <p className="text-sm text-gray-600 mt-1">Simple maintenance tips to keep your tractor running efficiently throughout the year.</p>
            <a href="#" className="text-green-600 text-sm hover:underline">Read more</a>
          </div>
          <div>
            <h3 className="font-medium">Government Subsidies for Farmers</h3>
            <p className="text-sm text-gray-600 mt-1">Latest updates on available subsidies and how to apply for them.</p>
            <a href="#" className="text-green-600 text-sm hover:underline">Read more</a>
          </div>
        </div>
      </div>
    </div>
  );

  // Vehicle Owner Dashboard
  const OwnerDashboard = () => (
    <div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/my-vehicles" className="bg-green-50 p-4 rounded-lg text-center hover:bg-green-100 transition-colors">
            <FaTractor className="text-green-600 text-2xl mx-auto mb-2" />
            <span className="text-sm font-medium">My Vehicles</span>
          </Link>
          <Link to="/owner-bookings" className="bg-blue-50 p-4 rounded-lg text-center hover:bg-blue-100 transition-colors">
            <FaCalendarCheck className="text-blue-600 text-2xl mx-auto mb-2" />
            <span className="text-sm font-medium">Bookings</span>
          </Link>
          <Link to="/earnings" className="bg-purple-50 p-4 rounded-lg text-center hover:bg-purple-100 transition-colors">
            <FaChartLine className="text-purple-600 text-2xl mx-auto mb-2" />
            <span className="text-sm font-medium">Earnings</span>
          </Link>
          <Link to="/profile" className="bg-yellow-50 p-4 rounded-lg text-center hover:bg-yellow-100 transition-colors">
            <svg className="text-yellow-600 text-2xl mx-auto mb-2 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-sm font-medium">Profile</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Booking Requests</h2>
            <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">2 New</span>
          </div>
          <div className="space-y-3">
            <div className="border-l-4 border-yellow-500 pl-3 py-2">
              <p className="font-medium">Ramesh Kumar</p>
              <p className="text-sm text-gray-500">Tractor • Tomorrow, 8AM-2PM</p>
              <div className="mt-2 flex space-x-2">
                <button className="px-2 py-1 bg-green-500 text-white text-xs rounded">Accept</button>
                <button className="px-2 py-1 bg-red-500 text-white text-xs rounded">Decline</button>
              </div>
            </div>
            <div className="border-l-4 border-yellow-500 pl-3 py-2">
              <p className="font-medium">Suresh Patel</p>
              <p className="text-sm text-gray-500">Harvester • Next Week, Full Day</p>
              <div className="mt-2 flex space-x-2">
                <button className="px-2 py-1 bg-green-500 text-white text-xs rounded">Accept</button>
                <button className="px-2 py-1 bg-red-500 text-white text-xs rounded">Decline</button>
              </div>
            </div>
            <Link to="/owner-bookings" className="text-green-600 text-sm font-medium hover:underline block mt-2">View all requests →</Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Earnings Overview</h2>
          <div className="text-center mb-4">
            <p className="text-gray-500 text-sm">This Month</p>
            <p className="text-3xl font-bold text-green-600">₹{stats.earnings.toLocaleString()}</p>
          </div>
          <div className="h-24 bg-gray-50 rounded-lg mb-4">
            {/* Simple bar chart visualization */}
            <div className="flex h-full items-end px-2 py-1">
              <div className="w-1/7 h-1/3 bg-green-300 mx-1"></div>
              <div className="w-1/7 h-1/2 bg-green-400 mx-1"></div>
              <div className="w-1/7 h-2/3 bg-green-500 mx-1"></div>
              <div className="w-1/7 h-3/4 bg-green-600 mx-1"></div>
              <div className="w-1/7 h-1/2 bg-green-500 mx-1"></div>
              <div className="w-1/7 h-2/3 bg-green-400 mx-1"></div>
              <div className="w-1/7 h-full bg-green-600 mx-1"></div>
            </div>
          </div>
          <Link to="/earnings" className="text-green-600 text-sm font-medium hover:underline block text-center">View detailed report →</Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Your Vehicles</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img src="https://5.imimg.com/data5/SELLER/Default/2021/12/QO/YC/XG/52189282/mahindra-575-di-tractor.jpg" 
                  alt="Tractor" className="w-16 h-12 object-cover rounded mr-3" />
                <div>
                  <p className="font-medium">Mahindra 575 DI</p>
                  <p className="text-sm text-gray-500">Tractor • ₹500/hr</p>
                </div>
              </div>
              <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Available</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img src="https://5.imimg.com/data5/SELLER/Default/2021/1/KO/FV/IY/3042719/john-deere-w70-self-propelled-combine-harvester-500x500.jpg" 
                  alt="Harvester" className="w-16 h-12 object-cover rounded mr-3" />
                <div>
                  <p className="font-medium">John Deere Harvester</p>
                  <p className="text-sm text-gray-500">Harvester • ₹1200/hr</p>
                </div>
              </div>
              <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs rounded">Booked</span>
            </div>
            <Link to="/my-vehicles" className="text-green-600 text-sm font-medium hover:underline block mt-2">Manage vehicles →</Link>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Performance Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Booking Rate</p>
            <p className="text-2xl font-bold text-blue-600">78%</p>
            <p className="text-xs text-gray-500">+12% from last month</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Average Rating</p>
            <p className="text-2xl font-bold text-green-600">4.8/5</p>
            <p className="text-xs text-gray-500">Based on 24 reviews</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Repeat Customers</p>
            <p className="text-2xl font-bold text-purple-600">65%</p>
            <p className="text-xs text-gray-500">+5% from last month</p>
          </div>
        </div>
        <p className="text-sm text-gray-500">Tip: Vehicles with clear photos and detailed descriptions get 40% more bookings.</p>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            {greeting}, {user?.name || user?.user || 'User'}!
          </h1>
          <p className="text-gray-600">Here's what's happening with your account today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <FaCalendarCheck className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Bookings</p>
              <p className="text-xl font-bold">{stats.bookings}</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <FaTractor className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Vehicles</p>
              <p className="text-xl font-bold">{stats.vehicles}</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <div className="rounded-full bg-purple-100 p-3 mr-4">
              <FaWallet className="text-purple-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{role === "farmer" ? "Wallet Balance" : "Earnings"}</p>
              <p className="text-xl font-bold">₹{stats.earnings.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <div className="rounded-full bg-yellow-100 p-3 mr-4">
              <svg className="text-yellow-600 text-xl h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Notifications</p>
              <p className="text-xl font-bold">{stats.notifications}</p>
            </div>
          </div>
        </div>

        {/* Render dashboard based on user role */}
        {role === "farmer" ? <FarmerDashboard /> : <OwnerDashboard />}
      </div>
    </div>
  );
};

export default Home;