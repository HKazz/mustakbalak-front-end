import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredUserType }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to appropriate login page based on required user type
    const loginPath = requiredUserType === 'hiring_manager' ? '/hiring-manager/login' : '/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (requiredUserType && user?.userType !== requiredUserType) {
    // Redirect to home if user type doesn't match
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute; 