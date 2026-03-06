import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserProvider';

export default function PrivateRoute({ children }) {
  const { user } = useUser();
  const location = useLocation();
  if (user === undefined) return null;
  if (user === null) return <Navigate to="/login" state={{ next: location.pathname }} replace />;
  return children;
}
