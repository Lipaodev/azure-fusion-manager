
import React, { createContext, useState, useContext, useEffect } from 'react';

// Define user type
interface User {
  id: string;
  username: string;
  role: string;
  displayName: string;
}

// Define auth context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateSessionTimeout: (minutes: number) => void;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
  updateSessionTimeout: () => {},
});

// Get session timeout from localStorage or default to 15 minutes
const getSessionTimeout = (): number => {
  const savedTimeout = localStorage.getItem('sessionTimeout');
  return savedTimeout ? parseInt(savedTimeout, 10) : 15;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState<number>(getSessionTimeout());
  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  // Check if user exists in localStorage on first load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
      setLastActivity(Date.now());
    }
  }, []);

  // Set up activity listeners to track user activity
  useEffect(() => {
    const resetTimer = () => {
      setLastActivity(Date.now());
    };

    // Track various user activities
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('mousedown', resetTimer);
    window.addEventListener('keypress', resetTimer);
    window.addEventListener('touchmove', resetTimer);
    window.addEventListener('scroll', resetTimer);

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('mousedown', resetTimer);
      window.removeEventListener('keypress', resetTimer);
      window.removeEventListener('touchmove', resetTimer);
      window.removeEventListener('scroll', resetTimer);
    };
  }, []);

  // Check for session timeout
  useEffect(() => {
    if (isAuthenticated) {
      if (timeoutId) window.clearTimeout(timeoutId);
      
      const id = window.setTimeout(() => {
        const now = Date.now();
        const timeElapsed = now - lastActivity;
        const timeoutMilliseconds = sessionTimeoutMinutes * 60 * 1000;

        if (timeElapsed > timeoutMilliseconds) {
          logout();
        }
      }, 60000); // Check every minute

      setTimeoutId(id);
      
      return () => {
        if (timeoutId) window.clearTimeout(timeoutId);
      };
    }
  }, [lastActivity, isAuthenticated, sessionTimeoutMinutes]);

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    // For the superadmin account (admin:admin)
    if (username === 'admin' && password === 'admin') {
      const userData: User = {
        id: '0',
        username: 'admin',
        role: 'Admin',
        displayName: 'System Administrator',
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      setLastActivity(Date.now());
      return true;
    }
    
    // For demo users from the mock data in Login.tsx
    if (username.length > 0 && password.length > 0) {
      const userData: User = {
        id: '1',
        username: username,
        role: 'User',
        displayName: username.charAt(0).toUpperCase() + username.slice(1),
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      setLastActivity(Date.now());
      return true;
    }
    
    return false;
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    if (timeoutId) window.clearTimeout(timeoutId);
  };

  // Update session timeout
  const updateSessionTimeout = (minutes: number) => {
    localStorage.setItem('sessionTimeout', minutes.toString());
    setSessionTimeoutMinutes(minutes);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, updateSessionTimeout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
