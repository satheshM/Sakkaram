import { request } from './auth'; // Reuse the request function

export const fetchVehicles = async () => request('/vehicles', 'GET');

export const fetchUserVehicles = async () => request('/user/vehicles', 'GET');

export const addVehicle = async (vehicleData) =>
  request('/vehicles', 'POST', vehicleData);

export const updateVehicle = async (id, updatedData) =>
  request(`/vehicles/${id}`, 'PUT', updatedData);

export const deleteVehicle = async (id) => request(`/vehicles/${id}`, 'DELETE');

export const toggleAvailability = async (id, available) =>
  request(`/vehicles/${id}/availability`, 'PATCH', { available });

  
