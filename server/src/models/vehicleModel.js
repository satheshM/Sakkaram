const supabase = require('../config/db');

const getAllVehicles = async () => {
  return await supabase.from('vehicles').select('*');
};

const addVehicle = async (vehicleData) => {
  return await supabase.from('vehicles').insert([vehicleData]).select().single();
};

const updateVehicle = async (id, updateData) => {
  return await supabase.from('vehicles').update(updateData).eq('id', id).select().single();
};

const deleteVehicle = async (id) => {
  return await supabase.from('vehicles').delete().eq('id', id);
};

module.exports = { getAllVehicles, addVehicle, updateVehicle, deleteVehicle };
