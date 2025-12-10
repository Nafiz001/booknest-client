import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Save or update user in database
export const saveOrUpdateUser = async (userData) => {
  try {
    const { data } = await axios.post(`${API_URL}/auth/user`, userData);
    return data;
  } catch (error) {
    console.error('Error saving/updating user:', error);
    throw error;
  }
};
