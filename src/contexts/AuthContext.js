import { createContext, useContext, useState, useEffect } from 'react';

const BASE = process.env.REACT_APP_BASE_API_URL || (typeof window !== 'undefined' && window.location.port === '3000' ? 'http://localhost:5000' : '');

const AuthContext = createContext(null);

async function parseJsonSafe(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if session is active on mount
  useEffect(() => {
    fetch(`${BASE}/api/profile`, { credentials: 'include' })
      .then((r) => (r.ok ? parseJsonSafe(r) : null))
      .then((data) => {
        setUser(data?.user || null);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, []);

  const register = async ({ email, name, password }) => {
    const r = await fetch(`${BASE}/api/register`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, password }),
    });
    const data = await parseJsonSafe(r);
    if (!r.ok) throw new Error(data?.error || 'Registration failed');
    if (!data?.user) throw new Error('Registration failed');
    setUser(data.user);
    return data.user;
  };

  const login = async ({ email, password }) => {
    const r = await fetch(`${BASE}/api/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await parseJsonSafe(r);
    if (!r.ok) throw new Error(data?.error || 'Login failed');
    if (!data?.user) throw new Error('Login failed');
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    await fetch(`${BASE}/api/logout`, {
      method: 'POST',
      credentials: 'include',
    });
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
