import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './Auth.jsx';

const ProtectedRoute = ({ element }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? element : <Navigate to="/" />;
};

export default ProtectedRoute;
