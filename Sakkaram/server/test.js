const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const morgan = require('morgan');
const winston = require('winston');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());
app.use(cookieParser());

// ✅ Setup CORS
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

// ✅ Setup Logging (Terminal + File)
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      ({ timestamp, level, message }) =>
        `${timestamp} [${level.toUpperCase()}]: ${message}`
    )
  ),
  transports: [
    new winston.transports.Console(), // Logs to Terminal
    new winston.transports.File({ filename: 'logs/app.log' }), // Logs to File
  ],
});

// ✅ Log API Requests in Terminal & File
// app.use(
//   morgan('combined', {
//     stream: { write: (message) => logger.info(message.trim()) },
//   })
// );
app.use(
  morgan((tokens, req, res) => {
    const logMessage = [
      tokens.method(req, res), // HTTP Method (GET, POST, etc.)
      tokens.url(req, res), // Request URL
      `Status: ${tokens.status(req, res)}`, // Response Status Code
      `Origin: ${req.get('origin') || 'Unknown'}`, // ✅ Incoming Request Origin
      `IP: ${tokens['remote-addr'](req, res)}`, // Client IP Address
      `User-Agent: ${tokens['user-agent'](req, res)}`, // User-Agent Header
    ].join(' | ');

    logger.info(logMessage); // Log to Terminal & File
    return logMessage;
  })
);

const USERS_FILE = 'users1.json';
const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';
const REFRESH_SECRET_KEY = process.env.JWT_SECRET || 'refreshsupersecretkey';

// 📌 Read Users from File
const readUsers = () => {
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
  } catch (err) {
    logger.error(`Error reading users file: ${err.message}`);
    return [];
  }
};

// 📌 Write Users to File
const writeUsers = (users) => {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    logger.info('User data updated successfully');
  } catch (err) {
    logger.error(`Error writing users file: ${err.message}`);
  }
};

// 🔹 Signup Route
app.post('/api/signup', (req, res) => {
  const { email, password, role } = req.body;
  let users = readUsers();

  if (!email || !password || !role) {
    logger.warn('Signup failed: Missing fields');
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (users.find((u) => u.email === email)) {
    logger.warn(`Signup failed: User ${email} already exists`);
    return res.status(400).json({ message: 'User already exists' });
  }

  const newUserId = uuidv4();

  const hashedPassword = bcrypt.hashSync(password, 10);
  users.push({
    id: newUserId,
    email,
    password: hashedPassword,
    role,
    createdAt: new Date().getFullYear(), // Store only the Year
  });
  writeUsers(users);

  const token = jwt.sign({ email, role, id: newUserId }, SECRET_KEY, {
    expiresIn: '15m',
  });
  const refreshToken = jwt.sign(
    { email, role, id: newUserId },
    REFRESH_SECRET_KEY,
    {
      expiresIn: '7d', // 🔥 Valid for 7 days
    }
  );

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'Lax',
    secure: false, // Change to `true` in production (HTTPS)
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });

  res.cookie('token', token, {
    httpOnly: true, // ✅ Prevents JavaScript access (more secure)
    sameSite: 'Lax', // ✅ Allows cross-site requests if initiated by the same site
    secure: false, // ❌ Set to true in production with HTTPS
    maxAge: 60 * 60 * 1000, // ✅ 1 hour expiry (milliseconds)
  });

  logger.info(`New user signed up: ${email} as ${role}`);
  res.json({
    message: 'User registered & logged in successfully',
    role,
    email,
    id: newUserId,
  });
});

app.get('/api/refresh-token', (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken; // Get refresh token from cookies

    if (!refreshToken) {
      logger.info(`RefreshToken: ${refreshToken}`);
      return res.status(401).json({ message: 'No refresh token' });
    }

    jwt.verify(refreshToken, REFRESH_SECRET_KEY, (err, user) => {
      if (err)
        return res.status(403).json({ message: 'Invalid refresh token' });

      // Generate a new access token
      const newAccessToken = jwt.sign(
        { email: user.email, role: user.role, id: user.id },
        SECRET_KEY,
        { expiresIn: '15m' }
      );

      res.cookie('token', newAccessToken, {
        httpOnly: true, // ✅ Prevents JavaScript access (more secure)
        sameSite: 'Lax', // ✅ Allows cross-site requests if initiated by the same site
        secure: false, // ❌ Set to true in production with HTTPS
        maxAge: 60 * 60 * 1000, // ✅ 1 hour expiry (milliseconds)
      });

      return res.status(200).json({ message: 'Token Refreshed' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 🔹 Login Route
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();
  const user = users.find((u) => u.email === email);

  if (!user) {
    logger.warn(`Login failed for ${email}: Invalid credentials`);
    return res.status(404).json({ message: 'user not found' });
  } else if (!bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { email: user.email, role: user.role, id: user.id },
    SECRET_KEY,
    {
      expiresIn: '15m',
    }
  );

  const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET_KEY, {
    expiresIn: '7d', // 🔥 Valid for 7 days
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'Lax',
    secure: false, // Change to `true` in production (HTTPS)
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });

  res.cookie('token', token, {
    httpOnly: true, // ✅ Prevents JavaScript access (more secure)
    sameSite: 'Lax', // ✅ Allows cross-site requests if initiated by the same site
    secure: false, // ❌ Set to true in production with HTTPS
    maxAge: 60 * 60 * 1000, // ✅ 1 hour expiry (milliseconds)
  });

  logger.info(`User logged in: ${email}`);
  res.json({
    message: 'Login successful',
    role: user.role,
    email: user.email,
    createdAt: user.createdAt,
  });
});

// 🔹 Logout Route
app.post('/api/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
  });
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
  });

  logger.info(`User logged out`);

  // res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'Strict' });  // Remove access token
  // res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'Strict', path: '/api/refresh' }); // Remove refresh

  res.json({ message: 'Logged out successfully' });
});

// 🔹 Middleware: Authenticate Token
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    logger.warn('Unauthorized access attempt');
    return res.status(401).json({ message: 'Unauthorized(token)' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      logger.error('Invalid token used');
      return res.status(401).json({ message: 'Invalid Token' });
    }
    req.user = decoded;
    next();
  });
};

// 🔹 Protected Route
app.get('/api/protected', authenticateToken, (req, res) => {
  logger.info(`Protected route accessed by ${req.user.email}`);
  res.json({ message: `Welcome ${req.user.role}!`, user: req.user });
});

// 🔹 Public Test Route
app.get('/api/test', (req, res) => {
  logger.info('Test API accessed');
  res.json({ message: 'API working Fine!' });
});

// 🔹 Fetch User Profile Route
app.get('/api/profile', authenticateToken, (req, res) => {
  const users = readUsers();
  const user = users.find((u) => u.id === req.user.id);

  if (!user) {
    logger.warn(`Profile fetch failed: User ${req.user.id} not found`);
    return res.status(404).json({ message: 'User not found' });
  }

  // Exclude password before sending response
  const { password, ...userDetails } = user;

  logger.info(`Profile accessed: ${req.user.id}`);
  res.json(userDetails);
});

// app.post('/api/logout', (req, res) => {
//   res.clearCookie('token', {
//     httpOnly: true,
//     sameSite: 'Lax',
//     secure: false, // Change to `true` in production with HTTPS
//   });
//   logger.info(`User logged out`);
//   res.json({ message: 'Logged out successfully' });
// });

// 🔹 Save/Update User Profile (POST)
app.post('/api/post_profile', authenticateToken, (req, res) => {
  const users = readUsers();
  const userIndex = users.findIndex((u) => u.id === req.user.id);

  if (userIndex === -1) {
    logger.warn(`Profile update failed: User ${req.user.id} not found`);
    return res.status(404).json({ message: 'User not found' });
  }

  // Update user data (keep email & password unchanged)
  users[userIndex] = { ...users[userIndex], ...req.body };

  writeUsers(users);
  logger.info(`Profile updated for ${req.user.get_profile}`);
  res.json({ message: 'Profile updated successfully', user: users[userIndex] });
});

// 🔹 Fetch User Profile (GET)
app.get('/api/get_profile', authenticateToken, (req, res) => {
  const users = readUsers();
  const user = users.find((u) => u.id === req.user.id);

  if (!user) {
    logger.warn(`Profile fetch failed: User ${req.user.id} not found`);
    return res.status(404).json({ message: 'User not found' });
  }

  // Exclude password before sending response
  const { password, ...userDetails } = user;

  logger.info(`Profile accessed: ${req.user.id}`);
  res.json(userDetails);
});

//vehicle

const VEHICLES_FILE = 'vehicles.json';

// 📌 Read Vehicles from File
const readVehicles = () => {
  try {
    return JSON.parse(fs.readFileSync(VEHICLES_FILE, 'utf8'));
  } catch (err) {
    logger.error(`Error reading vehicles file: ${err.message}`);
    return [];
  }
};

// 📌 Write Vehicles to File
const writeVehicles = (vehicles) => {
  try {
    fs.writeFileSync(VEHICLES_FILE, JSON.stringify(vehicles, null, 2));
    logger.info('Vehicle data updated successfully');
  } catch (err) {
    logger.error(`Error writing vehicles file: ${err.message}`);
  }
};

// 🔹 Get All Vehicles (Public)
app.get('/api/vehicles', authenticateToken, (req, res) => {
  const vehicles = readVehicles();
  res.json(vehicles);
});

//get user's vehicle
app.get('/api/user/vehicles', authenticateToken, (req, res) => {
  const vehicles = readVehicles();
  const userVehicles = vehicles.filter(
    (vehicle) => vehicle.ownerId === req.user.id
  );
  logger.info(`Vehicles fetched for user: ${req.user.email}`);
  res.status(200).json(userVehicles);
});

// 🔹 Get Vehicle by ID
app.get('/api/vehicles/:id', (req, res) => {
  const vehicles = readVehicles();
  const vehicle = vehicles.find((v) => v.id === req.params.id);
  if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
  res.json(vehicle);
});

// 🔹 Add New Vehicle (Only Logged-in Users)
app.post('/api/vehicles', authenticateToken, (req, res) => {
  const {
    type,
    model,
    number,
    price,
    priceUnit,
    location,
    features,
    description,
    available,
    image,
  } = req.body;
  let vehicles = readVehicles();

  let users = readUsers(); // Read users data

  // Find user by ID
  const user = users.find((u) => u.id === req.user.id);

  if (!type || !model || !number || !price || !location) {
    return res.status(400).json({ message: 'Required fields are missing' });
  }

  const newVehicle = {
    id: uuidv4(),
    owner: user.name,
    ownerId: user.id,
    type,
    model,
    number,
    price,
    priceUnit: priceUnit || 'hour',
    location,
    features: features || [],
    description: description || '',
    available: available ?? true,
    image: image || '',
    createdAt: new Date().toISOString(),
  };

  vehicles.push(newVehicle);
  writeVehicles(vehicles);
  res.status(201).json(newVehicle);
});

// 🔹 Update Vehicle (Only Owner)
app.put('/api/vehicles/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  let vehicles = readVehicles();
  const vehicleIndex = vehicles.findIndex((v) => v.id === id);

  if (vehicleIndex === -1) {
    return res.status(404).json({ message: 'Vehicle not found' });
  }
  if (vehicles[vehicleIndex].ownerId !== req.user.id) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  vehicles[vehicleIndex] = { ...vehicles[vehicleIndex], ...req.body };
  writeVehicles(vehicles);
  res.status(200).json(vehicles[vehicleIndex]);
});

// 🔹 Delete Vehicle (Only Owner)
app.delete('/api/vehicles/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  let vehicles = readVehicles();
  const vehicle = vehicles.find((v) => v.id === id);

  if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
  if (vehicle.ownerId !== req.user.id)
    return res.status(403).json({ message: 'Unauthorized' });

  vehicles = vehicles.filter((v) => v.id !== id);
  writeVehicles(vehicles);
  return res.status(200).json({ message: 'Vehicle deleted successfully' });
});

// 🔹 Toggle Vehicle Availability (Only Owner)
app.patch('/api/vehicles/:id/availability', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { available } = req.body;
  let vehicles = readVehicles();
  const vehicleIndex = vehicles.findIndex((v) => v.id === id);

  if (vehicleIndex === -1) {
    return res.status(404).json({ message: 'Vehicle not found' });
  }
  if (vehicles[vehicleIndex].ownerId !== req.user.id) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  vehicles[vehicleIndex].available = available;
  writeVehicles(vehicles);
  res.json({
    message: 'Vehicle availability updated',
    vehicle: vehicles[vehicleIndex],
  });
});

//BOOKING SECTION       //////////////////////////////////

const BOOKINGS_FILE = 'bookings.json';

// 📌 Read Bookings from File
const readBookings = () => {
  try {
    return JSON.parse(fs.readFileSync(BOOKINGS_FILE, 'utf8'));
  } catch (err) {
    logger.error(`Error reading bookings file: ${err.message}`);
    return [];
  }
};

// 📌 Write Bookings to File
const writeBookings = (bookings) => {
  try {
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
    logger.info('Bookings data updated successfully');
  } catch (err) {
    logger.error(`Error writing bookings file: ${err.message}`);
  }
};

// 🔹 Create a New Booking
app.post('/api/bookings', authenticateToken, (req, res) => {
  const {
    vehicleId,
    vehicleModel,
    vehicleType,
    owner,
    location,
    distance,
    pricePerHour,
    bookingDate,
    duration,
    totalPrice,
    status,
    image,
  } = req.body;
  if (!vehicleId || !bookingDate || !duration) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const vehicles = readVehicles();
  const bookingsData = readBookings();

  const vehicle = vehicles.find((v) => v.id === vehicleId);
  if (!vehicle) {
    return res.status(404).json({ message: 'Vehicle not found' });
  }

  const newBooking = {
    id: uuidv4(),
    farmerId: req.user.id, // Logged-in user
    ownerId: vehicle.ownerId,
    owner: owner,
    vehicleId,
    vehicleModel,
    vehicleType,
    image,
    location,
    distance,
    pricePerHour,
    bookingDate,
    duration,
    totalPrice,
    status,
    createdAt: new Date().toISOString(),
  };

  bookingsData.push(newBooking);
  writeBookings(bookingsData);

  res
    .status(201)
    .json({ message: 'Booking created successfully', booking: newBooking });
});

// 🔹 Get All Bookings (For Admin)
app.get('/api/bookings', authenticateToken, (req, res) => {
  const bookings = readBookings();
  res.json(bookings);
});

// 🔹 Get Farmer's Bookings
app.get('/api/user/bookings', authenticateToken, (req, res) => {
  const bookingsData = readBookings(); // Read the file
  if (!Array.isArray(bookingsData) || bookingsData.length === 0) {
    return res.json([]); // Handle empty case
  }

  // Filter upcoming and past bookings for the logged-in user
  const userBookings = {
    upcoming: bookingsData.filter(
      (b) =>
        b.farmerId === req.user.id &&
        (b.status === 'Pending' ||
          b.status === 'Ongoing' ||
          b.status === 'Confirmed')
    ),
    past: bookingsData.filter(
      (b) =>
        b.farmerId === req.user.id &&
        (b.status === 'Completed' ||
          b.status === 'Cancelled' ||
          b.status === 'Rejected')
    ),
  };

  res.json(userBookings);
});

// 🔹 Get Owner's Bookings (Vehicles Booked by Others)
app.get('/api/owner/bookings', authenticateToken, (req, res) => {
  const Allbookings = readBookings();
  if (!Array.isArray(Allbookings) || Allbookings.length === 0) {
    return res.json([]); // Handle empty case
  }

  const ownersBooking = {
    bookingRequest: Allbookings.filter(
      (b) => b.ownerId === req.user.id && b.status === 'Pending'
    ),
    activeBookings: Allbookings.filter(
      (b) => b.ownerId === req.user.id && b.status === 'Ongoing'
    ),

    bookingHistory: Allbookings.filter(
      (b) =>
        b.ownerId === req.user.id &&
        (b.status === 'Completed' ||
          b.status === 'Cancelled' ||
          b.status === 'Rejected')
    ),
  };
  res.json(ownersBooking);

  // Filter upcoming and past bookings for the logged-in user
  // const ownerBookings = [
  //   ...upcoming.filter((b) => b.ownerId === req.user.id),
  //   ...past.filter((b) => b.ownerId === req.user.id),
  // ];
});

// 🔹 Update Booking Status (Owner Only)
app.patch('/api/owner/bookings/status', authenticateToken, (req, res) => {
  const { cancellationReason, status, id } = req.body;

  let bookings = readBookings();
  const bookingIndex = bookings.findIndex((b) => b.id === id);

  if (bookingIndex === -1) {
    return res.status(404).json({ message: 'Booking not found' });
  }
  if (bookings[bookingIndex].ownerId !== req.user.id) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  bookings[bookingIndex].status = status;
  bookings[bookingIndex].cancellationReason = cancellationReason;
  writeBookings(bookings);
  res.json({
    message: 'Booking status updated',
    // booking: bookings[bookingIndex],
  });
});


//Review from Farmer
app.patch('/api/bookings/submitReview', authenticateToken, (req, res) => {
  const { bookingId, rating, feedback,status } = req.body;

  let bookings = readBookings();
  const bookingIndex = bookings.findIndex((b) => b.id === bookingId);

  if (bookingIndex === -1) {
    return res.status(404).json({ message: 'Booking not found' });
  }
  if (bookings[bookingIndex].farmerId !== req.user.id) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  bookings[bookingIndex].feedback = feedback;
  bookings[bookingIndex].rating = rating;
  bookings[bookingIndex].status = status;
  writeBookings(bookings);
  res.json({
    message: 'Succesfully Reviewed',
    // booking: bookings[bookingIndex],
  });
});

// 🔹 Cancel Booking (Only by Farmer)
app.delete('/api/bookings/:id', authenticateToken, (req, res) => {
  let bookings = readBookings();
  const bookingIndex = bookings.findIndex((b) => b.id === req.params.id);

  if (bookingIndex === -1) {
    return res.status(404).json({ message: 'Booking not found' });
  }
  if (bookings[bookingIndex].farmerId !== req.user.email) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  bookings.splice(bookingIndex, 1);
  writeBookings(bookings);
  res.json({ message: 'Booking cancelled successfully' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
