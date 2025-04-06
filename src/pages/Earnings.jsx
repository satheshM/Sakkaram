import React, { useState,useEffect } from "react";
import { FaChartLine, FaCalendarAlt, FaTractor, FaWallet, FaDownload, FaExclamationCircle } from "react-icons/fa";
import {getOwnerTransactions,GetEarningDetails,OwnerWithdrawn} from '../api/earnings'
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import MonthlyEarningsChart from "../components/charts/MonthlyEarningsChart";
import VehiclePerformanceBarChart from '../components/charts/VehiclePerformanceBarChart';
const Earnings = () => {
  //Sample Earnings Data
  // const [earnings, setEarnings] = useState({
  //   totalEarnings: 15000, // Total earnings in ₹
  //   pendingEarnings: 5000, // Amount not yet withdrawn
  //   withdrawnAmount: 10000, // Already withdrawn
  //   monthlyEarnings: [
  //     { month: "Jan", amount: 2000 },
  //     { month: "Feb", amount: 3000 },
  //     { month: "Mar", amount: 5000 },
  //     { month: "Apr", amount: 2500 },
  //     { month: "May", amount: 2500 },
  //   ],
  //   vehiclePerformance: [
  //     { id: 1, name: "Mahindra 575 DI Tractor", earnings: 8000, bookings: 16 },
  //     { id: 2, name: "John Deere Harvester", earnings: 7000, bookings: 6 },
  //   ]
  // });

  // const [earnings, setEarnings] = useState({
  //   totalEarnings: 4180.95, // Total earnings in ₹
  //   pendingEarnings: 4180.95, // Amount not yet withdrawn
  //   withdrawnAmount: 0, // Already withdrawn
  //   monthlyEarnings: [
  //     { month: "Apr", amount: 4180.95 }
  //   ],
  //   vehiclePerformance: [
  //     { id: "dc9acfb0-7315-41b9-90f3-48f8d065f8e1", name: "Johndeer123", earnings: 1158.07, bookings: 1 },
  //     { id: "8c75298b-f536-48f7-b053-e49fb6aa91aa", name: "Mahindra 575", earnings: 3022.88, bookings: 1 }
  //   ]
  // });
  

  // Sample Transaction History
  const [earnings, setEarnings] = useState(
    {
        totalEarnings: 0, // Total earnings in ₹
        pendingEarnings: 0, // Amount not yet withdrawn
        withdrawnAmount: 0, // Already withdrawn
        monthlyEarnings: []
        ,
        vehiclePerformance: []
      }
  )
  const [transactions, setTransactions] = useState([])
  // const [transactions, setTransactions] = useState([
  //   { 
  //     id: 1, 
  //     date: "2025-03-10", 
  //     amount: 3000, 
  //     status: "Completed", 
  //     type: "Withdrawal",
  //     method: "Bank Transfer",
  //     reference: "TXN123456789"
  //   },
  //   { 
  //     id: 2, 
  //     date: "2025-03-08", 
  //     amount: 2000, 
  //     status: "Completed", 
  //     type: "Withdrawal",
  //     method: "UPI",
  //     reference: "UPI123456789"
  //   },
  //   { 
  //     id: 3, 
  //     date: "2025-03-05", 
  //     amount: 5000, 
  //     status: "Completed", 
  //     type: "Withdrawal",
  //     method: "Bank Transfer",
  //     reference: "TXN987654321"
  //   },
  //   { 
  //     id: 4, 
  //     date: "2025-03-02", 
  //     amount: 2500, 
  //     status: "Completed", 
  //     type: "Earning",
  //     vehicle: "Mahindra 575 DI Tractor",
  //     farmer: "Ramesh Kumar"
  //   },
  //   { 
  //     id: 5, 
  //     date: "2025-02-28", 
  //     amount: 6000, 
  //     status: "Completed", 
  //     type: "Earning",
  //     vehicle: "John Deere Harvester",
  //     farmer: "Suresh Patel"
  //   },
  // ]);

// fetch transaction from API

 useEffect(() => {
    const fetchEarningsData = async () => {
      try {
        const response = await getOwnerTransactions();

        if (response.status === 200) {
          const transactions = await response.json();

          setTransactions(transactions.transactions.data);
        } else {
          console.log('failed to fetch Owner Transactions');
        }
      } catch (error) {
        console.error('Error fetching Owner Transactions:', error);
      }

      try {
        const response = await GetEarningDetails();

        if (response.status === 200) {
          const earningsData = await response.json();
          setEarnings(earningsData.EarningDetails)

         
        } else {
          console.log('failed to fetch Owner EarningDetails');
        }
      } catch (error) {
        console.error('Error fetching Owner EarningDetails:', error);
      }
    };

    fetchEarningsData();
  }, []);


  
const exportTransactionsAsPDF = (transactions) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // ========== HEADER ==========
  doc.setFontSize(18);
  doc.setTextColor(40);
  doc.setFont("helvetica", "bold");
  doc.text("SAKKARAM", pageWidth / 2, 15, { align: "center" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Transaction History", pageWidth / 2, 23, { align: "center" });

  // Optional: add watermark or background logo
  // const img = new Image();
  // img.src = "your-logo.png"; // PNG recommended; SVG support is limited
  // doc.addImage(img, "PNG", pageWidth - 40, 5, 25, 10); // Right corner logo

  // ========== TABLE ==========
  const tableColumn = ["Date", "Type", "Details", "Amount", "Status"];
  const tableRows = [];

  transactions.forEach((txn) => {
    const date = new Date(txn.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    const details =
      txn.type === "Withdrawal"
        ? `Method: ${txn.method || "N/A"}\nRef: ${txn.reference || "N/A"}`
        : `Vehicle: ${txn.vehicle || "N/A"}\nFarmer: ${txn.farmer || "N/A"}`;

    const amount = `${txn.type === "Earning" ? "+" : "-"} ₹${txn.amount.toLocaleString("en-IN")}`;
    const status = txn.status === "Success" ? "Completed" : "Failed";

    tableRows.push([date, txn.type, details, amount, status]);
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 30,
    theme: "striped",
    styles: {
      fontSize: 10,
      cellPadding: 3,
      overflow: "linebreak",
    },
    columnStyles: {
      3: { halign: "right", fontStyle: "bold", font: "courier" }, // Amount alignment and monospaced
    },
    headStyles: {
      fillColor: [22, 160, 133],
      textColor: 255,
      fontStyle: "bold",
    },
  });

  // ========== FOOTER ==========
  doc.setDrawColor(200);
  doc.line(10, pageHeight - 20, pageWidth - 10, pageHeight - 20); // Footer separator

  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.setFont("helvetica", "normal");

  doc.text("abc Gate, Sakkaram Village, India - 635242", 14, pageHeight - 14);
  doc.text("support@sakkaram.com | www.sakkaram.logo", 14, pageHeight - 8);

  // ========== SAVE ==========
  doc.save("transaction-history.pdf");
};





  // Withdrawal Handling
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("bank");
  const [accountDetails, setAccountDetails] = useState({
    accountNumber: "",
    ifscCode: "",
    accountName: "",
    upiId: ""
  });
  const [withdrawMessage, setWithdrawMessage] = useState("");
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const handleWithdraw = async() => {
    const amount = parseFloat(withdrawAmount);
    if (amount <= 0 || isNaN(amount)) {
      setWithdrawMessage("Please enter a valid amount");
      return;
    }
    
    if (amount > earnings.pendingEarnings) {
      setWithdrawMessage("Amount exceeds your available balance");
      return;
    }
    
    if (withdrawMethod === "bank" && (!accountDetails.accountNumber || !accountDetails.ifscCode || !accountDetails.accountName)) {
      setWithdrawMessage("Please fill in all bank account details");
      return;
    }
    
    if (withdrawMethod === "upi" && !accountDetails.upiId) {
      setWithdrawMessage("Please enter your UPI ID");
      return;
    }
    
    try {

      
      let req = {
        amount: amount,
        withdrawMethod: withdrawMethod
      };
      
      if (withdrawMethod === "upi") {
        req.upiId = accountDetails.upiId;
      } else if (withdrawMethod === "bank") {
        req.accountNumber = accountDetails.accountNumber;
        req.ifscCode = accountDetails.ifscCode;
        req.accountName = accountDetails.accountName;
      }
      const response = await OwnerWithdrawn(req);

      if (response.status === 200) {
        // const earningsData = await response.json();
        // setEarnings(earningsData.EarningDetails)

       
      } else {
        console.log('Failed to withdrawn');
      }
    } catch (error) {
      console.error('Failed to withdrawn', error);
    }

    // Process withdrawal
    setEarnings({
      ...earnings,
      pendingEarnings: earnings.pendingEarnings - amount,
      withdrawnAmount: earnings.withdrawnAmount + amount,
    });

    // Add new transaction
    const newTransaction = {
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      amount,
      status: "Processing",
      type: "Withdrawal",
      method: withdrawMethod === "bank" ? "Bank Transfer" : "UPI",
      reference: "TXN" + Math.floor(Math.random() * 1000000000)
    };
    
    setTransactions([newTransaction, ...transactions]);
    setWithdrawMessage(`₹${amount} withdrawal initiated successfully!`);
    setWithdrawAmount("");
    setShowWithdrawForm(false);
    
    // Simulate transaction completion after 2 seconds
    setTimeout(() => {
      setTransactions(prev => 
        prev.map(txn => 
          txn.id === newTransaction.id ? { ...txn, status: "Completed" } : txn
        )
      );
    }, 2000);
  };

  // Calculate highest earning month
  const highestEarningMonth = earnings?.monthlyEarnings.reduce(
    (max, month) => (month.amount > max.amount ? month : max),
    { month: "", amount: 0 }
  );

  // Calculate highest earning vehicle
  const highestEarningVehicle = earnings?.vehiclePerformance.reduce(
    (max, vehicle) => (vehicle.earnings > max.earnings ? vehicle : max),
    { name: "", earnings: 0 }
  );

  return (
    <div className="bg-gray-100 min-h-screen pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Earnings & Transactions</h1>
        
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            {[
              { id: "overview", label: "Overview" },
              { id: "transactions", label: "Transactions" },
              { id: "analytics", label: "Analytics" },
              { id: "withdraw", label: "Withdraw" }
            ].map((tab) => (
              <button
                key={tab.id}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === tab.id
                    ? "border-b-2 border-green-500 text-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            {/* Earnings Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="rounded-full bg-green-100 p-3 mr-4">
                    <FaChartLine className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Earnings</p>
                    <p className="text-2xl font-bold">₹{earnings?.totalEarnings.toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Lifetime earnings from all your vehicles
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="rounded-full bg-blue-100 p-3 mr-4">
                    <FaWallet className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Available Balance</p>
                    <p className="text-2xl font-bold">₹{earnings?.pendingEarnings.toLocaleString()}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab("withdraw")}
                  className="text-blue-600 text-sm hover:underline flex items-center"
                >
                  Withdraw Funds
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="rounded-full bg-purple-100 p-3 mr-4">
                    <FaCalendarAlt className="text-purple-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">This Month</p>
                    <p className="text-2xl font-bold">₹{earnings?.monthlyEarnings.length  !== 0?earnings.monthlyEarnings[earnings.monthlyEarnings.length - 1]?.amount.toLocaleString():0}</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {/* {earnings.monthlyEarnings[earnings.monthlyEarnings.length - 1].amount > earnings.monthlyEarnings[earnings.monthlyEarnings.length - 2].amount ? (
                    <span className="text-green-600">↑ {Math.round(((earnings.monthlyEarnings[earnings.monthlyEarnings.length - 1].amount - earnings.monthlyEarnings[earnings.monthlyEarnings.length - 2].amount) / earnings.monthlyEarnings[earnings.monthlyEarnings.length - 2].amount) * 100)}% from last month</span>
                  ) : (
                    <span className="text-red-600">↓ {Math.round(((earnings.monthlyEarnings[earnings.monthlyEarnings.length - 2].amount - earnings.monthlyEarnings[earnings.monthlyEarnings.length - 1].amount) / earnings.monthlyEarnings[earnings.monthlyEarnings.length - 2].amount) * 100)}% from last month</span>
                  )} */}
                  {earnings.monthlyEarnings.length > 1 ? (
  earnings.monthlyEarnings[earnings.monthlyEarnings.length - 1].amount >
  earnings.monthlyEarnings[earnings.monthlyEarnings.length - 2].amount ? (
    <span className="text-green-600">
      ↑ {Math.round(
        ((earnings.monthlyEarnings[earnings.monthlyEarnings.length - 1].amount -
          earnings.monthlyEarnings[earnings.monthlyEarnings.length - 2].amount) /
          earnings.monthlyEarnings[earnings.monthlyEarnings.length - 2].amount) * 100
      )}% from last month
    </span>
  ) : (
    <span className="text-red-600">
      ↓ {Math.round(
        ((earnings.monthlyEarnings[earnings.monthlyEarnings.length - 2].amount -
          earnings.monthlyEarnings[earnings.monthlyEarnings.length - 1].amount) /
          earnings.monthlyEarnings[earnings.monthlyEarnings.length - 2].amount) * 100
      )}% from last month
    </span>
  )
) : (
  <span className="text-gray-600">No previous data to compare</span>
)}

                </div>
              </div>
            </div>
            
            {/* Monthly Earnings Chart */}
            {/* <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-lg font-semibold mb-4">Monthly Earnings</h2>
              <div className="h-64 flex items-end justify-between px-2">
                {earnings.monthlyEarnings.map((month, index) => {
                  const percentage = (month.amount / highestEarningMonth.amount) * 100;
                  return (
                    <div key={index} className="flex flex-col items-center">
                      <div 
                        className={`w-12 bg-green-500 rounded-t-md ${
                          month.month === highestEarningMonth.month ? 'bg-green-600' : ''
                        }`} 
                        style={{ height: `${percentage}%` }}
                      ></div>
                      <div className="text-xs mt-2">{month.month}</div>
                      <div className="text-xs font-semibold">₹{month.amount}</div>
                    </div>
                  );
                })}
              </div>
            </div> */}

<div className="bg-white p-6 rounded-lg shadow-md mb-6">
  <h2 className="text-lg font-semibold mb-4">Monthly Earnings</h2>
 <MonthlyEarningsChart data={earnings.monthlyEarnings} />
</div>

            
            {/* Vehicle Performance */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-lg font-semibold mb-4">Vehicle Performance</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Earnings</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Per Booking</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {earnings.vehiclePerformance.map((vehicle) => (
                      <tr key={vehicle.id} className={vehicle.name === highestEarningVehicle.name ? "bg-green-50" : ""}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FaTractor className={`mr-2 ${vehicle.name === highestEarningVehicle.name ? "text-green-600" : "text-gray-400"}`} />
                            <div className="text-sm font-medium text-gray-900">{vehicle.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">₹{vehicle.earnings.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{vehicle.bookings}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">₹{Math.round(vehicle.earnings / vehicle.bookings).toLocaleString()}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Recent Transactions */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Recent Transactions</h2>
                <button 
                  onClick={() => setActiveTab("transactions")}
                  className="text-green-600 text-sm hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                  {[...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5).map((txn) => (

                      <tr key={txn.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{new Date(txn.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{txn.type}</div>
                          <div className="text-xs text-gray-500">
                            {txn.type === "Withdrawal" ? txn.method : txn.vehicle}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${txn.type === "Earning" ? "text-green-600" : "text-red-600"}`}>
                            {txn.type === "Earning" ? "+" : "-"}₹{txn.amount.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            txn.status === "Success" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {txn.status ==='Success'?'Completed':'Failed'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
        
        {/* Transactions Tab */}
        {activeTab === "transactions" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Transaction History</h2>
              <button
              onClick={() => exportTransactionsAsPDF(transactions)} className="flex items-center text-green-600 text-sm hover:underline">
                <FaDownload className="mr-1" />
                Download
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {[...transactions]
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .map((txn) => (
                    <tr key={txn.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{new Date(txn.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{txn.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {txn.type === "Withdrawal" ? (
                          <div>
                            <div className="text-sm text-gray-900">{txn.method}</div>
                            <div className="text-xs text-gray-500">Ref: {txn.reference}</div>
                          </div>
                        ) : (
                          <div>
                            <div className="text-sm text-gray-900">{txn.vehicle}</div>
                            <div className="text-xs text-gray-500">Farmer: {txn.farmer}</div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${txn.type === "Earning" ? "text-green-600" : "text-red-600"}`}>
                          {txn.type === "Earning" ? "+" : "-"}₹{txn.amount.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          txn.status === "Success" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {txn.status ==='Success'?'Completed':'failed'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Key Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Highest Earning Month</p>
                  <p className="text-xl font-bold text-gray-900">{highestEarningMonth.month}</p>
                  <p className="text-sm text-green-600">₹{highestEarningMonth.amount.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Highest Earning Vehicle</p>
                  <p className="text-xl font-bold text-gray-900 truncate">{highestEarningVehicle.name.split(' ')[0]}</p>
                  <p className="text-sm text-green-600">₹{highestEarningVehicle.earnings.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Average Per Booking</p>
                  <p className="text-xl font-bold text-gray-900">₹{(earnings.monthlyEarnings.length !== 0)?Math.round(earnings.totalEarnings / earnings.vehiclePerformance.reduce((sum, v) => sum + v.bookings, 0)).toLocaleString():0}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Bookings</p>
                  <p className="text-xl font-bold text-gray-900">{earnings.vehiclePerformance.reduce((sum, v) => sum + v.bookings, 0)}</p>
                </div>
              </div>
            </div>
            
           
              
              {/* Booking Frequency by Vehicle */}
<div className="bg-white p-6 rounded-lg shadow-md">
  <VehiclePerformanceBarChart data={earnings.vehiclePerformance} />
</div>
            
            
            {/* Insights */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Insights & Recommendations</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <FaExclamationCircle className="text-blue-500 mt-1" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">Pricing Optimization</h3>
                    <p className="text-sm text-gray-500">
                      Your {highestEarningVehicle.name} is your most profitable vehicle. Consider adjusting prices for other vehicles to maximize earnings.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <FaExclamationCircle className="text-blue-500 mt-1" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">Seasonal Trends</h3>
                    <p className="text-sm text-gray-500">
                      Your earnings peak in {highestEarningMonth.month}. Plan maintenance and availability to capitalize on this high-demand period.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <FaExclamationCircle className="text-blue-500 mt-1" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">Vehicle Expansion</h3>
                    <p className="text-sm text-gray-500">
                      Based on your earnings pattern, adding another tractor to your fleet could increase your monthly revenue by approximately 40%.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Withdraw Tab */}
        {activeTab === "withdraw" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-6">Withdraw Funds</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Available Balance</p>
                <p className="text-2xl font-bold text-green-600">₹{earnings.pendingEarnings.toLocaleString()}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Withdrawn Amount</p>
                <p className="text-2xl font-bold text-blue-600">₹{earnings.withdrawnAmount.toLocaleString()}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-purple-600">₹{earnings.totalEarnings.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Withdrawal Amount</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">₹</span>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Withdrawal Method</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="withdrawMethod"
                    value="bank"
                    checked={withdrawMethod === "bank"}
                    onChange={() => setWithdrawMethod("bank")}
                    className="mr-2"
                  />
                  <span>Bank Transfer</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="withdrawMethod"
                    value="upi"
                    checked={withdrawMethod === "upi"}
                    onChange={() => setWithdrawMethod("upi")}
                    className="mr-2"
                  />
                  <span>UPI</span>
                </label>
              </div>
            </div>
            
            {withdrawMethod === "bank" && (
              <div className="mb-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                  <input
                    type="text"
                    value={accountDetails.accountNumber}
                    onChange={(e) => setAccountDetails({...accountDetails, accountNumber: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                  <input
                    type="text"
                    value={accountDetails.ifscCode}
                    onChange={(e) => setAccountDetails({...accountDetails, ifscCode: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
                  <input
                    type="text"
                    value={accountDetails.accountName}
                    onChange={(e) => setAccountDetails({...accountDetails, accountName: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
            )}
            
            {withdrawMethod === "upi" && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                <input
                  type="text"
                  placeholder="example@upi"
                  value={accountDetails.upiId}
                  onChange={(e) => setAccountDetails({...accountDetails, upiId: e.target.value})}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
            )}
            
            {withdrawMessage && (
              <div className={`p-4 mb-6 rounded-md ${withdrawMessage.includes("successfully") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                {withdrawMessage}
              </div>
            )}
            
            <div className="flex justify-end">
              <button
                onClick={handleWithdraw}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > earnings.pendingEarnings}
              >
                Withdraw Funds
              </button>
            </div>
            
            <div className="mt-6 border-t pt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Important Notes:</h3>
              <ul className="text-sm text-gray-500 list-disc pl-5 space-y-1">
                <li>Withdrawals are processed within 1-2 business days.</li>
                <li>Minimum withdrawal amount is ₹500.</li>
                <li>Bank account details must match your registered name.</li>
                <li>A transaction fee of ₹25 may apply for bank transfers less than ₹10,000.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Earnings;