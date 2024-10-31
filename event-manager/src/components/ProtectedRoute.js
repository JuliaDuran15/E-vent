import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);

  if (!isLoggedIn) {
    // Redireciona para a página de login se não estiver autenticado
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;