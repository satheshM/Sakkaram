import { request } from './auth';

export const getOwnerTransactions = async () => request('/earnings/getTransactions', 'GET');
 export const GetEarningDetails = async () => request('/earnings/details', 'GET');

  


