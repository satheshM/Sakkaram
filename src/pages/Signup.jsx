// src/pages/Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("farmer"); // Default role: Farmer
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();

    const userData = { email, role };
    login(userData);
    navigate("/");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSignup} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl mb-4">Sign Up</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
          required
        />

        {/* Role Selection */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Select Role:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="farmer">Farmer</option>
            <option value="vehicle_owner">Vehicle Owner</option>
          </select>
        </div>

        <button type="submit" className="bg-green-500 text-white w-full p-2 rounded">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
