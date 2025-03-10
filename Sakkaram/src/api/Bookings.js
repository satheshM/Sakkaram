import { request } from './auth';

export const createBooking = async (bookingData) =>
  request('/bookings', 'POST', bookingData);

export const GetUserBookings = async () => request('/user/bookings', 'GET');
export const GetOwnerBookings = async () => request('/owner/bookings', 'GET');
export const UpdateBookingStatus = async (status) =>
  request(`/owner/bookings/status`, 'PATCH',status);

  export const submitReview = async (review) =>
  request(`/bookings/submitReview`, 'PATCH',review);


