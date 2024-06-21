import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from './Componets/context';

interface ProtectedRouteProps {
  element: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { isAuthenticated } = useUser();

  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
