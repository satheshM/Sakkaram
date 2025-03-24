const express = require('express');
const { check } = require('express-validator');
const { getAllVehicles, addVehicle, updateVehicle, deleteVehicle } = require('../controllers/vehicleController');
const authenticateToken = require('../middlewares/authMiddleware');
const validateInput = require('../middlewares/validateMiddleware');

const router = express.Router();

router.get('/', authenticateToken, getAllVehicles);
router.post(
  '/',
  authenticateToken,
  validateInput([
    check('type').notEmpty().withMessage('Type is required'),
    check('model').notEmpty().withMessage('Model is required'),
    check('number').notEmpty().withMessage('Number is required'),
    check('price').isNumeric().withMessage('Price must be a number'),
    check('location').notEmpty().withMessage('Location is required'),
  ]),
  addVehicle
);
router.put('/:id', authenticateToken, updateVehicle);
router.delete('/:id', authenticateToken, deleteVehicle);

module.exports = router;
