import React, { useState } from "react";

const MyVehicles = () => {
  // Sample Data
  const [vehicles, setVehicles] = useState([
    { id: 1, type: "Tractor", model: "John Deere 5105", number: "TN-01-1234" },
    { id: 2, type: "Harvester", model: "Kubota DC-68G", number: "TN-02-5678" },
  ]);

  // State for New Vehicle Form
  const [newVehicle, setNewVehicle] = useState({ type: "", model: "", number: "" });
  const [editingVehicle, setEditingVehicle] = useState(null); // Track vehicle being edited

  // Handle Input Change
  const handleChange = (e) => {
    setNewVehicle({ ...newVehicle, [e.target.name]: e.target.value });
  };

  // Add New Vehicle
  const addVehicle = () => {
    if (!newVehicle.type || !newVehicle.model || !newVehicle.number) return;
    setVehicles([...vehicles, { id: Date.now(), ...newVehicle }]);
    setNewVehicle({ type: "", model: "", number: "" });
  };

  // Delete Vehicle
  const deleteVehicle = (id) => {
    setVehicles(vehicles.filter((vehicle) => vehicle.id !== id));
  };

  // Edit Vehicle
  const startEditing = (vehicle) => {
    setEditingVehicle(vehicle);
  };

  // Update Vehicle
  const updateVehicle = () => {
    setVehicles(
      vehicles.map((v) =>
        v.id === editingVehicle.id ? editingVehicle : v
      )
    );
    setEditingVehicle(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Vehicles</h1>

      {/* 🚜 Add New Vehicle Form */}
      <div className="mb-6 p-4 border rounded bg-gray-100">
        <h2 className="text-lg font-semibold mb-2">Add New Vehicle</h2>
        <input
          type="text"
          name="type"
          placeholder="Vehicle Type (e.g., Tractor)"
          value={newVehicle.type}
          onChange={handleChange}
          className="border p-2 rounded mr-2"
        />
        <input
          type="text"
          name="model"
          placeholder="Model Name"
          value={newVehicle.model}
          onChange={handleChange}
          className="border p-2 rounded mr-2"
        />
        <input
          type="text"
          name="number"
          placeholder="Vehicle Number"
          value={newVehicle.number}
          onChange={handleChange}
          className="border p-2 rounded mr-2"
        />
        <button
          onClick={addVehicle}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Vehicle
        </button>
      </div>

      {/* 🚜 Vehicle List */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Your Vehicles</h2>
        {vehicles.length > 0 ? (
          vehicles.map((vehicle) => (
            <div key={vehicle.id} className="border p-4 rounded mb-2 flex justify-between items-center bg-gray-50">
              <div>
                <p><strong>Type:</strong> {vehicle.type}</p>
                <p><strong>Model:</strong> {vehicle.model}</p>
                <p><strong>Number:</strong> {vehicle.number}</p>
              </div>
              <div>
                <button
                  onClick={() => startEditing(vehicle)}
                  className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteVehicle(vehicle.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No vehicles added yet.</p>
        )}
      </div>

      {/* ✏️ Edit Vehicle Form (Shown when editing) */}
      {editingVehicle && (
        <div className="mt-6 p-4 border rounded bg-yellow-100">
          <h2 className="text-lg font-semibold mb-2">Edit Vehicle</h2>
          <input
            type="text"
            value={editingVehicle.type}
            onChange={(e) => setEditingVehicle({ ...editingVehicle, type: e.target.value })}
            className="border p-2 rounded mr-2"
          />
          <input
            type="text"
            value={editingVehicle.model}
            onChange={(e) => setEditingVehicle({ ...editingVehicle, model: e.target.value })}
            className="border p-2 rounded mr-2"
          />
          <input
            type="text"
            value={editingVehicle.number}
            onChange={(e) => setEditingVehicle({ ...editingVehicle, number: e.target.value })}
            className="border p-2 rounded mr-2"
          />
          <button
            onClick={updateVehicle}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Update
          </button>
        </div>
      )}
    </div>
  );
};

export default MyVehicles;
