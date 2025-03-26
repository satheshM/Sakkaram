import React, { useState, useEffect,useRef  } from 'react';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaIdCard,
  FaCalendarAlt,
  FaEdit,
  FaCamera,
  FaTractor,
  FaSeedling,
  FaWarehouse,
  FaMoneyBillWave,
  FaQrcode,
  FaUniversity,
  FaCreditCard,
  FaCheck,
} from 'react-icons/fa';
import { PostProfile, getProfile } from '../api/auth';


const Profile = () => {
  const inputRefs = useRef({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  //const [tempProfileData, setTempProfileData] = useState({});
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getProfile();
        const responseData = await response.json();
        const userData =responseData.user
        if (response.status === 200) {
          setProfileData(userData);
          inputRefs.current = { ...userData };
        } else {
          console.log('User data fetching failed!');
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);


  // const startEditing = () => {
  //   setTempProfileData(profileData); // Clone saved profile data
  //   setIsEditing(true);
  // };

  // const cancelEditing = () => {
  //   setTempProfileData(profileData); // Reset unsaved changes
  //   setIsEditing(false);
  // };
  

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setTempProfileData((prev) => ({ ...prev, [name]: value }));
  // };

  const handleChange = (e) => {
    if (!inputRefs.current) inputRefs.current = {}; // ✅ Ensure initialization
    inputRefs.current[e.target.name] = e.target.value;
  };
  


  
  

  // const handleImageChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     setSelectedFile(file);
  //     setTempProfileData((prev) => ({
  //       ...prev,
  //       profilePic: URL.createObjectURL(file),
  //     }));
  //   }
  // };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
  
    if (file) {
      setSelectedFile(file);
      inputRefs.current.profilePic = URL.createObjectURL(file);
      
      // ✅ Store temporary preview in local state
      setProfileData((prev) => ({
        ...prev,
        profilePic: URL.createObjectURL(file),
      }));
    }
  };
  
  

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
   
  //   setProfileData(tempProfileData) 
  //   try {
     
  //     let dataToSend = tempProfileData;
  //     if (selectedFile) {
  //       const formData = new FormData();
  //       formData.append('profilePic', selectedFile);
  //       Object.keys(tempProfileData).forEach(key => {
  //         if (key !== 'profilePic') {
  //           formData.append(key, tempProfileData[key]);
  //         }
  //       });
  //       dataToSend = formData;
  //     }

  //     const resp = await PostProfile(dataToSend);
  //     if (resp.status === 200) {
  //       setShowSuccessModal(true);
  //       setTimeout(() => {
  //         setShowSuccessModal(false);
  //         setIsEditing(false);
  //       }, 2000);
  //     }
  //   } catch (error) {
  //     console.error('Failed to update profile:', error);
  //   }
  // };


  const handleSubmit = async (e) => {
    e.preventDefault();
   
  
    // ✅ Directly use inputRefs.current instead of tempProfileData
    let dataToSend = { ...profileData, ...inputRefs.current };
 
  
    if (selectedFile) {
      const formData = new FormData();
      formData.append('profilePic', selectedFile);
      Object.keys(inputRefs.current).forEach((key) => {
        if (key !== 'profilePic') {
          formData.append(key, inputRefs.current[key]);
        }
      });
      dataToSend = formData;
    }
  
    try {
      const resp = await PostProfile(dataToSend);
      if (resp.status === 200) {
        setProfileData({ ...profileData, ...inputRefs.current }); // ✅ Update state after API call
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          setIsEditing(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };
  


  const InputField = ({ icon: Icon, label, name, value, type = "text", readOnly = false, options = null, ...props }) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="text-green-500" />
        </div>
        {options ? (
          <select
            name={name}
            defaultValue={value || ''}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            {...props}
          >
            <option defaultValue="">Select {label}</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            defaultValue={value || ''}
            className={`block w-full pl-10 pr-3 py-2 border ${readOnly ? 'bg-gray-50' : 'bg-white'} border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500`}
            readOnly={readOnly}
            {...props}
          />
        )}
      </div>
    </div>
  );

  const InfoCard = ({ icon: Icon, label, value }) => (
    <div className="flex items-start space-x-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:border-green-500 transition-colors">
      <div className="rounded-full p-2 bg-green-100 text-green-600">
        <Icon className="text-xl" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium text-gray-900">{value || 'Not Available'}</p>
      </div>
    </div>
  );

  const ProfileHeader = () => (
    <div className="relative bg-gradient-to-r from-green-600 to-green-400 h-48 rounded-t-lg flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-6 gap-4 p-4">
          {Array(18).fill(null).map((_, i) => (
            <FaTractor key={i} className="text-white text-3xl transform rotate-45" />
          ))}
        </div>
      </div>
      
      <div className="absolute  left-6 border-4 border-white rounded-full overflow-hidden h-32 w-32 bg-white shadow-lg">
        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 rounded-full overflow-hidden">
          {profileData.profilePic ? (
            <img
              src={profileData.profilePic}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          ) : (
            <FaUser className="text-green-600 text-6xl" />
          )}
        </div>

        {isEditing && (
          <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer hover:bg-opacity-70 transition-opacity">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <div className="text-center">
              <FaCamera className="text-white text-xl mx-auto mb-1" />
              <span className="text-white text-xs">
                Change Photo
              </span>
            </div>
          </label>
        )}
      </div>

      <button
        onClick={() => {
          setIsEditing((prev) => !prev);
          // setTempProfileData(profileData);
        }}
        
        className="absolute top-4 right-4 bg-white text-green-600 px-4 py-2 rounded-full hover:bg-green-50 flex items-center gap-2 shadow-md transition-colors"
      >
        <FaEdit className="text-lg" />
        {isEditing ? 'Cancel Edit' : 'Edit Profile'}
      </button>

      <div className="text-white text-center z-10">
        <h1 className="text-3xl font-bold mb-2">{profileData.name || 'Your Profile'}</h1>
        <p className="text-green-100">{profileData.role === 'vehicle_owner' ? 'Agricultural Vehicle Owner' : 'Farmer'}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <ProfileHeader />

          <div className="pt-20 px-6 pb-6">
            {isLoading ? (
              <div className="space-y-6">
                <div className="h-48 bg-gray-200 rounded animate-pulse" />
                <div className="h-48 bg-gray-200 rounded animate-pulse" />
              </div>
            ) : isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    icon={FaUser}
                    label="Full Name"
                    name="name"
                    defaultValue={profileData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                  />
                  <InputField
                    icon={FaEnvelope}
                    label="Email Address"
                    name="email"
                    defaultValue={profileData.email}
                    readOnly
                    type="email"
                  />
                  <InputField
                    icon={FaPhone}
                    label="Phone Number"
                    name="phone"
                    defaultValue={profileData.phone}
                    onChange={handleChange}
                    type="tel"
                  />
                  <InputField
                    icon={FaMapMarkerAlt}
                    label="Address"
                    name="address"
                    defaultValue={profileData.address}
                    onChange={handleChange}
                  />
                  <InputField
                    icon={FaIdCard}
                    label="ID Type"
                    name="idType"
                    defaultValue={profileData.idType}
                    onChange={handleChange}
                    options={["Aadhaar Card", "PAN Card", "Driving License", "Voter ID"]}
                  />
                  <InputField
                    icon={FaIdCard}
                    label="ID Number"
                    name="idNumber"
                    defaultValue={profileData.idNumber}
                    onChange={handleChange}
                  />
                </div>

                {profileData.role === 'vehicle_owner' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      <FaMoneyBillWave className="text-green-500" />
                      Payment Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField
                        icon={FaUniversity}
                        label="Bank Name"
                        name="bankName"
                        defaultValue={profileData.bankName}
                        onChange={handleChange}
                      />
                      <InputField
                        icon={FaCreditCard}
                        label="Account Number"
                        name="accountNumber"
                        defaultValue={profileData.accountNumber}
                        onChange={handleChange}
                      />
                      <InputField
                        icon={FaQrcode}
                        label="IFSC Code"
                        name="ifscCode"
                        defaultValue={profileData.ifscCode}
                        onChange={handleChange}
                      />
                      <InputField
                        icon={FaMoneyBillWave}
                        label="UPI ID"
                        name="upiId"
                        defaultValue={profileData.upiId}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      <FaSeedling className="text-green-500" />
                      Personal Information
                    </h3>
                    <div className="grid gap-4">
                      <InfoCard icon={FaUser} label="Full Name" value={profileData.name} />
                      <InfoCard icon={FaEnvelope} label="Email" value={profileData.email} />
                      <InfoCard icon={FaPhone} label="Phone" value={profileData.phone} />
                      <InfoCard icon={FaMapMarkerAlt} label="Address" value={profileData.address} />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      <FaWarehouse className="text-green-500" />
                      Account Information
                    </h3>
                    <div className="grid gap-4">
                      <InfoCard icon={FaIdCard} label="ID Type" value={profileData.idType} />
                      <InfoCard icon={FaIdCard} label="ID Number" value={profileData.idNumber} />
                      <InfoCard icon={FaCalendarAlt} label="Joined" value={profileData.createdAt} />
                      <InfoCard icon={FaTractor} label="Account Type" value={profileData.role === 'vehicle_owner' ? 'Vehicle Owner' : 'Farmer'} />
                    </div>
                  </div>
                </div>

                {profileData.role === 'vehicle_owner' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      <FaMoneyBillWave className="text-green-500" />
                      Payment Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InfoCard icon={FaUniversity} label="Bank Name" value={profileData.bankName} />
                      <InfoCard
                        icon={FaCreditCard}
                        label="Account Number"
                        value={profileData.accountNumber ? '••••••' + profileData.accountNumber.slice(-4) : 'Not Available'}
                      />
                      <InfoCard icon={FaQrcode} label="IFSC Code" value={profileData.ifscCode} />
                      <InfoCard icon={FaMoneyBillWave} label="UPI ID" value={profileData.upiId} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 text-center">
            <div className="fixed inset-0 bg-black opacity-30" />
            <div className="inline-block align-middle bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <FaCheck className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">
                  Profile Updated Successfully!
                </h3>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;