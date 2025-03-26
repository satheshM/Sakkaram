import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../api/auth';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setEmailError(false);
    setPasswordError(false);

    if (!email.trim()) {
      setEmailError(true);
    }
    if (!password.trim()) {
      setPasswordError(true);
    }
    
    if (!email.trim() || !password.trim()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await loginUser(email.trim(), password.trim());

      if (!response) {
        throw new Error("No response from server. Please check your connection.");
      }

      const responseData = await response.json();
      const userData =responseData.user

      if (response.ok) {
        login(userData);
        navigate('/', { replace: true });
      } else {
        switch (response.status) {
          case 404:
            setError('User not found. Please check your credentials.');
            break;
          case 403:
            setError('Wrong Password! Please try again.');
            break;
          default:
            setError(userData?.message || 'Server error! Please try again later.');
        }
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl mb-4">Login to Sakkaram</h2>

        {/* Email Input */}
        <div className="mb-3 relative">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full p-2 border rounded ${emailError ? 'border-red-500' : 'border-gray-300'}`}
            required
          />
          {emailError && (
            <p className="text-red-500 text-sm flex items-center mt-1">
              ⚠️ Please enter your email
            </p>
          )}
        </div>

        {/* Password Input */}
        <div className="mb-3 relative">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full p-2 border rounded ${passwordError ? 'border-red-500' : 'border-gray-300'}`}
            required
          />
          {passwordError && (
            <p className="text-red-500 text-sm flex items-center mt-1">
              ⚠️ Please enter your password
            </p>
          )}
        </div>

        {/* Global Error Message */}
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-green-500 text-white w-full p-2 rounded"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
