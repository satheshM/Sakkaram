const express = require('express');
    const jwt = require('jsonwebtoken');
    const bcrypt = require('bcryptjs');
    const cors = require('cors');
    const cookieParser = require('cookie-parser');
    const fs = require('fs');
    const morgan = require('morgan');
    const winston = require('winston');
    const { v4: uuidv4 } = require('uuid');
    const rateLimit = require('express-rate-limit');
    const helmet = require('helmet');
    const xss = require('xss-clean');
    const { check, validationResult } = require('express-validator');
    require('dotenv').config();

    const app = express();

    // ✅ Environment Variables
    const PORT = process.env.PORT || 5000;
    const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
    const USERS_FILE = process.env.USERS_FILE || 'users1.json';
    const VEHICLES_FILE = process.env.VEHICLES_FILE || 'vehicles.json';
    const BOOKINGS_FILE = process.env.BOOKINGS_FILE || 'bookings.json';
    const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';
    const REFRESH_SECRET_KEY = process.env.REFRESH_JWT_SECRET || 'refreshsupersecretkey';

    // ✅ Middlewares
    app.use(express.json());
    app.use(cookieParser());
    app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
    app.use(helmet()); // Use Helmet for security headers
    app.use(xss()); // Prevent XSS attacks

    // ✅ Rate Limiting
    const limiter = rateLimit({
      windowMs: 10 * 60 * 1000, // 10 minutes
      max: 100, // Limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again after 15 minutes',
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    });
    app.use(limiter);

    // ✅ Logging Setup
    const logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(
          ({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`
        )
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/app.log' }),
      ],
    });

    app.use(
      morgan((tokens, req, res) => {
        const logMessage = [
          tokens.method(req, res),
          tokens.url(req, res),
          `Status: ${tokens.status(req, res)}`,
          `Origin: ${req.get('origin') || 'Unknown'}`,
          `IP: ${tokens['remote-addr'](req, res)}`,
          `User-Agent: ${tokens['user-agent'](req, res)}`,
        ].join(' | ');

        logger.info(logMessage);
        return logMessage;
      })
    );

    // ✅ Utility Functions
    const readFromFile = (filename) => {
      try {
        const data = fs.readFileSync(filename, 'utf8');
        return JSON.parse(data);
      } catch (err) {
        logger.error(`Error reading ${filename}: ${err.message}`);
        return [];
      }
    };

    const writeToFile = (filename, data) => {
      try {
        fs.writeFileSync(filename, JSON.stringify(data, null, 2));
        logger.info(`${filename} data updated successfully`);
      } catch (err) {
        logger.error(`Error writing ${filename}: ${err.message}`);
      }
    };

    // ✅ Authentication Middleware
    const authenticateToken = (req, res, next) => {
      const token = req.cookies.token;
      if (!token) {
        logger.warn('Unauthorized access attempt: No token');
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
      }

      jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
          logger.error('Invalid token used');
          return res.status(403).json({ message: 'Forbidden: Invalid token' });
        }
        req.user = decoded;
        next();
      });
    };

    // ✅ Input Validation Middleware
    const validateInput = (validations) => {
      return async (req, res, next) => {
        await Promise.all(validations.map((validation) => validation.run(req)));

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          logger.warn(`Validation error: ${JSON.stringify(errors.array())}`);
          return res.status(400).json({ errors: errors.array() });
        }

        next();
      };
    };

    // ✅ Routes

// 🔹 Verify Token Route
app.get('/api/verify-token', (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    logger.warn('Unauthorized: No token provided');
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      logger.error('Invalid or expired token');
      return res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
    }

    logger.info(`Token verified for user: ${decoded.email}`);
    res.json({ message: 'Token is valid', user: decoded });
  });
});






    // 🔹 Signup Route
    app.post(
      '/api/signup',
      validateInput([
        check('email').isEmail().withMessage('Invalid email format'),
        check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        check('role').notEmpty().withMessage('Role is required'),
      ]),
      (req, res) => {
        const { email, password, role } = req.body;
        let users = readFromFile(USERS_FILE);

        if (users.find((u) => u.email === email)) {
          logger.warn(`Signup failed: User ${email} already exists`);
          return res.status(400).json({ message: 'User already exists' });
        }

        const newUserId = uuidv4();
        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = {
          id: newUserId,
          email,
          password: hashedPassword,
          role,
          createdAt: new Date().getFullYear(),
        };

        users.push(newUser);
        writeToFile(USERS_FILE, users);

        const token = jwt.sign({ email, role, id: newUserId }, SECRET_KEY, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ email, role, id: newUserId }, REFRESH_SECRET_KEY, {
          expiresIn: '7d',
        });

        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          sameSite: 'Lax',
          secure: false, // Set to `true` in production (HTTPS)
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.cookie('token', token, {
          httpOnly: true,
          sameSite: 'Lax',
          secure: false, // Set to `true` in production (HTTPS)
          maxAge: 60 * 60 * 1000,
        });

        logger.info(`New user signed up: ${email} as ${role}`);
        res.status(201).json({
          message: 'User registered & logged in successfully',
          role,
          email,
          id: newUserId,
        });
      }
    );

    // 🔹 Refresh Token Route
    app.get('/api/refresh-token', (req, res) => {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        logger.warn('Refresh token missing');
        return res.status(401).json({ message: 'Unauthorized: Refresh token missing' });
      }

      jwt.verify(refreshToken, REFRESH_SECRET_KEY, (err, user) => {
        if (err) {
          logger.error('Invalid refresh token');
          return res.status(403).json({ message: 'Forbidden: Invalid refresh token' });
        }

        const newAccessToken = jwt.sign(
          { email: user.email, role: user.role, id: user.id },
          SECRET_KEY,
          { expiresIn: '15m' }
        );

        res.cookie('token', newAccessToken, {
          httpOnly: true,
          sameSite: 'Lax',
          secure: false, // Set to `true` in production (HTTPS)
          maxAge: 60 * 60 * 1000,
        });

        logger.info(`Token refreshed for user: ${user.email}`);
        res.json({ message: 'Token refreshed successfully' });
      });
    });

    // 🔹 Login Route
    app.post(
      '/api/login',
      validateInput([
        check('email').isEmail().withMessage('Invalid email format'),
        check('password').notEmpty().withMessage('Password is required'),
      ]),
      (req, res) => {
        const { email, password } = req.body;
        const users = readFromFile(USERS_FILE);
        const user = users.find((u) => u.email === email);

        if (!user) {
          logger.warn(`Login failed for ${email}: User not found`);
          return res.status(404).json({ message: 'User not found' });
        }

        if (!bcrypt.compareSync(password, user.password)) {
          logger.warn(`Login failed for ${email}: Invalid credentials`);
          return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
          { email: user.email, role: user.role, id: user.id },
          SECRET_KEY,
          { expiresIn: '15m' }
        );
        const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET_KEY, { expiresIn: '7d' });

        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          sameSite: 'Lax',
          secure: false, // Set to `true` in production (HTTPS)
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.cookie('token', token, {
          httpOnly: true,
          sameSite: 'Lax',
          secure: false, // Set to `true` in production (HTTPS)
          maxAge: 60 * 60 * 1000,
        });

        logger.info(`User logged in: ${email}`);
        res.json({
          message: 'Login successful',
          role: user.role,
          email: user.email,
          createdAt: user.createdAt,
        });
      }
    );

    // 🔹 Logout Route
    app.post('/api/logout', (req, res) => {
      res.clearCookie('token', { httpOnly: true, sameSite: 'Lax', secure: false });
      res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'Lax', secure: false });
      logger.info('User logged out');
      res.json({ message: 'Logged out successfully' });
    });

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
      const users = readFromFile(USERS_FILE);
      const user = users.find((u) => u.id === req.user.id);

      if (!user) {
        logger.warn(`Profile fetch failed: User ${req.user.id} not found`);
        return res.status(404).json({ message: 'User not found' });
      }

      const { password, ...userDetails } = user;
      logger.info(`Profile accessed: ${req.user.email}`);
      res.json(userDetails);
    });

    // 🔹 Save/Update User Profile Route
    app.post('/api/post_profile', authenticateToken, (req, res) => {
      const users = readFromFile(USERS_FILE);
      const userIndex = users.findIndex((u) => u.id === req.user.id);

      if (userIndex === -1) {
        logger.warn(`Profile update failed: User ${req.user.id} not found`);
        return res.status(404).json({ message: 'User not found' });
      }

      users[userIndex] = { ...users[userIndex], ...req.body };
      writeToFile(USERS_FILE, users);

      logger.info(`Profile updated for ${req.user.email}`);
      res.json({ message: 'Profile updated successfully', user: users[userIndex] });
    });

    // 🔹 Get User Profile Route
    app.get('/api/get_profile', authenticateToken, (req, res) => {
      const users = readFromFile(USERS_FILE);
      const user = users.find((u) => u.id === req.user.id);

      if (!user) {
        logger.warn(`Profile fetch failed: User ${req.user.id} not found`);
        return res.status(404).json({ message: 'User not found' });
      }

      const { password, ...userDetails } = user;
      logger.info(`Profile accessed: ${req.user.email}`);
      res.json(userDetails);
    });

    // ✅ Vehicle Routes
    const readVehicles = () => readFromFile(VEHICLES_FILE);
    const writeVehicles = (vehicles) => writeToFile(VEHICLES_FILE, vehicles);

    // 🔹 Get All Vehicles (Public)
    app.get('/api/vehicles', authenticateToken, (req, res) => {
      const vehicles = readVehicles();
      res.json(vehicles);
    });

    // 🔹 Get User's Vehicles
    app.get('/api/user/vehicles', authenticateToken, (req, res) => {
      const vehicles = readVehicles();
      const userVehicles = vehicles.filter((vehicle) => vehicle.ownerId === req.user.id);
      logger.info(`Vehicles fetched for user: ${req.user.email}`);
      res.json(userVehicles);
    });

    // 🔹 Get Vehicle by ID
    app.get('/api/vehicles/:id', (req, res) => {
      const vehicles = readVehicles();
      const vehicle = vehicles.find((v) => v.id === req.params.id);
      if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
      res.json(vehicle);
    });

    // 🔹 Add New Vehicle
    app.post(
      '/api/vehicles',
      authenticateToken,
      validateInput([
        check('type').notEmpty().withMessage('Type is required'),
        check('model').notEmpty().withMessage('Model is required'),
        check('number').notEmpty().withMessage('Number is required'),
        check('price').isNumeric().withMessage('Price must be a number'),
        check('location').notEmpty().withMessage('Location is required'),
      ]),
      (req, res) => {
        const { type, model, number, price, priceUnit, location, features, description, available, image } =
          req.body;
        let vehicles = readVehicles();
        let users = readFromFile(USERS_FILE);
        const user = users.find((u) => u.id === req.user.id);

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
        logger.info(`Vehicle added: ${newVehicle.model} by ${req.user.email}`);
        res.status(201).json(newVehicle);
      }
    );

    // 🔹 Update Vehicle
    app.put(
      '/api/vehicles/:id',
      authenticateToken,
      validateInput([
        check('price').optional().isNumeric().withMessage('Price must be a number'),
      ]),
      (req, res) => {
        const { id } = req.params;
        let vehicles = readVehicles();
        const vehicleIndex = vehicles.findIndex((v) => v.id === id);

        if (vehicleIndex === -1) {
          logger.warn(`Vehicle update failed: Vehicle ${id} not found`);
          return res.status(404).json({ message: 'Vehicle not found' });
        }

        if (vehicles[vehicleIndex].ownerId !== req.user.id) {
          logger.warn(`Unauthorized attempt to update vehicle ${id} by ${req.user.email}`);
          return res.status(403).json({ message: 'Unauthorized' });
        }

        vehicles[vehicleIndex] = { ...vehicles[vehicleIndex], ...req.body };
        writeVehicles(vehicles);
        logger.info(`Vehicle updated: ${id} by ${req.user.email}`);
        res.json(vehicles[vehicleIndex]);
      }
    );

    // 🔹 Delete Vehicle
    app.delete('/api/vehicles/:id', authenticateToken, (req, res) => {
      const { id } = req.params;
      let vehicles = readVehicles();
      const vehicleIndex = vehicles.findIndex((v) => v.id === id);

      if (vehicleIndex === -1) {
        logger.warn(`Vehicle deletion failed: Vehicle ${id} not found`);
        return res.status(404).json({ message: 'Vehicle not found' });
      }

      if (vehicles[vehicleIndex].ownerId !== req.user.id) {
        logger.warn(`Unauthorized attempt to delete vehicle ${id} by ${req.user.email}`);
        return res.status(403).json({ message: 'Unauthorized' });
      }

      vehicles.splice(vehicleIndex, 1);
      writeVehicles(vehicles);
      logger.info(`Vehicle deleted: ${id} by ${req.user.email}`);
      res.json({ message: 'Vehicle deleted successfully' });
    });

    // 🔹 Toggle Vehicle Availability
    app.patch('/api/vehicles/:id/availability', authenticateToken, (req, res) => {
      const { id } = req.params;
      const { available } = req.body;
      let vehicles = readVehicles();
      const vehicleIndex = vehicles.findIndex((v) => v.id === id);

      if (vehicleIndex === -1) {
        logger.warn(`Vehicle availability update failed: Vehicle ${id} not found`);
        return res.status(404).json({ message: 'Vehicle not found' });
      }

      if (vehicles[vehicleIndex].ownerId !== req.user.id) {
        logger.warn(`Unauthorized attempt to update vehicle ${id} by ${req.user.email}`);
        return res.status(403).json({ message: 'Unauthorized' });
      }

      vehicles[vehicleIndex].available = available;
      writeVehicles(vehicles);
      logger.info(`Vehicle availability updated: ${id} to ${available} by ${req.user.email}`);
      res.json({ message: 'Vehicle availability updated', vehicle: vehicles[vehicleIndex] });
    });

    // ✅ Booking Routes
    const readBookings = () => readFromFile(BOOKINGS_FILE);
    const writeBookings = (bookings) => writeToFile(BOOKINGS_FILE, bookings);

    // 🔹 Create Booking
    app.post(
      '/api/bookings',
      authenticateToken,
      validateInput([
        check('vehicleId').notEmpty().withMessage('Vehicle ID is required'),
        check('bookingDate').notEmpty().withMessage('Booking date is required'),
        check('duration').isNumeric().withMessage('Duration must be a number'),
      ]),
      (req, res) => {
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
          farmerMsg,
        } = req.body;

        const vehicles = readVehicles();
        const bookingsData = readBookings();
        const vehicle = vehicles.find((v) => v.id === vehicleId);

        if (!vehicle) {
          logger.warn(`Booking creation failed: Vehicle ${vehicleId} not found`);
          return res.status(404).json({ message: 'Vehicle not found' });
        }

        const newBooking = {
          id: uuidv4(),
          farmerId: req.user.id,
          ownerId: vehicle.ownerId,
          owner,
          vehicleId,
          vehicleModel,
          vehicleType,
          image,
          location,
          farmerMsg,
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
        logger.info(`Booking created for vehicle ${vehicleId} by ${req.user.email}`);
        res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
      }
    );

    // 🔹 Get All Bookings (Admin)
    app.get('/api/bookings', authenticateToken, (req, res) => {
      const bookings = readBookings();
      res.json(bookings);
    });

    // 🔹 Get Farmer's Bookings
    app.get('/api/user/bookings', authenticateToken, (req, res) => {
      const bookingsData = readBookings();

      if (!Array.isArray(bookingsData) || bookingsData.length === 0) {
        logger.warn(`No bookings found for user ${req.user.email}`);
        return res.json([]);
      }

      const userBookings = {
        upcoming: bookingsData.filter(
          (b) =>
            b.farmerId === req.user.id &&
            (b.status === 'Pending' || b.status === 'Ongoing' || b.status === 'Confirmed')
        ),
        past: bookingsData.filter(
          (b) =>
            b.farmerId === req.user.id &&
            (b.status === 'Completed' ||
              b.status === 'Cancelled' ||
              b.status === 'Rejected' ||
              b.status === 'Reviewed')
        ),
      };

      logger.info(`Bookings fetched for user ${req.user.email}`);
      res.json(userBookings);
    });

    // 🔹 Get Owner's Bookings
    app.get('/api/owner/bookings', authenticateToken, (req, res) => {
      const Allbookings = readBookings();

      if (!Array.isArray(Allbookings) || Allbookings.length === 0) {
        logger.warn(`No bookings found for owner ${req.user.email}`);
        return res.json([]);
      }

      const ownersBooking = {
        bookingRequest: Allbookings.filter(
          (b) => b.ownerId === req.user.id && b.status === 'Pending'
        ),
        activeBookings: Allbookings.filter(
          (b) => b.ownerId === req.user.id && (b.status === 'Ongoing' || b.status === 'Confirmed')
        ),
        bookingHistory: Allbookings.filter(
          (b) =>
            b.ownerId === req.user.id &&
            (b.status === 'Completed' ||
              b.status === 'Cancelled' ||
              b.status === 'Rejected' ||
              b.status === 'Reviewed')
        ),
      };

      logger.info(`Owner bookings fetched for user ${req.user.email}`);
      res.json(ownersBooking);
    });

    // 🔹 Update Booking Status (Owner Only)
    app.patch(
      '/api/owner/bookings/status',
      authenticateToken,
      validateInput([
        check('id').notEmpty().withMessage('Booking ID is required'),
        check('status').notEmpty().withMessage('Status is required'),
      ]),
      (req, res) => {
        const { cancellationReason, status, id } = req.body;
        let bookings = readBookings();
        const bookingIndex = bookings.findIndex((b) => b.id === id);

        if (bookingIndex === -1) {
          logger.warn(`Booking status update failed: Booking ${id} not found`);
          return res.status(404).json({ message: 'Booking not found' });
        }

        if ((bookings[bookingIndex].ownerId !== req.user.id)&&(bookings[bookingIndex].farmerId !== req.user.id)) {
          logger.warn(`Unauthorized attempt to update booking ${id} by ${req.user.email}`);
          return res.status(403).json({ message: 'Unauthorized' });
        }

        bookings[bookingIndex].status = status;
        bookings[bookingIndex].cancellationReason = cancellationReason;
        writeBookings(bookings);
        logger.info(`Booking status updated: ${id} to ${status} by ${req.user.email}`);
        res.json({ message: 'Booking status updated' });
      }
    );

    // 🔹 Submit Review (Farmer)
    app.patch(
      '/api/bookings/submitReview',
      authenticateToken,
      validateInput([
        check('bookingId').notEmpty().withMessage('Booking ID is required'),
        check('rating').isNumeric().withMessage('Rating must be a number'),
        check('feedback').notEmpty().withMessage('Feedback is required'),
        check('status').notEmpty().withMessage('Status is required'),
      ]),
      (req, res) => {
        const { bookingId, rating, feedback, status } = req.body;
        let bookings = readBookings();
        const bookingIndex = bookings.findIndex((b) => b.id === bookingId);

        if (bookingIndex === -1) {
          logger.warn(`Review submission failed: Booking ${bookingId} not found`);
          return res.status(404).json({ message: 'Booking not found' });
        }

        if (bookings[bookingIndex].farmerId !== req.user.id) {
          logger.warn(`Unauthorized attempt to submit review for booking ${bookingId} by ${req.user.email}`);
          return res.status(403).json({ message: 'Unauthorized' });
        }

        bookings[bookingIndex].feedback = feedback;
        bookings[bookingIndex].rating = rating;
        bookings[bookingIndex].status = status;
        writeBookings(bookings);
        logger.info(`Review submitted for booking ${bookingId} by ${req.user.email}`);
        res.json({ message: 'Successfully Reviewed' });
      }
    );

    // 🔹 Cancel Booking (Farmer)
    app.delete('/api/bookings/:id', authenticateToken, (req, res) => {
      const { id } = req.params;
      let bookings = readBookings();
      const bookingIndex = bookings.findIndex((b) => b.id === id);

      if (bookingIndex === -1) {
        logger.warn(`Booking cancellation failed: Booking ${id} not found`);
        return res.status(404).json({ message: 'Booking not found' });
      }

      if (bookings[bookingIndex].farmerId !== req.user.id) {
        logger.warn(`Unauthorized attempt to cancel booking ${id} by ${req.user.email}`);
        return res.status(403).json({ message: 'Unauthorized' });
      }

      bookings.splice(bookingIndex, 1);
      writeBookings(bookings);
      logger.info(`Booking cancelled: ${id} by ${req.user.email}`);
      res.json({ message: 'Booking cancelled successfully' });
    });



    //Razorpay Implementation

    const Razorpay = require('razorpay');

// ✅ Initialize Razorpay
const razorpay = new Razorpay({
  key_id: 'rzp_test_b1A45GxApr12tC', // Replace with your test key
  key_secret: 'eX23SrTBzN95la1NNnJ5y5nt', // Replace with your secret key
});


    app.post("/api/create-order", async (req, res) => {
      try {
        const { amount, currency } = req.body;
    
        const options = {
          amount: amount * 100, // Convert to paise
          currency: currency || "INR",
          receipt: `receipt_${Date.now()}`,
        };
    
        const order = await razorpay.orders.create(options);
        res.json(order);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });




    const crypto = require("crypto");

app.post("/api/verify-payment", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const generated_signature = crypto
    .createHmac("sha256", "eX23SrTBzN95la1NNnJ5y5nt")
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generated_signature === razorpay_signature) {
    res.json({ success: true, message: "Payment verified successfully" });
  } else {
    res.status(400).json({ success: false, message: "Payment verification failed" });
  }
});

    

    // ✅ Start Server
    app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
    //devtest
