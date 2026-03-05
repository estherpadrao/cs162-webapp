import { createContext, useContext, useState, useEffect } from 'react';

const BASE = process.env.REACT_APP_BASE_API_URL || '';

const AuthContext = createContext(null);

async function readResponse(response) {
  const text = await response.text();
  if (!text) return { data: null, text: '' };

  try {
    return { data: JSON.parse(text), text };
  } catch {
    return { data: null, text };
  }
}

function buildErrorMessage(prefix, response, data, text) {
  if (data?.error) return data.error;
  if (text) return text;
  return `${prefix} (${response.status})`;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if session is active on mount
  useEffect(() => {
    fetch(`${BASE}/api/profile`, { credentials: 'include' })
      .then(async (r) => {
        if (!r.ok) return null;
        const { data } = await readResponse(r);
        return data;
      })
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

    const { data, text } = await readResponse(r);
    if (!r.ok) {
      throw new Error(buildErrorMessage('Registration failed', r, data, text));
    }
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

    const { data, text } = await readResponse(r);
    if (!r.ok) {
      throw new Error(buildErrorMessage('Login failed', r, data, text));
    }

    if (data?.user) {
      setUser(data.user);
      return data.user;
    }

    // Fallback: if login succeeded but body was empty/non-JSON, verify via profile.
    const profileResponse = await fetch(`${BASE}/api/profile`, {
      credentials: 'include',
    });
    const { data: profileData } = await readResponse(profileResponse);
    if (profileResponse.ok && profileData?.user) {
      setUser(profileData.user);
      return profileData.user;
    }

    throw new Error('Login failed');
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
