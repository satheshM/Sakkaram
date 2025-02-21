import React, { useState } from "react";

const Earnings = () => {
  // Sample Earnings Data
  const [earnings, setEarnings] = useState({
    totalEarnings: 15000, // Total earnings in ₹
    pendingEarnings: 5000, // Amount not yet withdrawn
    withdrawnAmount: 10000, // Already withdrawn
  });

  // Sample Transaction History
  const [transactions, setTransactions] = useState([
    { id: 1, date: "2025-02-10", amount: 3000, status: "Completed" },
    { id: 2, date: "2025-02-08", amount: 2000, status: "Completed" },
    { id: 3, date: "2025-02-05", amount: 5000, status: "Completed" },
  ]);

  // Withdrawal Handling
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMessage, setWithdrawMessage] = useState("");

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (amount > 0 && amount <= earnings.pendingEarnings) {
      setEarnings({
        ...earnings,
        pendingEarnings: earnings.pendingEarnings - amount,
        withdrawnAmount: earnings.withdrawnAmount + amount,
      });

      // Add new transaction
      setTransactions([
        { id: transactions.length + 1, date: new Date().toISOString().split("T")[0], amount, status: "Completed" },
        ...transactions,
      ]);

      setWithdrawMessage(`₹${amount} withdrawn successfully!`);
      setWithdrawAmount("");
    } else {
      setWithdrawMessage("Invalid amount. Check your pending balance.");
    }
  };

  return (
    <div className="p-6">
      {/* 🔹 Header */}
      <h1 className="text-2xl font-bold mb-4">Earnings & Transactions</h1>

      {/* 🔹 Earnings Overview */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 border rounded bg-green-100 text-center">
          <h2 className="text-lg font-semibold">Total Earnings</h2>
          <p className="text-2xl font-bold">₹{earnings.totalEarnings}</p>
        </div>
        <div className="p-4 border rounded bg-yellow-100 text-center">
          <h2 className="text-lg font-semibold">Pending Earnings</h2>
          <p className="text-2xl font-bold">₹{earnings.pendingEarnings}</p>
        </div>
        <div className="p-4 border rounded bg-blue-100 text-center">
          <h2 className="text-lg font-semibold">Withdrawn Amount</h2>
          <p className="text-2xl font-bold">₹{earnings.withdrawnAmount}</p>
        </div>
      </div>

      {/* 🔹 Withdrawal Section */}
      <div className="p-4 border rounded mb-6 bg-gray-100">
        <h2 className="text-lg font-semibold mb-2">Withdraw Earnings</h2>
        <input
          type="number"
          placeholder="Enter amount"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
          className="border p-2 rounded mr-2 w-1/3"
        />
        <button
          onClick={handleWithdraw}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Withdraw
        </button>
        {withdrawMessage && <p className="mt-2 text-green-600">{withdrawMessage}</p>}
      </div>

      {/* 🔹 Transaction History */}
      <div className="p-4 border rounded bg-white">
        <h2 className="text-lg font-semibold mb-2">Transaction History</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Date</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn.id} className="text-center">
                <td className="border p-2">{txn.date}</td>
                <td className="border p-2">₹{txn.amount}</td>
                <td className="border p-2">
                  <span className={`px-2 py-1 rounded ${txn.status === "Completed" ? "bg-green-300" : "bg-yellow-300"}`}>
                    {txn.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Earnings;
