
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





// old 2

// import React, { useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { FiMenu, FiX } from "react-icons/fi";

// const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [isOpen, setIsOpen] = useState(true); // Set default to true for always-visible menu

//   const toggleMenu = () => setIsOpen(!isOpen);

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     setIsAuthenticated(false);
//     navigate("/");
//   };

//   return (
//     <nav className="bg-black text-white p-4 flex justify-between items-center fixed top-0 left-0 w-full z-50">
//       {/* Logo */}
//       <h1 className="text-xl font-bold">Sakkaram</h1>

//       {/* Menu Button (Always Visible) */}
//       <div>
//         <button onClick={toggleMenu} className="text-white text-2xl">
//           {isOpen ? <FiX /> : <FiMenu />}
//         </button>
//       </div>

//       {/* Horizontal Toggle Menu (Fixed Position & Always Visible) */}
//       <div
//         className={`absolute top-0 right-0 bg-black text-white px-6 py-3 flex items-center gap-4 transition-transform duration-300 ${
//           isOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//         style={{ height: "100%", whiteSpace: "nowrap" }}
//       >
//         {/* Static Menu Items */}
//         <Link
//           to="/"
//           className={`px-3 py-2 rounded ${
//             location.pathname === "/" ? "bg-green-500 text-black" : "hover:text-green-400"
//           }`}
//         >
//           Home
//         </Link>
//         <Link
//           to="/vehicles"
//           className={`px-3 py-2 rounded ${
//             location.pathname === "/vehicles" ? "bg-green-500 text-black" : "hover:text-green-400"
//           }`}
//         >
//           Find Vehicles
//         </Link>

//         {/* Show Bookings & Profile only if authenticated */}
//         {isAuthenticated && (
//           <>
//             <Link
//               to="/booking"
//               className={`px-3 py-2 rounded ${
//                 location.pathname === "/booking" ? "bg-green-500 text-black" : "hover:text-green-400"
//               }`}
//             >
//               Bookings
//             </Link>
//             <Link
//               to="/profile"
//               className={`px-3 py-2 rounded ${
//                 location.pathname === "/profile" ? "bg-green-500 text-black" : "hover:text-green-400"
//               }`}
//             >
//               Profile
//             </Link>
//             <button
//               onClick={handleLogout}
//               className="px-3 py-2 rounded bg-red-500 text-white hover:bg-red-600"
//             >
//               Logout
//             </button>
//           </>
//         )}

//         {/* Show Login & Signup if NOT authenticated */}
//         {!isAuthenticated && (
//           <>
//             <Link
//               to="/login"
//               className={`px-3 py-2 rounded ${
//                 location.pathname === "/login" ? "bg-green-500 text-black" : "hover:text-green-400"
//               }`}
//             >
//               Login
//             </Link>
//             <Link
//               to="/signup"
//               className={`px-3 py-2 rounded ${
//                 location.pathname === "/signup" ? "bg-green-500 text-black" : "hover:text-green-400"
//               }`}
//             >
//               Signup
//             </Link>
//           </>
//         )}

//         {/* Close Button (Only Closes on Clicking "X") */}
//         <button onClick={toggleMenu} className="text-white text-2xl">
//           <FiX />
//         </button>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

