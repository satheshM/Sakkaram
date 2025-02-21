
// src/App.jsx (Updated)
import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import VehicleList from "./pages/VehicleList";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyVehicles from "./pages/MyVehicles";
import Earnings from "./pages/Earnings";
import OwnerBookings from "./pages/AllBookings";
import ProtectedRoute from "./routes/ProtectedRoute"
import AllBookings from "./pages/AllBookings";


const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsAuthenticated(!!user);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <div className="flex-grow">
       
        <Routes>
          <Route path="/" element={isAuthenticated ? <Home /> : <LandingPage />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/signup" element={<Signup setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/vehicles" element={<VehicleList />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/my-vehicles" element={<MyVehicles />} />
        <Route path="/earnings" element={<Earnings />} />
        <Route path="/owner-bookings" element={<AllBookings />} />

     
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;