import { createContext, useContext, useRef } from 'react';
import TodoApiClient from '../api/TodoApiClient';

const ApiContext = createContext(null);

export default function ApiProvider({ children }) {
  const api = useRef(new TodoApiClient());
  return <ApiContext.Provider value={api.current}>{children}</ApiContext.Provider>;
}

export function useApi() {
  return useContext(ApiContext);
}
