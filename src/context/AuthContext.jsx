import { createContext, useEffect, useState } from 'react';
import {
    isAuthenticated as checkAuth,
    getCurrentUser,
    login as loginService,
    logout as logoutService,
    register as registerService
} from '../services/authService';

// Set a longer token expiration time for testing
const TOKEN_EXPIRATION = 24 * 60 * 60 * 1000; // 24 hours

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkLoggedIn = () => {
      if (checkAuth()) {
        const currentUser = getCurrentUser();

        // Check if we have a valid user object
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);

          // Set a timestamp for token creation if not already set
          if (!localStorage.getItem('tokenTimestamp')) {
            localStorage.setItem('tokenTimestamp', Date.now().toString());
          }
        } else {
          // If no valid user, clear auth state
          logout();
        }
      } else {
        // Not authenticated
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    // Check login status
    checkLoggedIn();

    // Set up interval to periodically refresh the token
    const refreshInterval = setInterval(() => {
      // If authenticated, refresh the token timestamp
      if (isAuthenticated && user) {
        localStorage.setItem('tokenTimestamp', Date.now().toString());
      }
    }, 5 * 60 * 1000); // Every 5 minutes

    return () => {
      clearInterval(refreshInterval);
    };
  }, [isAuthenticated, user]);

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await registerService(userData);
      setUser(response.user);
      setIsAuthenticated(true);
      setLoading(false);
      return response;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Login user
  const login = async (userData) => {
    try {
      setLoading(true);
      const response = await loginService(userData);
      setUser(response.user);
      setIsAuthenticated(true);
      setLoading(false);
      return response;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Logout user
  const logout = () => {
    logoutService();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
