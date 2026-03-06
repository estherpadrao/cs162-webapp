import { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch, parseJsonSafe } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    apiFetch('/api/profile', { signal: controller.signal })
      .then((r) => (r.ok ? parseJsonSafe(r) : null))
      .then((data) => { setUser(data?.user || null); setLoading(false); })
      .catch((err) => { if (err.name !== 'AbortError') { setUser(null); setLoading(false); } });
    return () => controller.abort();
  }, []);

  const authRequest = async (endpoint, body) => {
    const r = await apiFetch(endpoint, { method: 'POST', body });
    const data = await parseJsonSafe(r);
    if (!r.ok) throw new Error(data?.error || 'Request failed');
    if (!data?.user) throw new Error('Request failed');
    setUser(data.user);
    return data.user;
  };

  const register = ({ email, name, password }) =>
    authRequest('/api/register', { email, name, password });

  const login = ({ email, password }) =>
    authRequest('/api/login', { email, password });

  const logout = async () => {
    await apiFetch('/api/logout', { method: 'POST' });
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
