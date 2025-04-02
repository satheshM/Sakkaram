import React, { useState, useEffect } from "react";
import { Wallet as WalletIcon, PlusCircle, BanknoteIcon, History } from "lucide-react";
import { Toaster, toast } from 'react-hot-toast';
import { api } from '../api/wallet'

const getTransactionColor = (type) => {
  return type === "deposit" 
    ? "bg-green-100 text-green-800" 
    : "bg-red-100 text-red-800";
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};

const Wallet = () => {
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      const [balanceData, transactionsData] = await Promise.all([
        api.getWalletBalance(),
        api.getTransactions()
      ]);
      
      setBalance(balanceData.balance);
      setTransactions(transactionsData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading wallet data:', error);
      toast.error('Failed to load wallet data');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) setAmount(value);
  };

  const closeModal = () => {
    setAmount("");
    setShowAddMoney(false);
    setShowWithdraw(false);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const initializeRazorpayPayment = async () => {
    try {
      const razorpayLoaded = await loadRazorpayScript();
      if (!razorpayLoaded) {
        alert("Razorpay SDK failed to load. Check your internet connection.");
        return;
      }
      const orderResponse = await api.createPayment(parseFloat(amount));

      const orderResponseData = await orderResponse.json();
      
      console.log("payment amount ======"+orderResponseData.amount)
      const options = {
        key: "rzp_test_b1A45GxApr12tC",
        amount: orderResponseData.amount,
        currency: "INR",
        name: "My Wallet",
        description: "Add money to wallet",
        order_id: orderResponseData.orderId,
        // handler: async (response) => {
        //   try {
        //     await api.verifyPayment({
        //       razorpay_payment_id: response.razorpay_payment_id,
        //       razorpay_order_id: response.razorpay_order_id,
        //       razorpay_signature: response.razorpay_signature
        //     });
            
        //     toast.success('Payment successful!');
        //     loadWalletData();
        //     closeModal();
        //   } catch (error) {
        //     console.error('Payment verification failed:', error);
        //     toast.error('Payment verification failed');
        //   }
        // },
        handler: async function (paymentResponse) {
          // Step 3: Verify Payment
        

          try{
            const verifyResponse=  await api.verifyPayment(paymentResponse)
  
         //const verifyData = await verifyResponse.json();

         console.log("respoJ"+JSON.stringify(verifyResponse))

          if (verifyResponse) {
         
            toast.success('Payment successful!');
            loadWalletData();
            closeModal();
           
            
          } else {
            alert("Payment verification failed.");
          }
         
            } catch (error) {
              console.error('Payment verification failed:', error);
              toast.error('Payment verification failed');
            }
        
  
      
        },
        prefill: {
          name: "User Name",
          email: "user@example.com"
        },
        theme: {
          color: "#16a34a"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment initialization failed:', error);
      toast.error('Failed to initialize payment');
    }
  };

  const handleWithdraw = async () => {
    try {
      const withdrawAmount = parseFloat(amount);
      if (withdrawAmount <= 0 || isNaN(withdrawAmount)) {
        toast.error('Please enter a valid amount');
        return;
      }
      if (withdrawAmount > balance) {
        toast.error('Insufficient balance');
        return;
      }

      await api.withdrawMoney(withdrawAmount);
      toast.success('Withdrawal successful!');
      loadWalletData();
      closeModal();
    } catch (error) {
      console.error('Withdrawal failed:', error);
      toast.error('Withdrawal failed');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen pt-20 pb-10">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">My Wallet</h1>

        {/* Wallet Card */}
        <div className="bg-white p-8 rounded-xl text-center shadow-lg">
          <div className="inline-block p-3 bg-green-50 rounded-full mb-4">
            <WalletIcon className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-lg font-semibold text-gray-600">Available Balance</p>
          <p className="text-4xl font-bold text-green-800 mt-2">
            {formatCurrency(balance)}
          </p>

          <div className="flex justify-center mt-6 space-x-4">
            <button
              onClick={() => setShowAddMoney(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center transition-all duration-200 transform hover:scale-105"
            >
              <PlusCircle className="w-5 h-5 mr-2" /> Add Money
            </button>
            <button
              onClick={() => setShowWithdraw(true)}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg flex items-center transition-all duration-200 transform hover:scale-105"
            >
              <BanknoteIcon className="w-5 h-5 mr-2" /> Withdraw
            </button>
          </div>
        </div>

        {/* Transaction History */}
        <div className="mt-8">
          <div className="flex items-center mb-4">
            <History className="w-6 h-6 text-gray-600 mr-2" />
            <h2 className="text-xl font-semibold">Transaction History</h2>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <div key={tx.id} className="flex justify-between items-center border-b border-gray-100 py-4 last:border-0">
                  <div className="flex items-center">
                    <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${getTransactionColor(tx.type)}`}>
                      {/* {tx.type === 'deposit' ? 'Added' : 'Withdrawn'} */}
                      {tx.type}

                    </span>
                    <span className="ml-4 font-medium text-gray-900">
                      {formatCurrency(tx.amount)}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      {new Date(tx.created_at).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="text-xs text-gray-500">
                      {tx.razorpay_payment_id || 'Direct transaction'}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No transactions yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal Component */}
      {(showAddMoney || showWithdraw) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl w-96 max-w-[90%]">
            <h2 className="text-2xl font-semibold mb-6">
              {showAddMoney ? "Add Money to Wallet" : "Withdraw Money"}
            </h2>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Enter Amount (₹)
              </label>
              <input
                type="text"
                value={amount}
                onChange={handleChange}
                className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="0.00"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={closeModal}
                className="px-6 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={showAddMoney ? initializeRazorpayPayment : handleWithdraw}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                {showAddMoney ? "Add Money" : "Withdraw"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Toaster position="top-right" />
    </div>
  );
};

export default Wallet;