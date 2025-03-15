// src/App.jsx - Wrap App with AuthProvider
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import Booking from './pages/Booking';
import VehicleList from './pages/VehicleList';
import Profile from './pages/Profile';
import Wallet from './pages/Wallet';

import Login from './pages/Login';
import Signup from './pages/Signup';
import MyVehicles from './pages/MyVehicles';
import Earnings from './pages/Earnings';
import VehicleOwnerBookings from './pages/VehicleOwnerBookings';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={isAuthenticated ? <Home /> : <LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/booking"
            element={<ProtectedRoute element={<Booking />} />}
          />
          <Route
            path="/vehicles"
            element={<ProtectedRoute element={<VehicleList />} />}
          />
          <Route
            path="/profile"
            element={<ProtectedRoute element={<Profile />} />}
          />
          <Route
            path="/my-vehicles"
            element={<ProtectedRoute element={<MyVehicles />} />}
          />
          <Route
            path="/earnings"
            element={<ProtectedRoute element={<Earnings />} />}
          />
          <Route
            path="/wallet"
            element={<ProtectedRoute element={<Wallet />} />}
          />
          <Route
            path="/owner-bookings"
            element={<ProtectedRoute element={<VehicleOwnerBookings />} />}
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;