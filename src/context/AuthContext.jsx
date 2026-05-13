"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Memoized profile check to avoid unnecessary re-renders
  const checkProfile = useCallback(async () => {
    const token = localStorage.getItem('admin_token');
    
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.get('/auth/profile');
      // Strict admin check
      if (data && data.role === 'admin') {
        setUser(data);
      } else {
        setUser(null);
        localStorage.removeItem('admin_token');
      }
    } catch (err) {
      setUser(null);
      localStorage.removeItem('admin_token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkProfile();
  }, [checkProfile]);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/admin/login', { email, password });
      
      if (data.token) {
        localStorage.setItem('admin_token', data.token);
      }
      
      if (data.user && data.user.role === 'admin') {
        setUser(data.user);
        return data.user;
      } else {
        throw new Error('Access denied: Admin rights required.');
      }
    } catch (err) {
      localStorage.removeItem('admin_token');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout request failed, clearing local state anyway');
    } finally {
      localStorage.removeItem('admin_token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, checkProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
