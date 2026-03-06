import { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: restore session from localStorage token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }
    apiFetch('/api/profile')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { setUser(data?.user || null); setLoading(false); })
      .catch(() => { setLoading(false); });
  }, []);

  const authRequest = async (path, body) => {
    const r = await apiFetch(path, { method: 'POST', body });
    const data = await r.json();
    if (!r.ok) throw new Error(data?.error || 'Request failed');
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data.user;
  };

  const register = ({ email, name, password }) =>
    authRequest('/api/register', { email, name, password });

  const login = ({ email, password }) =>
    authRequest('/api/login', { email, password });

  const logout = async () => {
    await apiFetch('/api/logout', { method: 'POST' });
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
