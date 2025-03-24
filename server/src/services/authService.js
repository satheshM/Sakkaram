const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getUserByEmail, createUser } = require('../models/userModel');

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

const registerUser = async (email, password, role) => {
  const hashedPassword = bcrypt.hashSync(password, 10);
  return await createUser(email, hashedPassword, role);
};

const loginUser = async (email, password) => {
  const { data: user } = await getUserByEmail(email);
  if (!user || !bcrypt.compareSync(password, user.password)) throw new Error('Invalid credentials');

  return generateToken(user);
};

module.exports = { registerUser, loginUser, generateToken };
