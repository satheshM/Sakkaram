import React, { useState, useEffect } from 'react';
import {
  FaMapMarkerAlt,
  FaRupeeSign,
  FaStar,
  FaFilter,
  FaSearch,
} from 'react-icons/fa';

import { fetchVehicles as GetVehicleList } from '../api/vehicles';
import { createBooking } from '../api/Bookings';

//const { user } = useAuth();

// Sample data for vehicles
// const vehiclesData = [
//   {
//     id: 1,
//     name: "Mahindra 575 DI",
//     type: "Tractor",
//     price: 500,
//     priceUnit: "hour",
//     location: "Coimbatore",
//     distance: 5,
//     rating: 4.8,
//     reviews: 24,
//     owner: "Ramesh Kumar",
//     ownerRating: 4.9,
//     image: "https://5.imimg.com/data5/SELLER/Default/2021/12/QO/YC/XG/52189282/mahindra-575-di-tractor.jpg",
//     features: ["45 HP", "4-Wheel Drive", "Power Steering"],
//     availability: "Available Now",
//     description: "Well-maintained Mahindra tractor with all accessories. Perfect for plowing and transportation."
//   },
//   {
//     id: 2,
//     name: "John Deere Harvester",
//     type: "Harvester",
//     price: 1200,
//     priceUnit: "hour",
//     location: "Salem",
//     distance: 8,
//     rating: 4.7,
//     reviews: 18,
//     owner: "Suresh Patel",
//     ownerRating: 4.8,
//     image: "https://5.imimg.com/data5/SELLER/Default/2021/1/KO/FV/IY/3042719/john-deere-w70-self-propelled-combine-harvester-500x500.jpg",
//     features: ["110 HP", "Grain Tank", "AC Cabin"],
//     availability: "Available from Tomorrow",
//     description: "High-performance harvester for efficient crop collection. Includes operator if needed."
//   },
//   {
//     id: 3,
//     name: "Swaraj 744 FE",
//     type: "Tractor",
//     price: 550,
//     priceUnit: "hour",
//     location: "Madurai",
//     distance: 12,
//     rating: 4.6,
//     reviews: 15,
//     owner: "Mahesh Singh",
//     ownerRating: 4.7,
//     image: "https://5.imimg.com/data5/SELLER/Default/2022/9/SY/OM/QG/159745018/swaraj-744-fe-tractor-500x500.jpg",
//     features: ["48 HP", "Power Steering", "Oil Immersed Brakes"],
//     availability: "Available Now",
//     description: "Reliable Swaraj tractor suitable for all farming operations. Fuel efficient and powerful."
//   },
//   {
//     id: 4,
//     name: "Massey Ferguson Rotavator",
//     type: "Rotavator",
//     price: 350,
//     priceUnit: "hour",
//     location: "Trichy",
//     distance: 15,
//     rating: 4.5,
//     reviews: 12,
//     owner: "Ganesh Kumar",
//     ownerRating: 4.6,
//     image: "https://5.imimg.com/data5/SELLER/Default/2022/1/SI/TP/NG/144593388/massey-ferguson-rotavator-500x500.jpg",
//     features: ["42 Blades", "Heavy Duty", "Adjustable Depth"],
//     availability: "Available from Next Week",
//     description: "Professional rotavator for soil preparation. Can be attached to any standard tractor."
//   },
//   {
//     id: 5,
//     name: "Sonalika Sprayer",
//     type: "Sprayer",
//     price: 300,
//     priceUnit: "hour",
//     location: "Coimbatore",
//     distance: 6,
//     rating: 4.4,
//     reviews: 9,
//     owner: "Rajesh Verma",
//     ownerRating: 4.5,
//     image: "https://5.imimg.com/data5/SELLER/Default/2021/12/UZ/VO/OC/9853748/tractor-mounted-sprayer-500x500.jpg",
//     features: ["500L Tank", "12m Boom", "Pressure Control"],
//     availability: "Available Now",
//     description: "Efficient sprayer for pesticides and fertilizers. Covers large areas quickly and evenly."
//   },
//   {
//     id: 6,
//     name: "New Holland Tractor",
//     type: "Tractor",
//     price: 600,
//     priceUnit: "hour",
//     location: "Salem",
//     distance: 9,
//     rating: 4.9,
//     reviews: 28,
//     owner: "Vijay Kumar",
//     ownerRating: 5.0,
//     image: "https://5.imimg.com/data5/SELLER/Default/2021/12/ZD/VP/QG/91331296/new-holland-3630-tractor-500x500.jpg",
//     features: ["55 HP", "4-Wheel Drive", "Synchromesh Transmission"],
//     availability: "Available Now",
//     description: "Premium New Holland tractor with excellent performance. Includes implements on request."
//   },
// ];

const VehicleList = () => {
  const [vehiclesData, setvehiclesData] = useState([]);
  const [location, setLocation] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [sortBy, setSortBy] = useState('distance');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingDuration, setBookingDuration] = useState('1');

  const transformVehicleData = (backendData) => {
    return backendData.map((vehicle) => ({
      available: vehicle.available ? 'Available Now' : 'Not Available',
      description: vehicle.description,
      distance: vehicle.distance || 0, // Default to 0 if missing
      features: vehicle.features || [],
      id: vehicle.id,
      image: vehicle.image,
      location: vehicle.location,
      model: vehicle.model, // Rename `model` → `name`
      owner: vehicle.owner, // This might be an email; adjust if necessary
      ownerRating: vehicle.ownerRating || 4.5, // Default rating if missing
      price: vehicle.price,
      priceUnit: vehicle.priceUnit,
      rating: vehicle.rating || 4.5, // Default rating if missing
      reviews: vehicle.reviews || 0, // Default to 0 if missing
      type: vehicle.type,
    }));
  };

  useEffect(() => {
    const fetchAllVehicleList = async () => {
      try {
        const response = await GetVehicleList();

        if (response.status === 200) {
          const AllvehiclesData = await response.json();

          const transformedData = transformVehicleData(AllvehiclesData);

          setvehiclesData(transformedData); // ✅ Store fetched data in state
        }
      } catch (error) {
        console.error('Failed to fetch vehicle data:', error);
      }
    };

    fetchAllVehicleList();
  }, []);

  // Filter vehicles based on selections
  const filteredVehicles = vehiclesData.filter((vehicle) => {
    // Filter by type if any selected
    if (selectedTypes.length > 0 && !selectedTypes.includes(vehicle.type)) {
      return false;
    }

    // Filter by price range
    if (vehicle.price < priceRange[0] || vehicle.price > priceRange[1]) {
      return false;
    }

    // Filter by search query (name, type, or location)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        vehicle.model.toLowerCase().includes(query) ||
        vehicle.type.toLowerCase().includes(query) ||
        vehicle.location.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Sort vehicles
  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return a.distance - b.distance; // Default: sort by distance
  });

  // Handle filter change for vehicle types
  const handleTypeChange = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  // Handle booking a vehicle
  const handleBooking = (vehicle) => {
    setSelectedVehicle(vehicle);

    // In a real app, this would open a booking modal or navigate to a booking page
  };

  // Vehicle types for filter
  const vehicleTypes = [
    'Tractor',
    'Harvester',
    'Rotavator',
    'Sprayer',
    'Plough',
  ];

  //handle Bookings

  const handleConfirmBooking = async () => {
    if (!selectedVehicle || !bookingDate || !bookingDuration) {
      alert('Please select a date and duration before confirming the booking.');
      return;
    }

    const totalPrice = selectedVehicle.price * parseInt(bookingDuration);
    console.log('useAuthUser');
    const bookingData = {
      //userId, // Replace this with actual user ID from authentication
      vehicleId: selectedVehicle.id,
      vehicleModel: selectedVehicle.model,
      vehicleType: selectedVehicle.type,
      location: selectedVehicle.location,
      distance: selectedVehicle.distance,
      pricePerHour: selectedVehicle.price,
      image: selectedVehicle.image,
      bookingDate,
      duration: bookingDuration,
      totalPrice,
      status: 'Pending',
      owner: selectedVehicle.owner,
    };

    try {
      const response = await createBooking(bookingData);

      alert('Booking confirmed successfully!');
      setSelectedVehicle(null); // Close modal after booking
    } catch (error) {
      console.error('Error booking vehicle:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center py-8 px-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Find and Book Agricultural Vehicles
          </h1>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Browse our selection of tractors, harvesters, and other farm
            equipment available for rent in your area.
          </p>

          {/* Search Bar */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-3xl mx-auto">
            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaMapMarkerAlt className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Enter your location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search vehicles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <button
              className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition-colors"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter className="inline mr-2" />
              Filters
            </button>
          </div>
        </div>

        {/* Filters Section - Collapsible */}
        {showFilters && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8 transition-all">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Vehicle Type Filter */}
              <div>
                <h3 className="font-semibold mb-3">Vehicle Type</h3>
                <div className="flex flex-wrap gap-2">
                  {vehicleTypes.map((type) => (
                    <label
                      key={type}
                      className={`cursor-pointer px-3 py-2 rounded-full text-sm ${
                        selectedTypes.includes(type)
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <input
                        type="checkbox"
                        value={type}
                        checked={selectedTypes.includes(type)}
                        onChange={() => handleTypeChange(type)}
                        className="hidden"
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <h3 className="font-semibold mb-3">Price Range (₹/hour)</h3>
                <div className="px-2">
                  <div className="flex justify-between mb-2">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <h3 className="font-semibold mb-3">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value="distance">Nearest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            Showing {sortedVehicles.length} vehicles
            {selectedTypes.length > 0 && ` in ${selectedTypes.join(', ')}`}
          </p>
          {selectedTypes.length > 0 && (
            <button
              onClick={() => setSelectedTypes([])}
              className="text-green-600 text-sm hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Vehicle Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedVehicles.map((vehicle) => (
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
                <div className="absolute top-0 right-0 bg-green-500 text-white px-2 py-1 m-2 rounded-full text-sm font-semibold">
                  <FaRupeeSign className="inline-block mr-1" size={12} />
                  {vehicle.price}/{vehicle.priceUnit}
                </div>
                <div className="absolute bottom-0 left-0 bg-black bg-opacity-60 text-white px-2 py-1 m-2 rounded text-xs">
                  {vehicle.available}
                </div>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{vehicle.model}</h3>
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 mr-1" size={14} />
                    <span className="text-sm font-medium">
                      {vehicle.rating}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">
                      ({vehicle.reviews})
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-2">{vehicle.type}</p>

                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <FaMapMarkerAlt className="mr-1" />
                  <span>
                    {vehicle.location} • {vehicle.distance} km away
                  </span>
                </div>

                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-1">Features:</p>
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

                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                    {vehicle.owner.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{vehicle.owner}</p>
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" size={10} />
                      <span className="text-xs">{vehicle.ownerRating}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleBooking(vehicle)}
                  className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <span>Book Now</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {sortedVehicles.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No vehicles found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search filters or try a different location.
            </p>
            <div className="mt-6">
              <button
                onClick={() => {
                  setSelectedTypes([]);
                  setPriceRange([0, 2000]);
                  setSearchQuery('');
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}

        {/* Vehicle Booking Modal - In a real app, this would be a proper modal */}
        {selectedVehicle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative">
                <img
                  src={selectedVehicle.image}
                  alt={selectedVehicle.model}
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={() => setSelectedVehicle(null)}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold">
                    {selectedVehicle.model}
                  </h2>
                  <div className="flex items-center bg-green-100 px-3 py-1 rounded-full">
                    <FaRupeeSign className="text-green-600 mr-1" />
                    <span className="font-bold text-green-600">
                      {selectedVehicle.price}
                    </span>
                    <span className="text-green-600">
                      /{selectedVehicle.priceUnit}
                    </span>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm mr-2">
                    {selectedVehicle.type}
                  </span>
                  <div className="flex items-center text-sm text-gray-500">
                    <FaMapMarkerAlt className="mr-1" />
                    <span>
                      {selectedVehicle.location} • {selectedVehicle.distance} km
                      away
                    </span>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">
                  {selectedVehicle.description}
                </p>

                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedVehicle.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Owner</h3>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                      {selectedVehicle.owner.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{selectedVehicle.owner}</p>
                      <div className="flex items-center">
                        <FaStar className="text-yellow-400 mr-1" />
                        <span>{selectedVehicle.ownerRating}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Booking Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        value={bookingDate}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        onChange={(e) => setBookingDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duration
                      </label>
                      <select
                        value={bookingDuration}
                        onChange={(e) => setBookingDuration(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option>1 hour</option>
                        <option>2 hours</option>
                        <option>4 hours</option>
                        <option>8 hours (Full day)</option>
                        <option>Custom</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Total Estimate</p>
                    <p className="text-2xl font-bold">
                      ₹{selectedVehicle.price}
                    </p>
                  </div>
                  <button
                    onClick={handleConfirmBooking}
                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleList;
