const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getDashboardMetrics = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/dashboard/metrics`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch metrics');
  }

  return response.json();
};