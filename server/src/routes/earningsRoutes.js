const express = require('express');
const {
 getTransactions,
 earningDetails

} = require('../controllers/earningController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/getTransactions', authenticateToken, getTransactions);
router.get('/details', authenticateToken, earningDetails);


module.exports = router;
