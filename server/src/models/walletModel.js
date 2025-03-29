// walletModel.js
const supabase = require('../config/db');

const createWallet = async (userId) => {
  const { data, error } = await supabase
    .from('wallets')
    .insert([{ user_id: userId, balance: 0.0 }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

module.exports = { createWallet };
