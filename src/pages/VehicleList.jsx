import React, { useState } from "react";

// Sample data for vehicle owners
const vehicleOwners = [
  { id: 1, name: "Ramesh", vehicles: ["Tractor", "Plow"], location: "Village A" },
  { id: 2, name: "Suresh", vehicles: ["Harvester", "Sprayer"], location: "Village B" },
  { id: 3, name: "Mahesh", vehicles: ["Plow", "Tractor"], location: "Village C" },
  { id: 4, name: "Ganesh", vehicles: ["Harvester"], location: "Village D" },
  { id: 5, name: "Rajesh", vehicles: ["Sprayer", "Tractor"], location: "Village E" },
];

const VehicleList = () => {
  const [selectedVehicles, setSelectedVehicles] = useState([]);

  // Handle filter change
  const handleFilterChange = (vehicleType) => {
    setSelectedVehicles((prev) =>
      prev.includes(vehicleType)
        ? prev.filter((type) => type !== vehicleType)
        : [...prev, vehicleType]
    );
  };

  // Filter vehicle owners dynamically
  const filteredOwners = selectedVehicles.length
    ? vehicleOwners.filter((owner) =>
        owner.vehicles.some((vehicle) => selectedVehicles.includes(vehicle))
      )
    : vehicleOwners;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-green-700 mb-6">Book an Agricultural Vehicle</h1>
      
      {/* Filter Options */}
      <div className="mb-6 bg-gray-100 p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-3">Filter by Vehicle Type</h2>
        <div className="flex flex-wrap gap-3">
          {["Tractor", "Harvester", "Plow", "Sprayer"].map((vehicle) => (
            <label
              key={vehicle}
              className={`cursor-pointer px-4 py-2 rounded border ${
                selectedVehicles.includes(vehicle) ? "bg-green-500 text-white" : "bg-white"
              }`}
            >
              <input
                type="checkbox"
                value={vehicle}
                checked={selectedVehicles.includes(vehicle)}
                onChange={() => handleFilterChange(vehicle)}
                className="hidden"
              />
              {vehicle}
            </label>
          ))}
        </div>
      </div>
      
      {/* Vehicle Owners List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOwners.map((owner) => (
          <div key={owner.id} className="p-4 bg-white shadow rounded-lg border">
            <h3 className="text-xl font-semibold">{owner.name}</h3>
            <p className="text-gray-600">Location: {owner.location}</p>
            <div className="mt-2">
              <span className="text-sm font-semibold">Available Vehicles:</span>
              <ul className="list-disc pl-5 text-gray-700">
                {owner.vehicles.map((vehicle, index) => (
                  <li key={index}>{vehicle}</li>
                ))}
              </ul>
            </div>
            <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded w-full">
              View Profile & Book
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleList;
