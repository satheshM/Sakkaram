const express = require('express');
const {
 getTransactions,
 earningDetails,
 Withdrawn

} = require('../controllers/earningController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/getTransactions', authenticateToken, getTransactions);
router.get('/earningDetails', authenticateToken, earningDetails);
router.post('/withdrawn', authenticateToken, Withdrawn);


module.exports = router;
