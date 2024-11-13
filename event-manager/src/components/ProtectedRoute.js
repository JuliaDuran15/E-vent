import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { userRole } = useContext(AuthContext);

  if(userRole === null){
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(userRole)) {
    // Redireciona para a página inicial ou para uma página de erro caso o userRole não esteja autorizado
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;