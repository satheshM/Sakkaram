const Razorpay = require("razorpay");
const { createClient } = require("@supabase/supabase-js");
const crypto = require("crypto");
require("dotenv").config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// 🎮 Fetch Wallet Balance
const getWalletBalance = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: wallet, error } = await supabase
      .from("wallets")
      .select("balance")
      .eq("user_id", userId)
      .single();

    if (error) throw new Error("Error fetching wallet balance");

    res.status(200).json({ balance: wallet.balance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🎮 Fetch Transactions
const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id

    const { data: wallet } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", userId)
      .single();

    const { data: transactions, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("wallet_id", wallet.id)
      .order("created_at", { ascending: false });

    if (error) throw new Error("Error fetching transactions");

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🎮 Create Payment (Add Money)
const createPayment = async (req, res) => {
  try {
    const { amount } = req.body;

    const userId = req.user.id

    // Create Razorpay Order
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `wallet_txn_${Date.now()}`,
    });


    const { data: wallet, error } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", userId)
      .single();
    // Store Transaction
   const resp= await supabase.from("transactions").insert({
      wallet_id: wallet.id,
      type: "deposit",
      amount,
      reference_id: order.id,
      status: "Pending",
    });

    res.status(200).json({
      orderId: order.id,
      amount: order.amount
    });
  } catch (error) {
    res.status(500).json({ error: error});
  }
};

// 🎮 Verify Payment
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify Signature
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== razorpay_signature) {
      throw new Error("Invalid payment signature");
    }

    // Fetch Transaction
    const { data: transaction, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("reference_id", razorpay_order_id)
      .single();

    if (error) throw new Error("Transaction not found");

    // // Update Wallet Balance
    // await supabase.rpc("increment_wallet_balance", {
    //   user_id: req.user.id,
    //   amount: transaction.amount,
    // });

    // ✅ Fetch User's Current Wallet Balance
    const { data: wallet, error: walletError } = await supabase
      .from("wallets")
      .select("balance")
      .eq("user_id", req.user.id)
      .single();

    if (walletError || !wallet) throw new Error("Wallet not found");

    const newBalance = wallet.balance + transaction.amount;

    // ✅ Update Wallet Balance
    const { error: updateError } = await supabase
      .from("wallets")
      .update({ balance: newBalance })
      .eq("user_id", req.user.id);

    if (updateError) throw new Error("Failed to update wallet balance");

    // Update Transaction Status
    await supabase.from("transactions").update({
      status: "Success",
      reference_id: razorpay_payment_id,
    }).eq("reference_id", razorpay_order_id);

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success:false,msg: error.message });
  }
};

// 🎮 Withdraw Money
const withdrawMoney = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user.id

    // Fetch Balance
    const { data: wallet, error: walletError } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (walletError) throw new Error("Error fetching wallet balance");
    if (amount > wallet.balance) throw new Error("Insufficient Balance");

    const newBalance = wallet.balance-amount;

    // ✅ Update Wallet Balance
    const { error: updateError } = await supabase
      .from("wallets")
      .update({ balance: newBalance })
      .eq("user_id", userId);

    if (updateError) throw new Error("Failed to update wallet balance");
    // Record Transaction
    const {error: transUpdateError}=await supabase.from("transactions").insert({
      wallet_id: wallet.id,
      type: "withdraw",
      amount,
      reference_id: `withdraw_${Date.now()}`,
      status: "Success",
    });

    res.status(200).json({ message: "Withdrawal successful",error:transUpdateError});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getWalletBalance,
  getTransactions,
  createPayment,
  verifyPayment,
  withdrawMoney,
};
