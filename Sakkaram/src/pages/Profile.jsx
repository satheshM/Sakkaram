import React, { useState, useEffect } from 'react';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaIdCard,
  FaCalendarAlt,
  FaEdit,
  FaCamera,
} from 'react-icons/fa';
import ProfileSidebar from '../components/ProfileSidebar';
import { PostProfile, getProfile } from '../api/auth';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: null,
    email: null,
    phone: null,
    address: null,
    idType: null,
    idNumber: null,
    createdAt: null,
    profilePic: '',
    bankName: null,
    accountNumber: null,
    ifscCode: null,
    upiId: null,
  });

  // Initialize profile data from user context
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getProfile(); // Uncomment this when integrating API
        const userData = await response.json();
        if (response.status === 200) {
          setProfileData(userData);
        } else {
          console.log('user data fetching failed!');
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // In a real app, this would send the updated profile to the server
    const resp = await PostProfile(profileData);
    console.log('API Response' + resp);
    console.log('Updated profile:', profileData);
    setIsEditing(false);
  };

  return (
    <div className="bg-gray-100 min-h-screen pt-20 pb-10 flex">
      {/* Sidebar */}
      <div className="hidden md:block">{/* <ProfileSidebar /> */}</div>

      {/* Main Content */}
      <div className="flex-1 px-4 md:px-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {isEditing ? 'Edit Profile' : 'Your Profile'}
        </h1>

        <div className="bg-white rounded-lg shadow-md overflow-hidden  w-30 h-35 p-4 mx-auto">
          {/* Profile Header */}
          <div className="relative bg-green-600 h-32 flex items-center justify-center">
            <h1 className="text-white text-5xl font-bold uppercase">
              {profileData.role}
            </h1>
            {/*Header Wave */}
            {isEditing && (
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent 
                  animate-wave"
              ></div>
            )}

            <div className="absolute -bottom-16 left-6 border-4 border-white rounded-full overflow-hidden h-32 w-32 bg-white">
              <div className="h-full w-full flex items-center justify-center bg-gray-200 rounded-full overflow-hidden">
                {profileData.profilePic ? (
                  <img
                    src={profileData.profilePic}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FaUser className="text-gray-400 text-6xl" />
                )}
              </div>

              {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer">
                  <FaCamera className="text-white text-xl" />
                </div>
              )}
            </div>
            <button
              onClick={() => setIsEditing((prev) => !prev)}
              className="absolute top-4 right-4 bg-white text-green-600 p-2 rounded-full hover:bg-gray-100 flex items-center gap-1"
            >
              <FaEdit className="text-lg" /> {isEditing ? 'Editing' : 'Edit'}
            </button>
          </div>

          {/* Profile Content */}
          <div className="pt-20 px-6 pb-6">
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={profileData.name || ''}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email || ''}
                        onChange={handleChange}
                        placeholder="Not Available"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 bg-gray-100"
                        readOnly
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaPhone className="text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone || ''}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        placeholder="Your phone number"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaMapMarkerAlt className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="address"
                        value={profileData.address || ''}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        placeholder="Your address"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ID Type
                    </label>
                    <select
                      name="idType"
                      value={profileData.idType || 'Not Available'}
                      onChange={handleChange}
                      className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="Aadhaar">Aadhaar Card</option>
                      <option value="PAN">PAN Card</option>
                      <option value="Voter">Voter ID</option>
                      <option value="Driving">Driving License</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ID Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaIdCard className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="idNumber"
                        value={profileData.idNumber || ''}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        placeholder="Your ID numbers"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Information (Only for vehicle owners) */}
                {profileData.role === 'vehicle_owner' && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      Payment Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bank Name
                        </label>
                        <input
                          type="text"
                          name="bankName"
                          value={profileData.bankName || ''}
                          onChange={handleChange}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                          placeholder="Your bank name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Account Number
                        </label>
                        <input
                          type="text"
                          name="accountNumber"
                          value={profileData.accountNumber || ''}
                          onChange={handleChange}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                          placeholder="Your account number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          IFSC Code
                        </label>
                        <input
                          type="text"
                          name="ifscCode"
                          value={profileData.ifscCode || ''}
                          onChange={handleChange}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                          placeholder="Bank IFSC code"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          UPI ID
                        </label>
                        <input
                          type="text"
                          name="upiId"
                          value={profileData.upiId || ''}
                          onChange={handleChange}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                          placeholder="Your UPI ID"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      Personal Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <FaUser className="text-green-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Full Name</p>
                          <p className="font-medium">
                            {profileData.name || 'Not Available'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <FaEnvelope className="text-green-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Email Address</p>
                          <p className="font-medium">
                            {profileData.email || 'Not Available'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <FaPhone className="text-green-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Phone Number</p>
                          <p className="font-medium">
                            {profileData.phone || 'Not Available'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="text-green-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Address</p>
                          <p className="font-medium">
                            {profileData.address || 'Not Availables'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      Account Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <FaIdCard className="text-green-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">ID Type</p>
                          <p className="font-medium">
                            {profileData.idType || 'Not Available'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <FaIdCard className="text-green-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">ID Number</p>
                          <p className="font-medium">
                            {profileData.idNumber || 'Not Availables'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <FaCalendarAlt className="text-green-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Joined</p>
                          <p className="font-medium">
                            {profileData.createdAt || 'Not Available'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <svg
                          className="text-green-500 mr-3 h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                        <div>
                          <p className="text-sm text-gray-500">Account Type</p>
                          <p className="font-medium">{profileData.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Information (Only for vehicle owners) */}
                {profileData.role === 'vehicle_owner' && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      Payment Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <svg
                            className="text-green-500 mr-3 h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                            />
                          </svg>
                          <div>
                            <p className="text-sm text-gray-500">Bank Name</p>
                            <p className="font-medium">
                              {profileData.bankName || 'Not Available'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <svg
                            className="text-green-500 mr-3 h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                          <div>
                            <p className="text-sm text-gray-500">
                              Account Number
                            </p>
                            <p className="font-medium">
                              {profileData.accountNumber
                                ? '••••••' + profileData.accountNumber.slice(-4)
                                : 'Not Available'}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <svg
                            className="text-green-500 mr-3 h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          <div>
                            <p className="text-sm text-gray-500">IFSC Code</p>
                            <p className="font-medium">
                              {profileData.ifscCode || 'Not Available'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <svg
                            className="text-green-500 mr-3 h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                          <div>
                            <p className="text-sm text-gray-500">UPI ID</p>
                            <p className="font-medium">
                              {profileData.upiId || 'Not Available'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
