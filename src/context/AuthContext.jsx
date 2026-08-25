import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // true until we check localStorage

  // On mount: check if we have valid tokens saved from a previous session.
  // This keeps the user logged in across page refreshes without forcing re-login.
  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');

    if (accessToken && refreshToken) {
      // Tokens exist — treat the user as authenticated.
      // The api.js interceptor will auto-refresh the access token if it has expired.
      setIsAuthenticated(true);
    }

    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login/', { username, password });
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error('Login failed', error);
      return { success: false, error: error.response?.data?.detail || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

