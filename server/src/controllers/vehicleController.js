const supabase = require('../config/db');
const logger = require('../config/logger');

const getAllVehicles = async (req, res) => {
  try {
    const { data, error } = await supabase.from('vehicles').select('*');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    logger.error(`Error fetching vehicles: ${err.message}`);
    res.status(500).json({ message: 'Failed to fetch vehicles' });
  }
};

const addVehicle = async (req, res) => {
  try {
    const { type, model, number, price, location } = req.body;

    const { data, error } = await supabase.from('vehicles').insert([{ type, model, number, price, location }]).select().single();
    if (error) throw error;

    res.status(201).json({ message: 'Vehicle added successfully', vehicle: data });
  } catch (err) {
    logger.error(`Error adding vehicle: ${err.message}`);
    res.status(500).json({ message: 'Failed to add vehicle' });
  }
};

const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const { data, error } = await supabase.from('vehicles').update(updateData).eq('id', id).select().single();
    if (error) throw error;

    res.json({ message: 'Vehicle updated successfully', vehicle: data });
  } catch (err) {
    logger.error(`Error updating vehicle: ${err.message}`);
    res.status(500).json({ message: 'Failed to update vehicle' });
  }
};

const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from('vehicles').delete().eq('id', id);
    if (error) throw error;

    res.json({ message: 'Vehicle deleted successfully' });
  } catch (err) {
    logger.error(`Error deleting vehicle: ${err.message}`);
    res.status(500).json({ message: 'Failed to delete vehicle' });
  }
};

module.exports = { getAllVehicles, addVehicle, updateVehicle, deleteVehicle };
