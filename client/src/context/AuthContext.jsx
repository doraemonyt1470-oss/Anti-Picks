import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem('antipicks_admin_token') || sessionStorage.getItem('antipicks_admin_token');
      if (token) {
        try {
          const res = await api.verifyAdminSession();
          if (res && res.valid) {
            setAdminUser(res.user);
          } else {
            logout();
          }
        } catch {
          // If server session invalid, clear
          logout();
        }
      }
      setLoading(false);
    }
    checkAuth();
  }, []);

  const login = async (email, password, rememberMe = true) => {
    const data = await api.adminLogin(email, password, rememberMe);
    if (data.token) {
      if (rememberMe) {
        localStorage.setItem('antipicks_admin_token', data.token);
      } else {
        sessionStorage.setItem('antipicks_admin_token', data.token);
      }
      setAdminUser(data.user);
      return data.user;
    }
    throw new Error('Invalid token response from server');
  };

  const logout = () => {
    localStorage.removeItem('antipicks_admin_token');
    sessionStorage.removeItem('antipicks_admin_token');
    setAdminUser(null);
  };

  return (
    <AuthContext.Provider value={{ adminUser, isAuthenticated: Boolean(adminUser), loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
