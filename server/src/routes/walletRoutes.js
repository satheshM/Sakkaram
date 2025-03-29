const express = require("express");
const {
  getWalletBalance,
  getTransactions,
  createPayment,
  verifyPayment,
  withdrawMoney
} = require("../controllers/walletController");

const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.get("/balance", authenticateToken,getWalletBalance);
router.get("/transactions",authenticateToken, getTransactions);
router.post("/payment",authenticateToken, createPayment);
router.post("/payment/verify",authenticateToken, verifyPayment);
router.post("/withdraw",authenticateToken, withdrawMoney);

module.exports = router;
