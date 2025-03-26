// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { findUserByEmail, createUser } = require('../models/userModel');

// const generateTokens = (user) => {
//   const token = jwt.sign(
//     { id: user.id, email: user.email, role: user.role },
//     process.env.JWT_SECRET,
//     { expiresIn: '15m' }
//   );

//   const refreshToken = jwt.sign(
//     { id: user.id },
//     process.env.REFRESH_JWT_SECRET,
//     { expiresIn: '7d' }
//   );

//   return { token, refreshToken };
// };

// const setAuthCookies = (res, token, refreshToken) => {
//   res.cookie('token', token, {
//     httpOnly: true,
//     secure: true, // Use HTTPS in production
//     sameSite: 'Lax',
//     maxAge: 15 * 60 * 1000, // 15 minutes
//   });

//   res.cookie('refreshToken', refreshToken, {
//     httpOnly: true,
//     secure: true, // Use HTTPS in production
//     sameSite: 'Lax',
//     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//   });
// };

// const registerUser = async (email, password, role) => {
//   const existingUser = await findUserByEmail(email);
//   if (existingUser) throw new Error('User already exists');

//   const hashedPassword = await bcrypt.hash(password, 10);
//   return await createUser({ email, password: hashedPassword, role });
// };

// const verifyPassword = async (inputPassword, userPassword) => {
//   return await bcrypt.compare(inputPassword, userPassword);
// };

// module.exports = { generateTokens, setAuthCookies, registerUser, verifyPassword };
