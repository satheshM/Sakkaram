const express = require('express');
const { check } = require('express-validator');
const { fetchAllVehicles, fetchUserVehicles, fetchVehicleById, addVehicle, modifyVehicle, removeVehicle, toggleVehicleAvailability } = require('../controllers/vehicleController');
const authenticateToken = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', fetchAllVehicles);
router.get('/owner', authenticateToken, fetchUserVehicles);
router.get('/:id', fetchVehicleById);

router.post(
  '/',
  authenticateToken,
  [
    check('model').notEmpty().withMessage('Model is required'),
    check('type').notEmpty().withMessage('Type is required'),
    check('price').isNumeric().withMessage('Price must be a number'),
  ],
  addVehicle
);

router.put('/:id', authenticateToken, modifyVehicle);
router.patch('/:id/availability', authenticateToken, toggleVehicleAvailability);
router.delete('/:id', authenticateToken, removeVehicle);

module.exports = router;
