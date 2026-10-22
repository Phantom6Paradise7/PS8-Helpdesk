const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_URL = rawUrl.replace(/\/+$/, '');

const fetchWithTimeout = async (url, options = {}, timeoutMs = 15000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    if (err.name === 'AbortError') {
      throw new Error('Server request timed out after 15 seconds. Backend may be waking up on Render, please retry.');
    }
    throw err;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await fetchWithTimeout(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      if (response.status === 502 || response.status === 503) {
        throw new Error('Backend server is waking up on Render. Please wait 15 seconds and try again.');
      }
      throw new Error(`Server returned error status ${response.status}`);
    }

    if (!response.ok) {
      throw new Error(data.message || 'Failed to register');
    }
    
    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
      throw new Error('Unable to connect to backend server. Please verify Render backend is active and MongoDB Atlas IP is whitelisted (0.0.0.0/0).');
    }
    throw err;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await fetchWithTimeout(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      if (response.status === 502 || response.status === 503) {
        throw new Error('Backend server is waking up on Render. Please wait 15 seconds and try again.');
      }
      throw new Error(`Server returned error status ${response.status}`);
    }

    if (!response.ok) {
      throw new Error(data.message || 'Invalid email or password');
    }
    
    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
      throw new Error('Unable to connect to backend server. Please verify Render backend is active and MongoDB Atlas IP is whitelisted (0.0.0.0/0).');
    }
    throw err;
  }
};