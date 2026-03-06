import { createContext, useContext, useState, useEffect } from 'react';
import { useApi } from './ApiProvider';

const UserContext = createContext(null);

export default function UserProvider({ children }) {
  // undefined = loading, null = not logged in, object = logged in
  const [user, setUser] = useState(undefined);
  const api = useApi();

  useEffect(() => {
    if (!api.isAuthenticated()) { setUser(null); return; }
    api.get('/api/profile')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setUser(data?.user || null))
      .catch(() => setUser(null));
  }, [api]);

  const login = async (email, password) => {
    const u = await api.login(email, password);
    setUser(u);
    return u;
  };

  const register = async (email, name, password) => {
    const u = await api.register(email, name, password);
    setUser(u);
    return u;
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, register }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
