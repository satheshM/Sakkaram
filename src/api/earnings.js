import { request } from './auth';

export const getOwnerTransactions = async () => request('/earnings/getTransactions', 'GET');
 export const GetEarningDetails = async () => request('/earnings/earningDetails', 'GET');
 export const OwnerWithdrawn = async (body) => request('/earnings/withdrawn', 'POST',body);
  


