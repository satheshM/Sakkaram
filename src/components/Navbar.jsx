import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-black text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Sakkaram</h1>
      <div className="space-x-4">
        <Link to="/" className="hover:text-green-400">Home</Link>
        <Link to="/vehicles" className="hover:text-green-400">Find Vehicles</Link>
        <Link to="/booking" className="hover:text-green-400">Bookings</Link>
        <Link to="/profile" className="hover:text-green-400">Profile</Link>
      </div>
    </nav>
  );
};

export default Navbar;
