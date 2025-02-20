import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation(); // Get current path

  return (
    <nav className="bg-black text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Sakkaram</h1>
      <div className="space-x-4">
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
      </div>
    </nav>
  );
};

export default Navbar;
