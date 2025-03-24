const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/db');
const logger = require('../config/logger');

const signup = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const { data, error } = await supabase.from('users').insert([{ email, password: hashedPassword, role }]).select().single();
    if (error) throw new Error(error.message);

    const token = jwt.sign({ id: data.id, email, role }, process.env.JWT_SECRET, { expiresIn: '15m' });

    res.cookie('token', token, { httpOnly: true, sameSite: 'Lax', secure: false, maxAge: 60 * 60 * 1000 });

    res.status(201).json({ message: 'User registered successfully', user: data });
  } catch (err) {
    logger.error(`Signup Error: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: user, error } = await supabase.from('users').select('id, email, password, role').eq('email', email).single();
    if (error || !user) throw new Error('User not found');

    if (!bcrypt.compareSync(password, user.password)) throw new Error('Invalid credentials');

    const token = jwt.sign({ id: user.id, email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });

    res.cookie('token', token, { httpOnly: true, sameSite: 'Lax', secure: false, maxAge: 60 * 60 * 1000 });

    res.json({ message: 'Login successful', user });
  } catch (err) {
    logger.warn(`Login Error: ${err.message}`);
    res.status(400).json({ message: err.message });
  }
};

const refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Forbidden' });

    const newAccessToken = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });

    res.cookie('token', newAccessToken, { httpOnly: true, sameSite: 'Lax', secure: false, maxAge: 60 * 60 * 1000 });
    res.json({ message: 'Token refreshed successfully' });
  });
};

const logout = (req, res) => {
  res.clearCookie('token');
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out successfully' });
};

module.exports = { signup, login, refreshToken, logout };
