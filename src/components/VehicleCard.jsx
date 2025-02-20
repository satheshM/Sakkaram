import React from "react";

const vehicles = [
  {
    id: 1,
    name: "Mahindra 575 DI",
    type: "Tractor",
    price: "₹500/hour",
    image: "https://via.placeholder.com/150", // Replace with real image URL
  },
  {
    id: 2,
    name: "John Deere Harvester",
    type: "Harvester",
    price: "₹1200/hour",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 3,
    name: "Swaraj 744 FE",
    type: "Tractor",
    price: "₹550/hour",
    image: "https://via.placeholder.com/150",
  },
];

const VehicleCard = () => {
  return (
    <div className="py-10">
      <h2 className="text-2xl font-bold text-center mb-6">Available Vehicles</h2>
      <div className="grid md:grid-cols-3 gap-6 justify-center">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white p-4 rounded-lg shadow-md max-w-sm">
            <img src={vehicle.image} alt={vehicle.name} className="w-full h-40 object-cover rounded" />
            <h3 className="font-semibold mt-2">{vehicle.name}</h3>
            <p className="text-gray-600">{vehicle.type}</p>
            <p className="font-bold text-green-600">{vehicle.price}</p>
            <button className="bg-green-500 text-white px-4 py-2 mt-3 rounded hover:bg-green-700">
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleCard;
