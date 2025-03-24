const supabase = require('../config/db');

const createUser = async (email, password, role) => {
  return await supabase.from('users').insert([{ email, password, role }]).select().single();
};

const getUserByEmail = async (email) => {
  return await supabase.from('users').select('id, email, password, role').eq('email', email).single();
};

module.exports = { createUser, getUserByEmail };
