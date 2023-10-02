import { Outlet, Navigate } from 'react-router';
import { useAuth } from '../auth/AuthContext';

const Protected = () => {
  const { auth } = useAuth();

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return <Outlet></Outlet>;
};

export default Protected;
