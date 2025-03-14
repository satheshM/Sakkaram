import React, { useState } from "react";
import { FaWallet, FaPlusCircle, FaMoneyBillWave, FaRupeeSign } from "react-icons/fa";

// Utility function to get transaction status badge color
const getTransactionColor = (type) => {
  switch (type) {
    case "Received":
      return "bg-green-100 text-green-800";
    case "Withdrawn":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const Wallet = () => {
  const [balance, setBalance] = useState(2500); // Initial Balance
  const [transactions, setTransactions] = useState([
    { id: 1, type: "Received", amount: 1000, date: "2025-03-13" },
    { id: 2, type: "Withdrawn", amount: 500, date: "2025-03-12" },
  ]);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [amount, setAmount] = useState("");

  // Handle Adding Money
  const handleAddMoney = () => {
    if (amount > 0) {
      setBalance(balance + parseInt(amount));
      setTransactions([
        { id: transactions.length + 1, type: "Received", amount: parseInt(amount), date: new Date().toISOString().split("T")[0] },
        ...transactions,
      ]);
      setAmount("");
      setShowAddMoney(false);
    }
  };

  // Handle Withdrawing Money
  const handleWithdraw = () => {
    if (amount > 0 && amount <= balance) {
      setBalance(balance - parseInt(amount));
      setTransactions([
        { id: transactions.length + 1, type: "Withdrawn", amount: parseInt(amount), date: new Date().toISOString().split("T")[0] },
        ...transactions,
      ]);
      setAmount("");
      setShowWithdraw(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen pt-20 pb-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Wallet</h1>

        {/* Wallet Card */}
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <FaWallet className="text-4xl text-green-600 mx-auto mb-2" />
          <p className="text-lg font-semibold text-gray-700">Available Balance</p>
          <p className="text-3xl font-bold text-green-800 mt-2">₹{balance}</p>

          {/* Buttons */}
          <div className="flex justify-center mt-4 space-x-4">
            <button
              onClick={() => setShowAddMoney(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 flex items-center"
            >
              <FaPlusCircle className="mr-2" /> Add Money
            </button>
            <button
              onClick={() => setShowWithdraw(true)}
              className="bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-600 flex items-center"
            >
              <FaMoneyBillWave className="mr-2" /> Withdraw
            </button>
          </div>
        </div>

        {/* Transaction History */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Transaction History</h2>
          <div className="bg-white rounded-lg shadow-md p-4">
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <div key={tx.id} className="flex justify-between border-b py-2">
                  <span className={`px-2 py-1 rounded ${getTransactionColor(tx.type)}`}>
                    {tx.type} - ₹{tx.amount}
                  </span>
                  <span className="text-gray-600">{tx.date}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No transactions yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Add Money Modal */}
      {showAddMoney && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h2 className="text-lg font-semibold text-green-800">Add Money</h2>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-3"
            />
            <div className="flex justify-center space-x-3 mt-4">
              <button onClick={handleAddMoney} className="bg-green-600 text-white px-4 py-2 rounded">Add</button>
              <button onClick={() => setShowAddMoney(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Money Modal */}
      {showWithdraw && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h2 className="text-lg font-semibold text-red-800">Withdraw Money</h2>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-3"
            />
            <div className="flex justify-center space-x-3 mt-4">
              <button onClick={handleWithdraw} className="bg-red-600 text-white px-4 py-2 rounded">Withdraw</button>
              <button onClick={() => setShowWithdraw(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
