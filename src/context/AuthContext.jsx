import { createContext, useContext, useState, useEffect } from "react";

// Create AuthContext
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores user info
  const [role, setRole] = useState(null); // "farmer" or "owner"

  // Simulate fetching user data (replace with real API call)
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user")); // Fetch user from storage
    if (loggedInUser) {
      setUser(loggedInUser);
      setRole(loggedInUser.role); // Set role dynamically
    }
  }, []);

  // Function to log in a user
  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setRole(userData.role);
  };

  // Function to log out user
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
