const { validationResult } = require('express-validator');
const { getAllVehicles, getUserVehicles,updateVehicleAvailability, getVehicleById, createVehicle, updateVehicle, deleteVehicle } = require('../models/vehicleModel');

const fetchAllVehicles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const vehicles = await getAllVehicles(page, limit);
    res.json({ success: true, vehicles });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const fetchUserVehicles = async (req, res) => {
  try {
    const vehicles = await getUserVehicles(req.user.id);
    res.json({ success: true, vehicles });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const fetchVehicleById = async (req, res) => {
  try {
    const vehicle = await getVehicleById(req.params.id);
    if (!vehicle) return res.status(404).json({ success: false, error: 'Vehicle not found' });
    res.json({ success: true, vehicle });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const addVehicle = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const newVehicle = await createVehicle({ owner_id: req.user.id, ...req.body });
    res.status(201).json({ success: true, message: 'Vehicle added successfully', vehicle: newVehicle });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const modifyVehicle = async (req, res) => {
  try {
    const vehicle = await getVehicleById(req.params.id);
    if (!vehicle) return res.status(404).json({ success: false, error: 'Vehicle not found' });

    if (vehicle.owner_id !== req.user.id) return res.status(403).json({ success: false, error: 'Unauthorized' });

    const updatedVehicle = await updateVehicle(req.params.id, req.body);
    res.json({ success: true, message: 'Vehicle updated successfully', vehicle: updatedVehicle });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const removeVehicle = async (req, res) => {
  try {
    const vehicle = await getVehicleById(req.params.id);
    if (!vehicle) return res.status(404).json({ success: false, error: 'Vehicle not found' });

    if (vehicle.owner_id !== req.user.id) return res.status(403).json({ success: false, error: 'Unauthorized' });

    await deleteVehicle(req.params.id);
    res.json({ success: true, message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};




const toggleVehicleAvailability = async (req, res) => {
  const { id } = req.params;
  const { available } = req.body;

  try {
    // ✅ 1️⃣ Check if the vehicle exists and belongs to the logged-in user
    const vehicle = await getVehicleById(id);
    if (!vehicle) return res.status(404).json({ success: false, error: 'Vehicle not found' });

    if (vehicle.owner_id !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    // ✅ 2️⃣ Update vehicle availability
    const updatedVehicle = await updateVehicleAvailability(id, available);

    res.json({
      success: true,
      message: 'Vehicle availability updated',
      vehicle: updatedVehicle
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { toggleVehicleAvailability ,fetchAllVehicles, fetchUserVehicles, fetchVehicleById, addVehicle, modifyVehicle, removeVehicle };
