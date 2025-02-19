import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import VehicleList from "./pages/VehicleList";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate checking user authentication (replace with real auth logic)
    const user = localStorage.getItem("user");
    if (user) {
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {isAuthenticated }
      <Navbar />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={isAuthenticated ? <Home /> : <LandingPage />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/vehicles" element={<VehicleList />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
