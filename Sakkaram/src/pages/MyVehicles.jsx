import React, { useState, useEffect } from 'react';
import {
  FaTractor,
  FaEdit,
  FaTrash,
  FaPlus,
  FaCalendarAlt,
  FaToggleOn,
  FaToggleOff,
} from 'react-icons/fa';
import {
  addVehicle as addVehicleAPI,
  fetchVehicles as getVehicles,
  fetchUserVehicles as getUserVehicle,
  toggleAvailability as changeAvailability,
  deleteVehicle as deleteUserVehicle,
  updateVehicle as updateUserVehicle,
} from '../api/vehicles';

const MyVehicles = () => {
  // Sample Data
  const [vehicles, setVehicles] = useState([
    {
      id: null,
      type: null,
      model: null,
      number: null,
      price: null,
      priceUnit: null,
      location: null,
      features: [],
      description: null,
      available: true,
      image: null,
    },
  ]);

  //get Vehicle list before page load
  useEffect(() => {
    const fetchVehicleList = async () => {
      try {
        const response = await getUserVehicle(); // Uncomment this when integrating API
        if (response.status === 200) {
          const vehicleList = await response.json();

          setVehicles(vehicleList);
        } else {
          console.log('failed to fetch vehicle list');
          setVehicles([]);
        }
      } catch (error) {
        console.error('Failed to fetch vehicle data:', error);
      }
    };

    fetchVehicleList();
  }, []);

  // State for New Vehicle Form
  const [newVehicle, setNewVehicle] = useState({
    type: '',
    model: '',
    number: '',
    price: '',
    priceUnit: 'hour',
    location: '',
    features: [],
    description: '',
    available: true,
    image: '',
  });

  const [editingVehicle, setEditingVehicle] = useState(null); // Track vehicle being edited
  const [showForm, setShowForm] = useState(false);
  const [featureInput, setFeatureInput] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editingVehicle) {
      setEditingVehicle({ ...editingVehicle, [name]: value });
    } else {
      setNewVehicle({ ...newVehicle, [name]: value });
    }
  };

  // Add Feature
  const addFeature = () => {
    if (!featureInput.trim()) return;

    if (editingVehicle) {
      setEditingVehicle({
        ...editingVehicle,
        features: [...editingVehicle.features, featureInput.trim()],
      });
    } else {
      setNewVehicle({
        ...newVehicle,
        features: [...newVehicle.features, featureInput.trim()],
      });
    }

    setFeatureInput('');
  };

  // Remove Feature
  const removeFeature = (index) => {
    if (editingVehicle) {
      const updatedFeatures = [...editingVehicle.features];
      updatedFeatures.splice(index, 1);
      setEditingVehicle({ ...editingVehicle, features: updatedFeatures });
    } else {
      const updatedFeatures = [...newVehicle.features];
      updatedFeatures.splice(index, 1);
      setNewVehicle({ ...newVehicle, features: updatedFeatures });
    }
  };

  // Add New Vehicle
  const addVehicle = async () => {
    // Basic validation
    if (
      !newVehicle.type ||
      !newVehicle.model ||
      !newVehicle.number ||
      !newVehicle.price
    ) {
      alert('Please fill in all required fields');
      return;
    }

    // Add default image if none provided
    let vehicleImage =
      newVehicle.image ||
      (newVehicle.type.toLowerCase().includes('tractor')
        ? 'https://www.mahindratractor.com/sites/default/files/styles/homepage_pslider_472x390_/public/2023-10/sp_plus.webp?itok=KtsUbJib'
        : newVehicle.type.toLowerCase().includes('harvester')
        ? 'https://5.imimg.com/data5/SELLER/Default/2023/3/294199762/CM/LZ/JS/186750549/bicycle-cranks-500x500.png'
        : 'https://5.imimg.com/data5/SELLER/Default/2022/1/SI/TP/NG/144593388/massey-ferguson-rotavator-500x500.jpg');

    const newVehicleData = {
      ...newVehicle,
      price: parseFloat(newVehicle.price),
      image: vehicleImage,
    };

    try {
      const response = await addVehicleAPI(newVehicleData); // Call the API function

      if (response.status === 201) {
        const savedVehicle = await response.json();

        setVehicles([...vehicles, savedVehicle]); // Update state with new vehicle

        console.log('Vehicle added successfully:', savedVehicle);

        // Reset form
        setNewVehicle({
          type: '',
          model: '',
          number: '',
          price: '',
          priceUnit: 'hour',
          location: '',
          features: [],
          description: '',
          available: true,
          image: '',
        });

        setShowForm(false);
      } else {
        console.log('Failed to add vehicle');
      }
    } catch (error) {
      console.error('Error adding vehicle:', error);
      alert('Failed to add vehicle. Please try again.');
    }
  };

  // Delete Vehicle
  const deleteVehicle = async (id) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) {
      return; // Stop execution if the user cancels the action
    }

    try {
      const response = await deleteUserVehicle(id); // Call the delete API

      if (response.status === 200)
        setVehicles(vehicles.filter((vehicle) => vehicle.id !== id));
      // Remove the vehicle from the UI state if the API call is successful
    } catch (error) {
      console.error('Error deleting vehicle:', error);
    }
  };

  // Edit Vehicle
  const startEditing = (vehicle) => {
    setEditingVehicle(vehicle);
    setShowForm(true);
  };

  // Update Vehicle
  // const updateVehicle = () => {
  //   // Basic validation
  //   if (
  //     !editingVehicle.type ||
  //     !editingVehicle.model ||
  //     !editingVehicle.number ||
  //     !editingVehicle.price
  //   ) {
  //     alert('Please fill in all required fields');
  //     return;
  //   }

  //   setVehicles(
  //     vehicles.map((v) =>
  //       v.id === editingVehicle.id
  //         ? {
  //             ...editingVehicle,
  //             price: parseFloat(editingVehicle.price),
  //           }
  //         : v
  //     )
  //   );

  //   setEditingVehicle(null);
  //   setShowForm(false);
  // };

  const updateVehicle = async () => {
    // Basic validation
    if (
      !editingVehicle.type ||
      !editingVehicle.model ||
      !editingVehicle.number ||
      !editingVehicle.price
    ) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const updatedVehicleData = {
        ...editingVehicle,
        price: parseFloat(editingVehicle.price), // Ensure price is a number
      };

      // Call API to update vehicle
      const response = await updateUserVehicle(
        editingVehicle.id,
        updatedVehicleData
      );
      if (response.status == 200) {
        const updatedVehicle = await response.json();

        // Update state only if API call succeeds
        setVehicles(
          vehicles.map((v) => (v.id === editingVehicle.id ? updatedVehicle : v))
        );

        setEditingVehicle(null);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error updating vehicle:', error);
      alert('An error occurred while updating the vehicle.');
    }
  };

  // // Toggle vehicle availability
  // const toggleAvailability = (id) => {
  //   setVehicles(
  //     vehicles.map((v) => (v.id === id ? { ...v, available: !v.available } : v))
  //   );
  // };

  const toggleAvailability = async (id) => {
    try {
      // Find the current vehicle state
      const vehicle = vehicles.find((v) => v.id === id);
      if (!vehicle) return;

      // Call the API with the updated availability status
      const response = await changeAvailability(id, !vehicle.available);
      if (response.status === 200) {
        // Update only the 'available' property in state
        setVehicles(
          vehicles.map((v) =>
            v.id === id ? { ...v, available: !v.available } : v
          )
        );
      }
    } catch (error) {
      console.error('Error toggling availability:', error);
    }
  };

  // Filter vehicles based on active tab
  const filteredVehicles = vehicles.filter((vehicle) => {
    if (activeTab === 'available') {
      return vehicle.available;
    } else if (activeTab === 'unavailable') {
      return !vehicle.available;
    }
    return true; // "all" tab
  });

  // Vehicle type options
  const vehicleTypes = [
    'Tractor',
    'Harvester',
    'Rotavator',
    'Sprayer',
    'Plough',
    'Cultivator',
    'Seeder',
  ];

  return (
    <div className="bg-gray-100 min-h-screen pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Vehicles</h1>
          <button
            onClick={() => {
              setEditingVehicle(null);
              setShowForm(!showForm);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center"
          >
            <FaPlus className="mr-2" />
            Add New Vehicle
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            {['all', 'available', 'unavailable'].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === tab
                    ? 'border-b-2 border-green-500 text-green-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Add/Edit Vehicle Form */}
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Type*
                </label>
                <select
                  name="type"
                  value={editingVehicle ? editingVehicle.type : newVehicle.type}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Type</option>
                  {vehicleTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Model Name*
                </label>
                <input
                  type="text"
                  name="model"
                  placeholder="e.g., Mahindra 575 DI"
                  value={
                    editingVehicle ? editingVehicle.model : newVehicle.model
                  }
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Number*
                </label>
                <input
                  type="text"
                  name="number"
                  placeholder="e.g., TN-01-1234"
                  value={
                    editingVehicle ? editingVehicle.number : newVehicle.number
                  }
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price*
                  </label>
                  <input
                    type="number"
                    name="price"
                    placeholder="e.g., 500"
                    value={
                      editingVehicle ? editingVehicle.price : newVehicle.price
                    }
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="w-1/3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit
                  </label>
                  <select
                    name="priceUnit"
                    value={
                      editingVehicle
                        ? editingVehicle.priceUnit
                        : newVehicle.priceUnit
                    }
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="hour">Per Hour</option>
                    <option value="day">Per Day</option>
                    <option value="acre">Per Acre</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location*
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g., Coimbatore"
                  value={
                    editingVehicle
                      ? editingVehicle.location
                      : newVehicle.location
                  }
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL (Optional)
                </label>
                <input
                  type="text"
                  name="image"
                  placeholder="https://example.com/image.jpg"
                  value={
                    editingVehicle ? editingVehicle.image : newVehicle.image
                  }
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Features
              </label>
              <div className="flex">
                <input
                  type="text"
                  placeholder="e.g., 45 HP"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-l-md"
                />
                <button
                  onClick={addFeature}
                  className="bg-green-600 text-white px-4 py-2 rounded-r-md hover:bg-green-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {(editingVehicle
                  ? editingVehicle.features
                  : newVehicle.features
                ).map((feature, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    <span>{feature}</span>
                    <button
                      onClick={() => removeFeature(index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Describe your vehicle, its condition, and any special features..."
                value={
                  editingVehicle
                    ? editingVehicle.description
                    : newVehicle.description
                }
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows="3"
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="available"
                  checked={
                    editingVehicle
                      ? editingVehicle.available
                      : newVehicle.available
                  }
                  onChange={(e) => {
                    if (editingVehicle) {
                      setEditingVehicle({
                        ...editingVehicle,
                        available: e.target.checked,
                      });
                    } else {
                      setNewVehicle({
                        ...newVehicle,
                        available: e.target.checked,
                      });
                    }
                  }}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  Available for Booking
                </span>
              </label>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingVehicle(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={editingVehicle ? updateVehicle : addVehicle}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                {editingVehicle ? 'Update Vehicle' : 'Add Vehicle'}
              </button>
            </div>
          </div>
        )}

        {/* Vehicle List */}
        {filteredVehicles.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FaTractor className="mx-auto text-gray-400 text-5xl mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No vehicles found
            </h3>
            <p className="text-gray-500 mb-4">
              {activeTab === 'available'
                ? "You don't have any available vehicles."
                : activeTab === 'unavailable'
                ? "You don't have any unavailable vehicles."
                : "You haven't added any vehicles yet."}
            </p>
            <button
              onClick={() => {
                setEditingVehicle(null);
                setShowForm(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
            >
              <FaPlus className="mr-2" />
              Add Your First Vehicle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <img
                    src={vehicle.image}
                    alt={vehicle.model}
                    className="w-full h-48 object-cover"
                  />
                  <div
                    className={`absolute top-0 right-0 ${
                      vehicle.available ? 'bg-green-500' : 'bg-red-500'
                    } text-white px-2 py-1 m-2 rounded-full text-xs font-medium`}
                  >
                    {vehicle.available ? 'Available' : 'Unavailable'}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-lg">{vehicle.model}</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {vehicle.type} • {vehicle.number}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <FaCalendarAlt className="mr-1" />
                    <span>{vehicle.location}</span>
                  </div>

                  <div className="mb-3">
                    <p className="font-bold text-green-600">
                      ₹{vehicle.price}/{vehicle.priceUnit}
                    </p>
                  </div>

                  {vehicle.features.length > 0 && (
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1">
                        {vehicle.features.map((feature, idx) => (
                          <span
                            key={idx}
                            className="inline-block bg-gray-100 px-2 py-1 rounded text-xs"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-4">
                    <button
                      onClick={() => toggleAvailability(vehicle.id)}
                      className={`flex items-center text-sm ${
                        vehicle.available ? 'text-red-600' : 'text-green-600'
                      }`}
                    >
                      {vehicle.available ? (
                        <>
                          <FaToggleOn className="mr-1" />
                          Set Unavailable
                        </>
                      ) : (
                        <>
                          <FaToggleOff className="mr-1" />
                          Set Available
                        </>
                      )}
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditing(vehicle)}
                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteVehicle(vehicle.id)}
                        className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyVehicles;
