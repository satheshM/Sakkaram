


const {findOwnerTransactions,fetchOwnerEarnings } = require('../models/earningModel');


const getTransactions = async (req, res) => {
  try {
    const transactions = await findOwnerTransactions(req.user.id);
    if (!transactions) return res.status(404).json({ success: false, error: 'User not found' });

  
    res.json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch profile'+error });
  }
};

const earningDetails = async (req, res) => {
  try {
    const EarningDetails = await fetchOwnerEarnings(req.user.id);
    if (!EarningDetails) return res.status(404).json({ success: false, error: 'Failed to fetch earning Details' });

  
    res.json({ success: true, EarningDetails: EarningDetails });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch earning Details'+error });
  }
};


module.exports = {getTransactions,earningDetails };
