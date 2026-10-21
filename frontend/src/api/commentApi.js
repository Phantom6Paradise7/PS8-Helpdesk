const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_URL = rawUrl.replace(/\/+$/, '');

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const getComments = async (ticketId) => {
  let response = await fetch(`${API_URL}/tickets/${ticketId}/comments`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    response = await fetch(`${API_URL}/comments/${ticketId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch comments');
  }
  return response.json();
};

export const addComment = async (ticketId, commentData) => {
  let response = await fetch(`${API_URL}/tickets/${ticketId}/comments`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(commentData),
  });
  
  if (!response.ok) {
    response = await fetch(`${API_URL}/comments/${ticketId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(commentData),
    });
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to post reply');
  }
  
  return response.json();
};