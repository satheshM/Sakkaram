import React from "react";
import { FaUser, FaHistory, FaWallet, FaGift, FaHeadset, FaCog, FaSignOutAlt, FaTractor, FaChartLine, FaTruck } from "react-icons/fa";

const ProfileSidebar = ({ role }) => {
  // Define menu options based on role
  const menuOptions = role === "farmer"
    ? [
        { icon: FaHistory, text: "Booking History" },
        { icon: FaTractor, text: "My Vehicles" },
        { icon: FaWallet, text: "Wallet & Payments" },
        { icon: FaGift, text: "Rewards & Discounts" },
        { icon: FaHeadset, text: "Help & Support" },
        { icon: FaCog, text: "Settings" },
      ]
    : [
        { icon: FaChartLine, text: "Earnings & Transactions" },
        { icon: FaTruck, text: "My Vehicles & Availability" },
        { icon: FaWallet, text: "Wallet & Payments" },
        { icon: FaGift, text: "Incentives & Rewards" },
        { icon: FaHeadset, text: "Help & Support" },
        { icon: FaCog, text: "Settings" },
      ];

  return (
    <div className="w-64 bg-white shadow-lg p-6">
      {/* Profile Section */}
      <div className="flex flex-col items-center text-center mb-6">
        <img
          src="../assets/images/farmerdp.jpeg" // Replace with actual user profile picture
         
          alt="User"
          className="w-20 h-20 rounded-full border-2 border-green-500"
        />
        <h2 className="text-xl font-bold mt-3">John Doe</h2>
        <p className="text-gray-500 text-sm">+91 98765 43210</p>
      </div>

      {/* Sidebar Menu */}
      <nav className="space-y-4">
        {menuOptions.map(({ icon: Icon, text }) => (
          <ProfileLink key={text} Icon={Icon} text={text} />
        ))}
        <ProfileLink Icon={FaSignOutAlt} text="Logout" className="text-red-500" />
      </nav>
    </div>
  );
};

// Reusable Profile Link Component
const ProfileLink = ({ Icon, text, className }) => (
  <div className={`flex items-center space-x-3 p-3 hover:bg-gray-200 rounded cursor-pointer ${className}`}>
    <Icon className="text-green-500 text-lg" />
    <span className="text-gray-700">{text}</span>
  </div>
);

export default ProfileSidebar;
