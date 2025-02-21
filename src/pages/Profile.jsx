import React from "react";
import ProfileSidebar from "../components/ProfileSidebar";
import { useAuth } from "../context/AuthContext";
 

const Profile = () => {
  const userRole = "farmer"; // Change to "owner" or "farmer" based on role

  return (
    <div className="min-h-screen bg-gray-100 flex mt-16"> {/* Add mt-16 */}
      {/* Sidebar */}
      <ProfileSidebar role={userRole} />

      {/* Main Content */}
      <div className="flex-1 p-10">
        <h1 className="text-3xl font-bold">
          {/* Welcome, {userRole === "farmer" ? "Farmer!" : "Vehicle Owner!"} */}
          Welcome, test --{userRole}
        </h1>
        <p className="text-gray-600">Manage your profile and bookings here.</p>
      </div>
    </div>
  );
};

export default Profile;
