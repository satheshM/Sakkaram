const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const logger = require('./config/logger');
require('dotenv').config();

// Routes
const authRoutes = require('./routes/authRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const profileRoute = require('./routes/profileRoutes');

const app = express();

// 🔒 Security Middlewares
app.use(helmet());
app.use(xss());
app.use(rateLimit({ windowMs: 10 * 60 * 1000, max: 100 }));

// 🛠 Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(morgan('dev'));

// 📌 API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile',profileRoute)
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);

// ❌ Global Error Handling Middleware
app.use((err, req, res, next) => {
  logger.error(err.message);
  res.status(err.status || 500).json({ success: false, error: err.message });
});

module.exports = app;
