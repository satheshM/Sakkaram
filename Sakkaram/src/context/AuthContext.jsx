// // AuthContext.jsx - Handles authentication globally
// import React, { createContext, useContext, useState, useEffect } from "react";
// import { logoutUser,verifyToken } from "../api/auth";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {

//   const [user, setUser] = useState(null);
//  // const [role, setRole] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   const checkAuth = async () => {
//     try {
//       console.log("inside auth verify")
//       const res = await verifyToken();
//       console.log("after verify"+JSON.stringify(res));

//       if (res.ok) {
//         const data = await res.json();
//         console.log("Verify Token :"+JSON.stringify(data))
//         setUser(data.user); // Update user state
//         setIsAuthenticated(true)
//         console.log("Auth Context:veriftToken Done")
//       } else {
//         setUser(null);
//         console.log("viryfi failed in authcontent ")
//         logoutUser();
//         setIsAuthenticated(false)
//         setUser(null);
//       }
//     } catch (error) {
//       console.error("Auth check failed", error);
//       setUser(null);
//       setIsAuthenticated(false)
//       setUser(null);
//       logoutUser();
//     }
//     setIsLoading(false);
//   };


//   useEffect(() => {
//     (async () => {
//       await checkAuth();
//     })();
//   }, []);
  

//   // Updated login function to accept user data directly
//   const login = (userData) => {
//     if (userData) {
      
//       setUser(userData);
//       // setRole(userData.role);
//       setIsAuthenticated(true)
//     }
//   };

//   const logout = async () => {
//     await logoutUser();
    
    
    
//     setUser(null);
 
//   };

//   return (
//     <AuthContext.Provider value={{ 
//       user, 
     
//       isLoading, 
//       login, 
//       logout,
//       isAuthenticated
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


// AuthContext.jsx - Manages authentication state globally
import React, { createContext, useContext, useState, useEffect } from "react";
import { logoutUser, verifyToken } from "../api/auth";

const AuthContext = createContext();
let globalUpdateAuthStatus = () => {}; // 🔥 Global function to update authentication status

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 🔥 Function to update authentication state globally
  const updateAuthStatus = (status) => {
    setIsAuthenticated(status);
    if (!status) {
      setUser(null);
      logoutUser(); // Logout the user when authentication fails
    }
  };

  globalUpdateAuthStatus = updateAuthStatus; // Assign global updater function

  // 🔄 Verify authentication status
  const checkAuth = async () => {
    try {
      console.log("🔄 Checking authentication...");
      const res = await verifyToken();

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setIsAuthenticated(true);
        console.log("✅ Authentication verified.");
      } else {
        console.log("❌ Token verification failed.");
        updateAuthStatus(false);
      }
    } catch (error) {
      console.error("⚠️ Auth check failed:", error);
      updateAuthStatus(false);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuth(); // Check authentication when component mounts
  }, []);


  const login = (userData) => {
        if (userData) {
          
          setUser(userData);
          console.log("after login"+JSON.stringify(userData))
          setIsAuthenticated(true)
        }
      };
    
      const logout = async () => {
        await logoutUser();
        setIsAuthenticated(false)
        
        
        
        setUser(null);
     
      };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated,login,logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );

};

// Hook to use authentication context
export const useAuth = () => useContext(AuthContext);
export const getAuthUpdater = () => globalUpdateAuthStatus; // 🔥 Export global updater function
