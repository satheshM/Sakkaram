import React from "react";
import { Link } from "react-router-dom";

const vehicles = [
  {
    id: 1,
    name: "Mahindra 575 DI",
    type: "Tractor",
    price: "₹500/hour",
    image: "https://5.imimg.com/data5/SELLER/Default/2021/12/QO/YC/XG/52189282/mahindra-575-di-tractor.jpg",
    features: ["45 HP", "4-Wheel Drive", "Power Steering"],
  },
  {
    id: 2,
    name: "John Deere Harvester",
    type: "Harvester",
    price: "₹1200/hour",
    image: "https://5.imimg.com/data5/SELLER/Default/2021/1/KO/FV/IY/3042719/john-deere-w70-self-propelled-combine-harvester-500x500.jpg",
    features: ["110 HP", "Grain Tank", "AC Cabin"],
  },
  {
    id: 3,
    name: "Swaraj 744 FE",
    type: "Tractor",
    price: "₹550/hour",
    image: "https://5.imimg.com/data5/SELLER/Default/2022/9/SY/OM/QG/159745018/swaraj-744-fe-tractor-500x500.jpg",
    features: ["48 HP", "Power Steering", "Oil Immersed Brakes"],
  },
  {
    id: 4,
    name: "Massey Ferguson Rotavator",
    type: "Rotavator",
    price: "₹350/hour",
    image: "https://5.imimg.com/data5/SELLER/Default/2022/1/SI/TP/NG/144593388/massey-ferguson-rotavator-500x500.jpg",
    features: ["42 Blades", "Heavy Duty", "Adjustable Depth"],
  },
];

const VehicleCard = () => {
  return (
    <div className="py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Popular Vehicles</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="relative">
                <img 
                  src={vehicle.image} 
                  alt={vehicle.name} 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-0 right-0 bg-green-500 text-white px-2 py-1 m-2 rounded text-sm font-semibold">
                  {vehicle.price}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800">{vehicle.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{vehicle.type}</p>
                <div className="mb-3">
                  <ul className="text-xs text-gray-500">
                    {vehicle.features.map((feature, idx) => (
                      <li key={idx} className="inline-block mr-2 mb-1 bg-gray-100 px-2 py-1 rounded">
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link to="/vehicles">
                  <button className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center">
                    <span>Book Now</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;