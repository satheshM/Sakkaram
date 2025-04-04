// const supabase = require('../config/db');

// const findOwnerTransactions = async (user_id) => {
//   try {
//     // 🟢 1. Fetch Withdrawals from Transactions Table
//     const { data: withdrawals, error: error1 } = await supabase
//       .from('transactions')
//       .select('id, created_at, amount, status, reference_id')
//       .eq('type', 'deposit')
//       .eq('status', 'Success')
//       .eq('wallet_id', user_id);

//     if (error1) throw new Error(error1.message);

//     // Format Withdrawals
//     const formattedWithdrawals = withdrawals.map(t => ({
//       id: t.id,
//       date: t.created_at,
//       amount: t.amount,
//       status: t.status,
//       type: 'deposit',
//       method: null,
//       reference: t.reference_id
//     }));

//     // 🟢 2. Fetch Earnings from Payments Table with Correct Embedding
//     const { data: earningsFromPayments, error: error2 } = await supabase
//       .from('payments')
//       .select(`
//         id,
//         created_at,
//         amount,
//         status,
//         bookings (
//           vehicles (
//             model
//           ),
//           farmer:farmer_id (
//             name
//           )
//         )
//       `)
//       .eq('status', 'Success');

//     if (error2) throw new Error(error2.message);

//     // Format Earnings from Payments
//     const formattedEarningsFromPayments = earningsFromPayments.map(p => ({
//       id: p.id,
//       date: p.created_at,
//       amount: p.amount,
//       status: p.status,
//       type: 'Earning',
//       method: null,
//       reference: null,
//       vehicle: p.bookings?.vehicles?.model,
//       farmer: p.bookings?.farmer?.name
//     }));

//     // 🟢 3. Fetch Earnings from Transactions Table
//     const { data: earningsFromTransactions, error: error3 } = await supabase
//       .from('transactions')
//       .select('id, created_at, amount, status')
//       .eq('type', 'Deposit')
//       .eq('status', 'Success')
//       .eq('wallet_id', user_id);

//     if (error3) throw new Error(error3.message);

//     // Format Earnings from Transactions
//     const formattedEarningsFromTransactions = earningsFromTransactions.map(t => ({
//       id: t.id,
//       date: t.created_at,
//       amount: t.amount,
//       status: t.status,
//       type: 'Earning',
//       method: null,
//       reference: null
//     }));

//     // 🟢 4. Combine Results and Sort by Date Descending
//     const allTransactions = [
//       ...formattedWithdrawals,
//       ...formattedEarningsFromPayments,
//       ...formattedEarningsFromTransactions,
//     ].sort((a, b) => new Date(b.date) - new Date(a.date));

//     return {  allTransactions };
//   } catch (error) {
//     console.error("Error fetching transactions:", error);
//     return { error: error.message };
//   }
// };

// module.exports = { findOwnerTransactions };


// File: services/transactions.js



// services/transactions.js


















// const supabase = require('../config/db');

// const findOwnerTransactions = async (userId) => {
//     try {
//         // 🟢 Step 1: Get Wallet ID for the User
//         const { data: walletData, error: walletError } = await supabase
//             .from('wallets')
//             .select('id')
//             .eq('user_id', userId)
//             .single();

//         if (walletError || !walletData) {
//             throw new Error("Wallet not found for the user");
//         }
        

//         const walletId = walletData.id;

//         // 🟢 Step 2: Fetch Transactions with Relationships
//         const { data: transactionsData, error: transactionsError } = await supabase
//             .from('transactions')
//             .select(`
//                 id,
//                 created_at,
//                 amount,
//                 status,
//                 type,
//                 reference_id,
//                 bookings (
//                     id,
//                     vehicle:vehicleId (
//                         model
//                     ),
//                     farmer:farmer_id (
//                         name
//                     )
//                 )
//             `)
//             .eq('wallet_id', walletId)
//             .eq('status', 'Success');

//         if (transactionsError) {
//             throw new Error(transactionsError.message);
//         }
       

//         // 🟢 Step 3: Transform Data to Expected Format
//         const formattedTransactions = transactionsData.map(txn => ({
//             id: txn.id,
//             date: txn.created_at,
//             amount: txn.amount,
//             status: txn.status,
//             type: txn.type === 'deposit' ? 'Earning' : 'Withdrawal',
//             method: null,
//             reference: txn.reference_id,
//             vehicle: txn.bookings?.vehicle?.model || null,
//             farmer: txn.bookings?.farmer?.name || null
//         }));

//         // 🟢 Step 4: Return Sorted Data (Descending by Date)
//         formattedTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

//         return { success: true, data: formattedTransactions };

//     } catch (err) {
//         console.error("Error fetching transactions:", err);
//         return { success: false, error: err.message };
//     }
// };

// module.exports = { findOwnerTransactions };









const supabase = require('../config/db');

// const findOwnerTransactions = async (userId) => {
//     try {
//         // 🟢 Step 1: Get Wallet ID for the User
//         const { data: walletData, error: walletError } = await supabase
//             .from('wallets')
//             .select('id')
//             .eq('user_id', userId)
//             .single();

//         if (walletError || !walletData) {
//             throw new Error("Wallet not found for the user");
//         }

//         const walletId = walletData.id;

//         // 🟢 Step 2: Fetch Transactions with Manual Joins
//         // Fetch bookings, vehicles, and users separately and combine
//         const { data: transactions, error: transactionsError } = await supabase
//             .from('transactions')
//             .select(`
//                 id,
//                 created_at,
//                 amount,
//                 status,
//                 type,
//                 reference_id,
//                 wallet_id,
//                 booking_id
//             `)
//             .eq('wallet_id', walletId)
//             .eq('status', 'Success');

//         if (transactionsError) throw new Error(transactionsError.message);

//         // 🟢 Step 3: Fetch Related Data
//         // Fetch all necessary data at once
//         const bookingIds = transactions.map(txn => txn.booking_id).filter(Boolean);

//         // Fetch bookings
//         const { data: bookings, error: bookingsError } = await supabase
//             .from('bookings')
//             .select(`
//                 id,
//                 vehicleId,
//                 farmer_id
//             `)
//             .in('id', bookingIds);

//         if (bookingsError) throw new Error(bookingsError.message);

//         // Extract Vehicle and Farmer IDs
//         const vehicleIds = bookings.map(b => b.vehicleId);
//         const farmerIds = bookings.map(b => b.farmer_id);

//         // Fetch vehicles
//         const { data: vehicles, error: vehiclesError } = await supabase
//             .from('vehicles')
//             .select('id, model')
//             .in('id', vehicleIds);

//         if (vehiclesError) throw new Error(vehiclesError.message);

//         // Fetch farmers
//         const { data: farmers, error: farmersError } = await supabase
//             .from('users')
//             .select('id, name')
//             .in('id', farmerIds);

//         if (farmersError) throw new Error(farmersError.message);

//         // 🟢 Step 4: Build Relationships
//         // Convert data to easy lookup objects
//         const vehicleMap = Object.fromEntries(vehicles.map(v => [v.id, v.model]));
//         const farmerMap = Object.fromEntries(farmers.map(f => [f.id, f.name]));
//         const bookingMap = Object.fromEntries(bookings.map(b => [b.id, b]));

//         // 🟢 Step 5: Format Transactions
//         const formattedTransactions = transactions.map(txn => {
//             const booking = bookingMap[txn.booking_id] || {};
//             const vehicleModel = vehicleMap[booking.vehicleId] || null;
//             const farmerName = farmerMap[booking.farmer_id] || null;

//             return {
//                 id: txn.id,
//                 date: txn.created_at,
//                 amount: txn.amount,
//                 status: txn.status,
//                 type: txn.type === 'deposit' ? 'Earning' : 'Withdrawal',
//                 method: null,
//                 reference: txn.reference_id,
//                 vehicle: vehicleModel,
//                 farmer: farmerName
//             };
//         });

//         // 🟢 Step 6: Return Sorted Data
//         formattedTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

//         return { success: true, data: formattedTransactions };

//     } catch (err) {
//         console.error("Error fetching transactions:", err);
//         return { success: false, error: err.message };
//     }
// };


const findOwnerTransactions = async (userId) => {
  try {
      // 🟢 Step 1: Get Wallet ID
      const { data: walletData, error: walletError } = await supabase
          .from('wallets')
          .select('id')
          .eq('user_id', userId)
          .single();

      if (walletError || !walletData) {
          throw new Error("Wallet not found for the user");
      }

      const walletId = walletData.id;

      // 🟢 Step 2: Fetch Transactions with Relationships
      const { data: transactionsData, error: transactionsError } = await supabase
          .from('transactions')
          .select(`
              id,
              created_at,
              amount,
              status,
              type,
              reference_id,
              bookings:booking_id (
                  id,
                  vehicle:vehicleId (
                      model
                  ),
                  farmer:farmer_id (
                      name
                  )
              )
          `)
          .eq('wallet_id', walletId)
          .eq('status', 'Success');

      if (transactionsError) throw new Error(transactionsError.message);

     

      // 🟢 Step 3: Transform Data to Expected Format
      const transactions = transactionsData.map(txn => ({
          id: txn.id,
          date: txn.created_at,
          amount: txn.amount,
          status: txn.status,
          type: txn.type === 'deposit' ? 'Earning' : 'Withdrawal',
          method: null, // method is not present in the schema
          reference: txn.reference_id,
          vehicle: txn.bookings?.vehicle?.model || null,
          farmer: txn.bookings?.farmer?.name || null
      }));

      
      // 🟢 Step 4: Return Final Response
      return { data: transactions };
  } catch (err) {
      console.error("Error fetching transactions:", err);
      return { success: false, error: err.message };
  }
};


// const fetchOwnerEarnings = async (userId) => {
//   try {
//       // 🟢 Step 1: Fetch Earnings Data
//       const { data: earningsData, error: earningsError } = await supabase
//           .from('payments')
//           .select(`
//               amount,
//               status,
//               created_at,
//               bookings (
//                   vehicleId,
//                   vehicles:vehicleId (
//                       model
//                   )
//               )
//           `)
//           .eq('bookings.owner_id', userId);

//       if (earningsError) throw new Error(earningsError.message);

//       // 🟢 Step 2: Fetch Withdrawn Amount
//       const { data: withdrawnData, error: withdrawnError } = await supabase
//           .from('transactions')
//           .select('amount')
//           .eq('wallet_id', userId)
//           .eq('type', 'Withdraw')
//           .eq('status', 'Success');

//       if (withdrawnError) throw new Error(withdrawnError.message);

//       // 🟢 Step 3: Calculate Totals
//       let totalEarnings = 0;
//       let pendingEarnings = 0;
//       let withdrawnAmount = 0;
//       const monthlyEarnings = {};
//       const vehiclePerformance = {};

//       // Calculate Withdrawn Amount
//       withdrawnData.forEach((t) => {
//           withdrawnAmount += t.amount;
//       });

//       // Calculate Earnings
//       earningsData.forEach((payment) => {
//           const { amount, status, created_at, bookings } = payment;

//           // Earnings calculations
//           if (status === 'Success') {
//               totalEarnings += amount;
              
//               // Highest Earning Month
//               const month = new Date(created_at).toLocaleString('default', { month: 'long' });
//               monthlyEarnings[month] = (monthlyEarnings[month] || 0) + amount;

//               // Vehicle Performance
//               const vehicleName = bookings?.vehicles?.model;
//               if (vehicleName) {
//                   if (!vehiclePerformance[vehicleName]) {
//                       vehiclePerformance[vehicleName] = { earnings: 0, bookings: 0 };
//                   }
//                   vehiclePerformance[vehicleName].earnings += amount;
//                   vehiclePerformance[vehicleName].bookings += 1;
//               }
//           }

//           // Pending Earnings
//           if (status === 'Pending') {
//               pendingEarnings += amount;
//           }
//       });

//       // 🟢 Step 4: Find Highest Earning Month & Vehicle
//       const highestEarningMonth = Object.entries(monthlyEarnings)
//           .reduce((acc, [month, earnings]) => {
//               return earnings > acc.amount ? { month, amount: earnings } : acc;
//           }, { month: null, amount: 0 });

//       const highestEarningVehicle = Object.entries(vehiclePerformance)
//           .reduce((acc, [name, { earnings }]) => {
//               return earnings > acc.earnings ? { name, earnings } : acc;
//           }, { name: null, earnings: 0 });

//       // 🟢 Step 5: Format Vehicle Performance Data
//       const formattedVehiclePerformance = Object.entries(vehiclePerformance).map(([name, { earnings, bookings }]) => ({
//           name,
//           earnings,
//           bookings
//       }));

//       // 🟢 Step 6: Return Final Response
//       return {
//           success: true,
//           data: {
//               totalEarnings,
//               pendingEarnings,
//               withdrawnAmount,
//               highestEarningMonth,
//               highestEarningVehicle,
//               vehiclePerformance: formattedVehiclePerformance
//           }
//       };
//   } catch (err) {
//       console.error("Error fetching earnings:", err);
//       return { success: false, error: err.message };
//   }
// };

const fetchOwnerEarnings = async (userId) => {
    try {
        // 🟢 Step 1: Fetch Earnings Data using modified query logic
        const { data: earningsData, error: earningsError } = await supabase
            .from('transactions') 
            .select(`
                amount,
                status,
                created_at,
                bookings!inner (
                    vehicleId,
                    vehicleModel
                ),
                wallets!inner (user_id)
            `)
            .eq('wallets.user_id', userId)
            .eq('status', 'Success');

        if (earningsError) throw new Error(earningsError.message);

        // 🟢 Step 2: Fetch Withdrawn Amount
        const { data: withdrawnData, error: withdrawnError } = await supabase
            .from('transactions')
            .select('amount')
            .eq('wallet_id', userId)
            .eq('type', 'Withdraw')
            .eq('status', 'Success');

        if (withdrawnError) throw new Error(withdrawnError.message);

        // 🟢 Step 3: Fetch Pending Balance from Wallets Table
        const { data: walletData, error: walletError } = await supabase
            .from('wallets')
            .select('balance')
            .eq('user_id', userId)
            .single();

        if (walletError) throw new Error(walletError.message);

        // 🟢 Step 4: Calculate Totals
        let totalEarnings = 0;
        let pendingEarnings = walletData?.balance || 0;
        let withdrawnAmount = 0;
        const monthlyEarningsMap = {};
        const vehiclePerformanceMap = {};

        // Calculate Withdrawn Amount
        withdrawnData.forEach((t) => {
            withdrawnAmount += t.amount;
        });

        // Calculate Monthly Earnings & Vehicle Performance
        earningsData.forEach((payment) => {
            const { amount, created_at, bookings } = payment;

            totalEarnings += amount;

            // Monthly Earnings Calculation
            const monthNumber = new Date(created_at).getMonth() + 1; // Get month (1-12)
            const monthName = new Date(created_at).toLocaleString('default', { month: 'short' }); // Get short month name (Jan, Feb, etc.)
            monthlyEarningsMap[monthNumber] = {
                month: monthName,
                amount: (monthlyEarningsMap[monthNumber]?.amount || 0) + amount,
            };

            // Vehicle Performance Calculation
            const vehicleId = bookings?.vehicleId;
            const vehicleName = bookings?.vehicleModel;
            if (vehicleId && vehicleName) {
                if (!vehiclePerformanceMap[vehicleId]) {
                    vehiclePerformanceMap[vehicleId] = { id: vehicleId, name: vehicleName, earnings: 0, bookings: 0 };
                }
                vehiclePerformanceMap[vehicleId].earnings += amount;
                vehiclePerformanceMap[vehicleId].bookings += 1;
            }
        });

        // 🟢 Step 5: Convert Monthly Earnings Object to Sorted Array
        const monthlyEarnings = Object.values(monthlyEarningsMap).sort((a, b) => {
            return new Date(`01-${a.month}-2000`) - new Date(`01-${b.month}-2000`);
        });

        // 🟢 Step 6: Convert Vehicle Performance Object to Array
        const vehiclePerformance = Object.values(vehiclePerformanceMap);

        // 🟢 Step 7: Return Final Response
        return {
         
                totalEarnings,
                pendingEarnings,
                withdrawnAmount,
                monthlyEarnings,
                vehiclePerformance,
            
        };
    } catch (err) {
        console.error("Error fetching earnings:", err);
        return { success: false, error: err.message };
    }
};




module.exports = { findOwnerTransactions,fetchOwnerEarnings };
