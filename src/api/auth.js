

// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL ||
//   'http://localhost:5000/api';

//   const refreshToken = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/refresh-token`, {
//         method: 'GET',
//         credentials: 'include',
//         headers: { 'Content-Type': 'application/json' },
//       });
  
//       if (!response.ok) {
//         console.error(`Refresh Token Failed: ${response.status}`);
//       // Ensure state is updated before returning
//         return response; // Return response so the caller can handle it
//       }
  
//       return response;
//     } catch (error) {
//       console.error('Error refreshing token:', error);
//       return null;
//     }
//   };
  

// export const request = async (endpoint, method, body, retry = true) => {
//   try {
//     console.log('API Call:', API_BASE_URL+endpoint);

//     //const accessToken = localStorage.getItem('accessToken');

//     const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//       method,
//       credentials: 'include',
//       headers: {
//         'Content-Type': 'application/json',
//         // Authorization: accessToken ? `Bearer ${accessToken}` : '',
//       },
//       body: body ? JSON.stringify(body) : null,
//     });

//     // Handle Unauthorized (401) and try refreshing the token
//     if ((response.status === 401 ||response.status === 403) &&( retry)) {
//       console.warn(`Access token expired, refreshing...`);
//       const newAccessToken = await refreshToken();

//       if (!newAccessToken.ok) {
//         console.log(`Refresh Token Failed: ${newAccessToken ? newAccessToken.status : "Unknown"}`);
//         await logoutUser();
//          // ✅ Ensure isAuthenticated is set to false
//         return newAccessToken;
//       }

//       if (newAccessToken.status === 200) {
//         console.log('calling again');
//         return request(endpoint, method, body, false); // Retry request with new token
//       } else {
//         console.error('Refresh token failed, logging out user.');
//         return  newAccessToken;
//          // Logout if refresh token fails
       
//       }
//     }

//     if (!response.ok) {
//       console.log(`HTTP Error: ${response.status}`);
//       return await response;
//     }

//     // return await response.json();
//     return await response;
//   } catch (error) {
//     console.error(`API Request Failed [${method} ${endpoint}]:`, error);
    
//     return null;
//   }
// };

// export const loginUser = async (email, password) => {
//   const userData = await request('/login', 'POST', { email, password });

//   return userData;
// };

// export const registerUser = async (email, password, role) => {
//   const userData = await request('/signup', 'POST', { email, password, role });
  
//   return userData;
// };

// // export const logoutUser = async (setAuthStatus) => {
// //   await request('/logout', 'POST');
// //   if (setAuthStatus) {
// //     setAuthStatus(false); // Update authentication state in React
// //   }
  


 
// // };
// export const logoutUser = async () => {
//   try {
//     const response = await request('/logout', 'POST');

//     if (response && response.ok) {
//       console.log("Logout successful ");
     
      
//       // Update authentication state in React
      
//     } else {
//       console.error("Logout failed:", response.status);
//     }
//   } catch (error) {
//     console.error("Logout error:", error);
//   }
// };


// export const getProfile = async () => request('/get_profile', 'GET');
// export const PostProfile = async (userData) =>
//   request('/post_profile', 'POST', userData);


//   export const verifyToken = async () => request('/verify-token', 'GET');


import { getAuthUpdater } from "../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// 🔄 Refresh Access Token
const refreshToken = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/refresh-token`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      console.error(`❌ Refresh Token Failed: ${response.status}`);
      return null;
    }

    return response;
  } catch (error) {
    console.error("⚠️ Error refreshing token:", error);
    return null;
  }
};

// 🔄 API Request Wrapper with Auto Refresh
export const request = async (endpoint, method, body, retry = true) => {
  try {
    console.log(`🔄 API Call: ${API_BASE_URL}${endpoint}`);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : null,
    });

    // 🔥 Handle Unauthorized (401/403) → Try Refresh Token
    if ((response.status === 401 || response.status === 403) && retry) {
      console.warn("⚠️ Access token expired, attempting refresh...");
      const newAccessToken = await refreshToken();

      if (!newAccessToken) {
        console.log("❌ Refresh token expired. Logging out...");
        getAuthUpdater()(false); // 🔥 Update authentication state in context
        return null;
      }

      if (newAccessToken.ok) {
        console.log("🔄 Retrying request with new token...");
        return request(endpoint, method, body, false); // Retry once
      }
    }

    if (!response.ok) {
      console.log(`❌ API Error: ${response.status}`);
      return response;
    }
    
    return await response;
  } catch (error) {
    console.error(`⚠️ API Request Failed [${method} ${endpoint}]:`, error);
    return null;
  }
};

// 🔹 Authentication Functions
export const loginUser = async (email, password) => request('/login', 'POST', { email, password });
export const registerUser = async (email, password, role) => request('/signup', 'POST', { email, password, role });

// 🔹 Logout User
export const logoutUser = async () => {
  try {
    const response = await request('/logout', 'POST');

    if (response && response.ok) {
      console.log("✅ Logout successful.");
    } else {
      console.error("❌ Logout failed:", response.status);
    }
  } catch (error) {
    console.error("⚠️ Logout error:", error);
  }
};

// 🔹 Fetch User Profile
export const getProfile = async () => request('/get_profile', 'GET');
export const PostProfile = async (userData) => request('/post_profile', 'POST', userData);
export const verifyToken = async () => request('/verify-token', 'GET');
