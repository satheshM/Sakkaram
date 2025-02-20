import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-black text-white p-4 flex justify-between items-center fixed top-0 left-0 w-full z-50">
      {/* Logo */}
      <h1 className="text-xl font-bold">Sakkaram</h1>

      {/* Menu Button (Visible Always) */}
      <div>
        <button onClick={toggleMenu} className="text-white text-2xl">
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Horizontal Toggle Menu (Fixed & Always Visible) */}
      <div
        className={`absolute top-0 right-0 bg-black text-white px-4 py-3 flex items-center gap-4 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ height: "100%", whiteSpace: "nowrap" }}
      >
        {[
          { name: "Home", path: "/" },
          { name: "Find Vehicles", path: "/vehicles" },
          { name: "Bookings", path: "/booking" },
          { name: "Profile", path: "/profile" },
        ].map(({ name, path }) => (
          <Link
            key={path}
            to={path}
            className={`px-3 py-2 rounded ${
              location.pathname === path ? "bg-green-500 text-black" : "hover:text-green-400"
            }`}
          >
            {name}
          </Link>
        ))}
        {/* Close Button (Only Closes on Clicking "X") */}
        <button onClick={toggleMenu} className="text-white text-2xl">
          <FiX />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
