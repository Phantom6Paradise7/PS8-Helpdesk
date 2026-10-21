const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const getDepartments = async () => {
  const response = await fetch(`${API_URL}/departments`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch departments');
  }
  return response.json();
};

export const createDepartment = async (departmentData) => {
  const response = await fetch(`${API_URL}/departments`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(departmentData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create department');
  }
  return response.json();
};

export const updateDepartment = async (id, departmentData) => {
  const response = await fetch(`${API_URL}/departments/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(departmentData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update department');
  }
  return response.json();
};

export const deleteDepartment = async (id) => {
  const response = await fetch(`${API_URL}/departments/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete department');
  }
  return response.json();
};