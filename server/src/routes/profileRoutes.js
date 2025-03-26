const express = require('express');
const authenticateToken = require('../middlewares/authMiddleware');
const { getUserProfile,updateUserProfile } = require('../controllers/profileController');


const router = express.Router();

router.get('/getProfile',authenticateToken, getUserProfile);
router.put('/updateProfile',authenticateToken, updateUserProfile);

module.exports = router;
