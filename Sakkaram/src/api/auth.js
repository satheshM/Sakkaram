// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL ||
//   'https://vitejsviteekarxa6n-cewr--5000--31ca1d38.local-credentialless.webcontainer.io/api'; // ✅ Use environment variables

// export const request = async (endpoint, method, body) => {
//   try {
//     console.log('API Base URL:', API_BASE_URL);

//     const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//       method,
//       credentials: 'include',
//       headers: { 'Content-Type': 'application/json' },
//       body: body ? JSON.stringify(body) : null,
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP Error: ${response.status}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error(`API Request Failed [${method} ${endpoint}]:`, error);
//     return null;
//   }
// };

// const refreshToken = async () => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
//       method: 'POST',
//       credentials: 'include',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ refreshToken: localStorage.getItem('refreshToken') }),
//     });

//     if (!response.ok) {
//       throw new Error(`Refresh Token Failed: ${response.status}`);
//     }

//     const data = await response.json();
//     localStorage.setItem('accessToken', data.accessToken);
//     return data.accessToken;
//   } catch (error) {
//     console.error('Error refreshing token:', error);
//     return null;
//   }
// };

// export const loginUser = (email, password) =>
//   request('/login', 'POST', { email, password });

// export const registerUser = (email, password, role) =>
//   request('/signup', 'POST', { email, password, role });

// export const logoutUser = async () => request('/logout', 'POST');
// export const getProfile = async () => request('/get_profile', 'GET');

// export const PostProfile = (userData) =>
//   request('/post_profile', 'POST', userData);

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://stackblitzsakkaram-akhj--5000--495c5120.local-credentialless.webcontainer.io/api';

const refreshToken = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/refresh-token`, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });

    // if (!response.ok) {
    //   throw new Error(`Refresh Token Failed: ${response.status}`);
    // }

    // const data = await response;
    // localStorage.setItem('accessToken', data.accessToken);
    // return data.accessToken;
    return response;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
};

export const request = async (endpoint, method, body, retry = true) => {
  try {
    console.log('API Base URL:', API_BASE_URL);

    //const accessToken = localStorage.getItem('accessToken');

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        // Authorization: accessToken ? `Bearer ${accessToken}` : '',
      },
      body: body ? JSON.stringify(body) : null,
    });

    // Handle Unauthorized (401) and try refreshing the token
    if (response.status === 401 && retry) {
      console.warn(`Access token expired, refreshing...`);
      const newAccessToken = await refreshToken();

      if (!newAccessToken.ok) {
        console.log(`Refresh Token Failed: ${newAccessToken.status}`);
      }

      if (newAccessToken.status === 200) {
        console.log('calling again');
        return request(endpoint, method, body, false); // Retry request with new token
      } else {
        console.error('Refresh token failed, logging out user.');
        logoutUser(); // Logout if refresh token fails
      }
    }

    // if (!response.ok) {
    //   throw new Error(`HTTP Error: ${response.status}`);
    // }

    // return await response.json();
    return await response;
  } catch (error) {
    console.error(`API Request Failed [${method} ${endpoint}]:`, error);
    return null;
  }
};

export const loginUser = async (email, password) => {
  const userData = await request('/login', 'POST', { email, password });

  return userData;
};

export const registerUser = async (email, password, role) => {
  const userData = await request('/signup', 'POST', { email, password, role });
  if (userData) {
    localStorage.setItem('accessToken', userData.accessToken);
    localStorage.setItem('refreshToken', userData.refreshToken);
  }
  return userData;
};

export const logoutUser = async () => {
  await request('/logout', 'POST');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const getProfile = async () => request('/get_profile', 'GET');
export const PostProfile = async (userData) =>
  request('/post_profile', 'POST', userData);
