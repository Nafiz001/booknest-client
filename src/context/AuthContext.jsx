import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebase.config';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Register with email and password
  const registerUser = async (email, password, name, photoURL) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with name and photo
      await updateProfile(userCredential.user, {
        displayName: name,
        photoURL: photoURL
      });
      
      // Get Firebase ID token
      const idToken = await userCredential.user.getIdToken();
      
      // Sync with backend
      const response = await api.post('/auth/register', {
        name,
        email,
        photoURL,
        authProvider: 'email',
        uid: userCredential.user.uid
      });
      
      // Store Firebase ID token instead of custom JWT
      localStorage.setItem('booknest_token', idToken);
      localStorage.setItem('booknest_user', JSON.stringify(response.data.user));
      
      // Refresh user data
      setUser({
        ...userCredential.user,
        displayName: name,
        photoURL: photoURL,
        role: response.data.user.role
      });
      
      setLoading(false);
      return userCredential;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Login with email and password
  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Get Firebase ID token
      const idToken = await userCredential.user.getIdToken();
      
      // Sync with backend
      const response = await api.post('/auth/login', {
        email,
        authProvider: 'email'
      });
      
      // Store Firebase ID token instead of custom JWT
      localStorage.setItem('booknest_token', idToken);
      localStorage.setItem('booknest_user', JSON.stringify(response.data.user));
      
      setLoading(false);
      return userCredential;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // Get Firebase ID token
      const idToken = await userCredential.user.getIdToken();
      
      // Sync with backend
      const response = await api.post('/auth/login', {
        email: userCredential.user.email,
        authProvider: 'google',
        uid: userCredential.user.uid
      });
      
      // Store Firebase ID token instead of custom JWT
      localStorage.setItem('booknest_token', idToken);
      localStorage.setItem('booknest_user', JSON.stringify(response.data.user));
      
      setLoading(false);
      return userCredential;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Logout
  const logoutUser = async () => {
    setLoading(true);
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('booknest_token');
      localStorage.removeItem('booknest_user');
      await signOut(auth);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (updates) => {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, updates);
      setUser({ ...auth.currentUser, ...updates });
    }
  };

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Get fresh Firebase ID token
        try {
          const idToken = await currentUser.getIdToken(true); // Force refresh
          localStorage.setItem('booknest_token', idToken);
        } catch (error) {
          console.error('Error refreshing token:', error);
        }
      }
      setUser(currentUser);
      setLoading(false);
    });

    // Refresh token every 50 minutes (Firebase tokens expire after 1 hour)
    const tokenRefreshInterval = setInterval(async () => {
      if (auth.currentUser) {
        try {
          const idToken = await auth.currentUser.getIdToken(true);
          localStorage.setItem('booknest_token', idToken);
          console.log('🔄 Firebase token refreshed');
        } catch (error) {
          console.error('Error refreshing token:', error);
        }
      }
    }, 50 * 60 * 1000); // 50 minutes

    return () => {
      unsubscribe();
      clearInterval(tokenRefreshInterval);
    };
  }, []);

  const authInfo = {
    user,
    loading,
    registerUser,
    loginUser,
    loginWithGoogle,
    logoutUser,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};
