import { request } from './auth';

export const getOwnerTransactions = async () => request('/earnings/getTransactions', 'GET');
// export const GetOwnerBookings = async () => request('/bookings/owner', 'GET');

  


