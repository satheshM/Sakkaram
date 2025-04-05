


const {findOwnerTransactions,fetchOwnerEarnings,OwnerWithdrawn } = require('../models/earningModel');


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

const Withdrawn = async (req, res) => {
  try {
    const WithdrawnDetails = await OwnerWithdrawn(req.user.id,req.body);
    if (!WithdrawnDetails) return res.status(404).json({ success: false, error: 'Failed to fetch Withdrawn Details' });

  
    res.json({ success: true, WithdrawnDetails: WithdrawnDetails });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to Withdraw'+error });
  }
};


module.exports = {getTransactions,earningDetails,Withdrawn };
