// AuthContext.jsx - Handles authentication globally
import React, { createContext, useContext, useState, useEffect } from "react";
import { logoutUser,verifyToken } from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
 // const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = async () => {
    try {
      console.log("inside auth verify")
      const res = await verifyToken();

      if (res.ok) {
        const data = await res.json();
        console.log("Verify Token :"+JSON.stringify(data))
        setUser(data.user); // Update user state
        setIsAuthenticated(true)
        console.log("Auth Context:veriftToken Done")
      } else {
        setUser(null);
        console.log("viryfi failed in authcontent ")
        logoutUser(setIsAuthenticated);
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error("Auth check failed", error);
      setUser(null);
      setIsAuthenticated(false)
      logoutUser(setIsAuthenticated);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // Check for stored user data on initial load

 
    // const storedUser = localStorage.getItem("user");
    // if (storedUser) {
    //   try {
    //     const userData = JSON.parse(storedUser);
    //     setUser(userData);
    //     setRole(userData.role);
    //   } catch (error) {
    //     console.error("Error parsing stored user data:", error);
    //     localStorage.removeItem("user");
    //   }
    // }
    checkAuth();

    // setIsLoading(false);
  }, []);

  // Updated login function to accept user data directly
  const login = (userData) => {
    if (userData) {
      
      setUser(userData);
      // setRole(userData.role);
      setIsAuthenticated(true)
    }
  };

  const logout = async () => {
    await logoutUser(setIsAuthenticated);
    
    
    
    setUser(null);
 
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
     
      isLoading, 
      login, 
      logout,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);