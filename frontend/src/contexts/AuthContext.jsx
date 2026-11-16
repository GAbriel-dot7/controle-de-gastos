import { createContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api.js';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('expense-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('expense-token') || null);

  const login = async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    localStorage.setItem('expense-token', response.data.token);
    localStorage.setItem('expense-user', JSON.stringify(response.data.user));
    setToken(response.data.token);
    setUser(response.data.user);
    return response.data;
  };

  const register = async (payload) => {
    const response = await api.post('/api/auth/register', payload);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('expense-token');
    localStorage.removeItem('expense-user');
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    if (!token) {
      return;
    }

    api.get('/api/auth/me')
      .then((response) => {
        setUser(response.data.user);
        localStorage.setItem('expense-user', JSON.stringify(response.data.user));
      })
      .catch(() => {
        logout();
      });
  }, [token]);

  const value = useMemo(() => ({ user, token, login, register, logout }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
