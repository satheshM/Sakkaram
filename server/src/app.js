const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const logger = require('./config/logger');
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

require('dotenv').config();

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());
//app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(cors({ origin:process.env.CORS_ORIGIN || 'http://localhost:5173', credentials: true }));

app.use(helmet());
app.use(xss());

// ✅ Rate Limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100,
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// ✅ Logging
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/payments', paymentRoutes);

module.exports = app;
