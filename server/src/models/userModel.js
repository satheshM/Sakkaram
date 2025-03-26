const supabase = require('../config/db');

const findUserByEmail = async (email) => {
  const { data, error } = await supabase.from('users').select('*').eq('email', email).single();
  if (error) return null;
  return data;
};

const findUserById = async (id) => {
  const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
  if (error) return null;
  return data;
};

const createUser = async (user) => {
  const { data, error } = await supabase.from('users').insert([user]).select().single();
  if (error) throw new Error(error.message);
  return data;
};

const updateUserById = async (id, updateData) => {
  const { data, error } = await supabase.from('users').update(updateData).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return data;
};

module.exports = { findUserByEmail, findUserById, createUser, updateUserById };
