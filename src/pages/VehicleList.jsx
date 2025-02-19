import React from "react";

const vehicles = ["Tractor", "Harvester", "Plow", "Sprayer"];

const VehicleList = () => {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-green-700 mb-6">Available Vehicles</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {vehicles.map((vehicle) => (
          <div key={vehicle} className="bg-white p-6 rounded shadow-md text-center">
            <h3 className="text-xl font-bold">{vehicle}</h3>
            <p className="text-gray-600">Book a {vehicle} for your farming needs.</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleList;
