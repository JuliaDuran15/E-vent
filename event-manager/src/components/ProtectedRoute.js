import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { userRole, logout } = useContext(AuthContext);

  // Se o userRole for `null`, faz logout e redireciona para a página de login
  if (userRole === null) {
    logout();
    return <Navigate to="/login" />;
  }

  // Se o userRole não está incluído nos allowedRoles, redireciona para a página não autorizada
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }

  // Renderiza os filhos se o usuário tiver permissão
  return children;
};

export default ProtectedRoute;
