import { request } from './auth';

export const createBooking = async (bookingData) =>
  request('/bookings', 'POST', bookingData);
export const GetUserBookings = async () => request('/bookings/farmer', 'GET');
export const GetOwnerBookings = async () => request('/bookings/owner', 'GET');
export const UpdateBookingStatus = async (status) =>
  request(`/bookings/status`, 'PATCH',status);

  export const submitReview = async (review) =>
  request(`/bookings/submitReview`, 'PATCH',review);
  


