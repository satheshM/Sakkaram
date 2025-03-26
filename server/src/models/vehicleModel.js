const supabase = require('../config/db');

const getAllVehicles = async (page, limit) => {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .range((page - 1) * limit, page * limit - 1); // Pagination

  if (error) throw new Error(error.message);
  return data;
};

const getUserVehicles = async (ownerId) => {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('owner_id', ownerId);

  if (error) throw new Error(error.message);
  return data;
};

const getVehicleById = async (vehicleId) => {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('id', vehicleId)
    .single();

  if (error) return null;
  return data;
};

// const createVehicle = async (vehicle) => {
//   const { data, error } = await supabase
//     .from('vehicles')
//     .insert([vehicle])
//     .select()
//     .single();

//   if (error) throw new Error(error.message);
//   return data;
// };

const createVehicle = async (vehicle) => {
  // ✅ Step 1: Fetch the owner's name from the `users` table
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("name")
    .eq("id", vehicle.owner_id)
    .single();

  if (userError || !user) {
    throw new Error("Invalid owner_id. User not found.");
  }

  // ✅ Step 2: Insert vehicle with owner name
  const { data, error } = await supabase
    .from("vehicles")
    .insert([{ ...vehicle, owner: user.name }]) // Adding `owner` field
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};
const updateVehicle = async (vehicleId, updates) => {
  const { data, error } = await supabase
    .from('vehicles')
    .update(updates)
    .eq('id', vehicleId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

const deleteVehicle = async (vehicleId) => {
  const { error } = await supabase
    .from('vehicles')
    .delete()
    .eq('id', vehicleId);

  if (error) throw new Error(error.message);
  return { message: 'Vehicle deleted successfully' };
};


const updateVehicleAvailability = async (id, available) => {
  const { data, error } = await supabase
    .from('vehicles')
    .update({ available })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

module.exports = { updateVehicleAvailability,getAllVehicles, getUserVehicles, getVehicleById, createVehicle, updateVehicle, deleteVehicle };
