import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('cybersafe_token'));
  const [loading, setLoading] = useState(true);

  const persistAuth = (nextToken, nextUser) => {
    localStorage.setItem('cybersafe_token', nextToken);
    localStorage.setItem('cybersafe_user', JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  };

  const clearAuth = () => {
    localStorage.removeItem('cybersafe_token');
    localStorage.removeItem('cybersafe_user');
    setToken(null);
    setUser(null);
  };

  const signup = async (payload) => {
    const { data } = await api.post('/auth/signup', payload);
    persistAuth(data.token, data.user);
    return data;
  };

  const login = async (payload) => {
    const { data } = await api.post('/auth/login', payload);
    persistAuth(data.token, data.user);
    return data;
  };

  const logout = () => {
    clearAuth();
  };

  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        const cachedUser = localStorage.getItem('cybersafe_user');

        if (token && cachedUser) {
          setUser(JSON.parse(cachedUser));
          const { data } = await api.get('/auth/me');
          setUser(data.user);
          localStorage.setItem('cybersafe_user', JSON.stringify(data.user));
        }
      } catch (error) {
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    bootstrapAuth();
  }, [token]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(user && token),
      signup,
      login,
      logout,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
