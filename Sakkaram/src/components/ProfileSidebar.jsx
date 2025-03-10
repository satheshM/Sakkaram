import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaUser,
  FaHistory,
  FaWallet,
  FaGift,
  FaHeadset,
  FaCog,
  FaSignOutAlt,
  FaTractor,
  FaChartLine,
  FaTruck,
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext'; // Import Auth Context

const ProfileSidebar = () => {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth(); // Get user data

  console.log(user);

  // Define menu options based on role
  const menuOptions =
    role === 'farmer'
      ? [
          { icon: FaHistory, text: 'Booking History', path: '/booking' },
          { icon: FaWallet, text: 'Wallet & Payments', path: '/wallet' },
          { icon: FaGift, text: 'Rewards & Discounts', path: '/rewards' },
          { icon: FaHeadset, text: 'Help & Support', path: '/support' },
          { icon: FaCog, text: 'Settings', path: '/settings' },
        ]
      : [
          {
            icon: FaChartLine,
            text: 'Earnings & Transactions',
            path: '/earnings',
          },
          {
            icon: FaTruck,
            text: 'My Vehicles & Availability',
            path: '/my-vehicles',
          },
          {
            icon: FaHistory,
            text: 'Booking Requests',
            path: '/owner-bookings',
          },
          { icon: FaWallet, text: 'Wallet & Payments', path: '/wallet' },
          { icon: FaHeadset, text: 'Help & Support', path: '/support' },
          { icon: FaCog, text: 'Settings', path: '/settings' },
        ];

  return (
    <div className="w-64 bg-white shadow-lg p-6">
      {/* Profile Section */}
      <div className="flex flex-col items-center text-center mb-6">
        <img
          src={
            user?.profilePic ||
            'https://imgs.search.brave.com/S7z1RT6LuPmmNH3jE_cazeFSVQg_D0Nx6AqeMKIitYI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/dmVjdG9yc3RvY2su/Y29tL2kvcHJldmll/dy0xeC8wMS83MS9m/ZW1hbGUtYXZhdGFy/LXdlYi1wcm9maWxl/LWdlbmVyaWMtd29t/YW4taW1hZ2UtdmVj/dG9yLTQyMDAwMTcx/LmpwZw'
          } // Show default if no profile pic
          alt="User"
          className="w-20 h-20 rounded-full border-2 border-green-500"
        />
        <h2 className="text-xl font-bold mt-3">
          {user?.name || user?.user || 'Guest User'}
        </h2>
        <p className="text-gray-500 text-sm">{user?.phone || 'Add Phoneno'}</p>
        <p className="text-green-600 text-sm font-semibold mt-1">
          {role === 'farmer' ? 'Farmer' : 'Vehicle Owner'}
        </p>
      </div>

      {/* Sidebar Menu */}
      <nav className="space-y-4">
        {menuOptions.map(({ icon: Icon, text, path }) => (
          <ProfileLink
            key={text}
            Icon={Icon}
            text={text}
            onClick={() => navigate(path)}
          />
        ))}
        <ProfileLink
          Icon={FaSignOutAlt}
          text="Logout"
          className="text-red-500"
          onClick={logout}
        />
      </nav>
    </div>
  );
};

// Reusable Profile Link Component
const ProfileLink = ({ Icon, text, onClick, className }) => (
  <div
    className={`flex items-center space-x-3 p-3 hover:bg-gray-200 rounded cursor-pointer ${className}`}
    onClick={onClick}
  >
    <Icon className="text-green-500 text-lg" />
    <span className="text-gray-700">{text}</span>
  </div>
);

export default ProfileSidebar;