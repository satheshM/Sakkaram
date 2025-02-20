import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaUser, FaHistory, FaWallet, FaGift, 
  FaHeadset, FaCog, FaSignOutAlt, FaTractor, 
  FaChartLine, FaTruck 
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext"; // Import Auth Context

const ProfileSidebar = () => {
  const navigate = useNavigate();
  const { role, user, logout } = useAuth(); // Get user data

  // Define menu options based on role
  const menuOptions = role === "farmer"
    ? [
        { icon: FaHistory, text: "Booking History", path: "/bookings" },
        { icon: FaTractor, text: "My Vehicles", path: "/my-vehicles" },
        { icon: FaWallet, text: "Wallet & Payments", path: "/wallet" },
        { icon: FaGift, text: "Rewards & Discounts", path: "/rewards" },
        { icon: FaHeadset, text: "Help & Support", path: "/support" },
        { icon: FaCog, text: "Settings", path: "/settings" },
      ]
    : [
        { icon: FaChartLine, text: "Earnings & Transactions", path: "/earnings" },
        { icon: FaTruck, text: "My Vehicles & Availability", path: "/my-vehicles" },
        { icon: FaWallet, text: "Wallet & Payments", path: "/wallet" },
        { icon: FaGift, text: "Incentives & Rewards", path: "/rewards" },
        { icon: FaHeadset, text: "Help & Support", path: "/support" },
        { icon: FaCog, text: "Settings", path: "/settings" },
      ];

  return (
    <div className="w-64 bg-white shadow-lg p-6">
      {/* Profile Section */}
      <div className="flex flex-col items-center text-center mb-6">
        <img
          src={user?.profilePic || "/default-avatar.png"} // Show default if no profile pic
          alt="User"
          className="w-20 h-20 rounded-full border-2 border-green-500"
        />
        <h2 className="text-xl font-bold mt-3">{user?.name || "Guest User"}</h2>
        <p className="text-gray-500 text-sm">{user?.phone || "No Phone"}</p>
      </div>

      {/* Sidebar Menu */}
      <nav className="space-y-4">
        {menuOptions.map(({ icon: Icon, text, path }) => (
          <ProfileLink key={text} Icon={Icon} text={text} onClick={() => navigate(path)} />
        ))}
        <ProfileLink Icon={FaSignOutAlt} text="Logout" className="text-red-500" onClick={logout} />
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
