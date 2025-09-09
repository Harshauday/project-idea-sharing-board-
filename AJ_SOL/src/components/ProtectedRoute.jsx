import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  if (!user || !token) {
    // User not authenticated, redirect to sign-in page
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;