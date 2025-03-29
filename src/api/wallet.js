import { request } from './auth';


 




import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const api = {
  async getWalletBalance() {
    const response = await axios.get(`${API_URL}/wallet/balance`, {
      withCredentials: true, // Enable sending cookies
    });
    return response.data;
  },

  async getTransactions() {
    const response = await axios.get(`${API_URL}/wallet/transactions`, {
      withCredentials: true, // Enable sending cookies
    });
    return response.data;
  },

  // async createPayment(amount) {
  //   const response = await axios.post(`${API_URL}/wallet/payment`, { amount }, {
  //     credentials: true, // Enable sending cookies
  //   });
  //   return response.data;
  // },

 async createPayment(amount) {
  
  return  request(`/wallet/payment`, 'POST',{amount:amount});
    
  },
  async verifyPayment(paymentData) {
    const response = await axios.post(`${API_URL}/wallet/payment/verify`, paymentData, {
      withCredentials: true, // Enable sending cookies
    });
    return response.data;
  },

  async withdrawMoney(amount) {
    const response = await axios.post(`${API_URL}/wallet/withdraw`, { amount }, {
      withCredentials: true, // Enable sending cookies
    });
    return response.data;
  }
};