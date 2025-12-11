import axios from 'axios';
import { auth } from '../config/firebase.config';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Send cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add Firebase token to headers
api.interceptors.request.use(
  async (config) => {
    try {
      // Wait for auth to be ready
      const currentUser = auth.currentUser;
      console.log('🔐 Current user:', currentUser ? currentUser.email : 'No user');
      
      if (currentUser) {
        const token = await currentUser.getIdToken(true); // Force refresh
        console.log('✅ Token obtained:', token ? 'Yes' : 'No');
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        // If no current user, try to wait a bit for auth to initialize
        console.log('⏳ Waiting for auth to initialize...');
        await new Promise(resolve => setTimeout(resolve, 500));
        const retryUser = auth.currentUser;
        if (retryUser) {
          const token = await retryUser.getIdToken(true);
          console.log('✅ Token obtained after retry:', token ? 'Yes' : 'No');
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          console.warn('⚠️ No user found even after retry');
        }
      }
    } catch (error) {
      console.error('❌ Error getting ID token:', error);
    }
    console.log('📤 Request headers:', config.headers);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      // Only redirect if not already on login/register page
      if (!window.location.pathname.includes('/login') && 
          !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
