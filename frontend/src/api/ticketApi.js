const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const createTicket = async (ticketData) => {
  const response = await fetch(`${API_URL}/tickets`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(ticketData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create ticket');
  }
  return response.json();
};

export const getTicket = async (id) => {
  const response = await fetch(`${API_URL}/tickets/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch ticket');
  }
  return response.json();
};

export const getUserTickets = async () => {
  const response = await fetch(`${API_URL}/tickets/my-tickets`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    const fallbackResponse = await fetch(`${API_URL}/tickets`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!fallbackResponse.ok) {
      const error = await fallbackResponse.json();
      throw new Error(error.message || 'Failed to fetch user tickets');
    }
    return fallbackResponse.json();
  }
  return response.json();
};

export const getAllTickets = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = `${API_URL}/tickets/all${query ? `?${query}` : ''}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    const fallbackUrl = `${API_URL}/tickets${query ? `?${query}` : ''}`;
    const fallbackResponse = await fetch(fallbackUrl, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!fallbackResponse.ok) {
      const error = await fallbackResponse.json();
      throw new Error(error.message || 'Failed to fetch tickets');
    }
    return fallbackResponse.json();
  }
  return response.json();
};

export const updateTicket = async (id, ticketData) => {
  const response = await fetch(`${API_URL}/tickets/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(ticketData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update ticket');
  }
  return response.json();
};

export const deleteTicket = async (id) => {
  const response = await fetch(`${API_URL}/tickets/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete ticket');
  }
  return response.json();
};

export const updateTicketStatus = async (id, status) => {
  const response = await fetch(`${API_URL}/tickets/${id}/status`, {
    method: 'PATCH', 
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  
  if (!response.ok) {
    const putResponse = await fetch(`${API_URL}/tickets/${id}/status`, {
      method: 'PUT', 
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!putResponse.ok) {
      const error = await putResponse.json();
      throw new Error(error.message || 'Failed to update ticket status');
    }
    return putResponse.json();
  }
  return response.json();
};

export const assignDepartment = async (id, department) => {
  const response = await fetch(`${API_URL}/tickets/${id}/assign`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ department }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to assign department');
  }
  return response.json();
};

export const reopenTicket = async (id) => {
  const response = await fetch(`${API_URL}/tickets/${id}/reopen`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to reopen ticket');
  }
  return response.json();
};