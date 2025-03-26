const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { findUserByEmail, createUser } = require('../models/userModel');


const verifyToken = (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, error: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, error: 'Forbidden: Invalid or expired token' });
    }

    res.json({
      success: true,
      message: 'Token is valid',
      user: {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      }
    });
  });
};


const generateTokens = (user) => {
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.REFRESH_JWT_SECRET,
    { expiresIn: '7d' }
  );

  return { token, refreshToken };
};

const setAuthCookies = (res, token, refreshToken) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

const signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const { email, password, role } = req.body;
    const existingUser = await findUserByEmail(email);
    if (existingUser)
      return res.status(400).json({ success: false, error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser({ email, password: hashedPassword, role });

    const { token, refreshToken } = generateTokens(newUser);
    setAuthCookies(res, token, refreshToken);

    res.json({ success: true, message: 'User registered successfully',user: {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role
    } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user)
      return res.status(404).json({ success: false, error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(403).json({ success: false, error: 'Invalid credentials' });

    const { token, refreshToken } = generateTokens(user);
    setAuthCookies(res, token, refreshToken);

    res.json({ success: true, message: 'Login successful',user: {
      id: user.id,
      email: user.email,
      role: user.role
    } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const refreshAccessToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ success: false, error: 'Unauthorized' });

  jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET, (err, decoded) => {
    if (err)
      return res.status(403).json({ success: false, error: 'Invalid refresh token' });

    const token = jwt.sign(
      { id: decoded.id, email: decoded.email, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      maxAge: 15 * 60 * 1000,
    });

    res.json({ success: true, message: 'Token refreshed successfully' });
  });
};

const logout = (req, res) => {
  res.clearCookie('token');
  res.clearCookie('refreshToken');
  res.json({ success: true, message: 'Logged out successfully' });
};




module.exports = { verifyToken ,signup, login, refreshAccessToken, logout };
