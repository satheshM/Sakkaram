import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "../context/AuthContext"; // Import Auth Context

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true); // Set default to true for always-visible menu
  const { role, logout } = useAuth(); // Get role & logout function

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-black text-white p-4 flex justify-between items-center fixed top-0 left-0 w-full z-50">
      {/* Logo */}
      <h1 className="text-xl font-bold">Sakkaram</h1>

      {/* Menu Button (Always Visible) */}
      <div>
        <button onClick={toggleMenu} className="text-white text-2xl">
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Horizontal Toggle Menu (Fixed Position & Always Visible) */}
      <div
        className={`absolute top-0 right-0 bg-black text-white px-6 py-3 flex items-center gap-4 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ height: "100%", whiteSpace: "nowrap" }}
      >
        {/* Common Links */}
        <Link to="/" className={`px-3 py-2 rounded ${location.pathname === "/" ? "bg-green-500 text-black" : "hover:text-green-400"}`}>
          Home
        </Link>
       

        {/* Farmer-Specific Links */}
        {role === "farmer" && (
          <>
           <Link to="/vehicles" className={`px-3 py-2 rounded ${location.pathname === "/vehicles" ? "bg-green-500 text-black" : "hover:text-green-400"}`}>
          Find Vehicles
        </Link>
            <Link to="/booking" className={`px-3 py-2 rounded ${location.pathname === "/booking" ? "bg-green-500 text-black" : "hover:text-green-400"}`}>
              My Bookings
            </Link>
            <Link to="/wallet" className={`px-3 py-2 rounded ${location.pathname === "/wallet" ? "bg-green-500 text-black" : "hover:text-green-400"}`}>
              Wallet
            </Link>
            <Link to="/profile" className={`px-3 py-2 rounded ${location.pathname === "/profile" ? "bg-green-500 text-black" : "hover:text-green-400"}`}>
              Profile
            </Link>
          </>
        )}

        {/* Vehicle Owner-Specific Links */}
        {role === "vehicle_owner" && (
          <>
            <Link to="/earnings" className={`px-3 py-2 rounded ${location.pathname === "/earnings" ? "bg-green-500 text-black" : "hover:text-green-400"}`}>
              Earnings
            </Link>
            <Link to="/my-vehicles" className={`px-3 py-2 rounded ${location.pathname === "/my-vehicles" ? "bg-green-500 text-black" : "hover:text-green-400"}`}>
              My Vehicles
            </Link>
            <Link to="/owner-bookings" className={`px-3 py-2 rounded ${location.pathname === "/owner-bookings" ? "bg-green-500 text-black" : "hover:text-green-400"}`}>
              Booking
            </Link>

            <Link to="/profile" className={`px-3 py-2 rounded ${location.pathname === "/profile" ? "bg-green-500 text-black" : "hover:text-green-400"}`}>
              Profile
            </Link>
          </>
        )}

        {/* Authentication */}
        {role ? (
          <>
            <button onClick={handleLogout} className="px-3 py-2 rounded bg-red-500 text-white hover:bg-red-600">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={`px-3 py-2 rounded ${location.pathname === "/login" ? "bg-green-500 text-black" : "hover:text-green-400"}`}>
              Login
            </Link>
            <Link to="/signup" className={`px-3 py-2 rounded ${location.pathname === "/signup" ? "bg-green-500 text-black" : "hover:text-green-400"}`}>
              Signup
            </Link>
          </>
        )}

        {/* Close Button (Only Closes on Clicking "X") */}
        <button onClick={toggleMenu} className="text-white text-2xl">
          <FiX />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;