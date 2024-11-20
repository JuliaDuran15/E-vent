import React, { createContext, useState } from 'react';

// Cria o contexto de autenticação
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null); // 1 para usuário, 2 para organizador
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState(null);

  // Função para fazer login
  const login = (role, name, userId) => {
    setIsLoggedIn(true);
    setUserRole(role);
    setUserName(name);
    setUserId(userId);

    // Armazenar informações no localStorage para persistência
    localStorage.setItem('isLoggedIn', true);
    localStorage.setItem('userRole', role);
    localStorage.setItem('userName', name);
    localStorage.setItem('userId', userId);
  };

  // Função para fazer logout
  const logout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setUserName('');
    setUserId(null);

    // Remover informações do localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
  };

  // Persistência de login ao recarregar a página
  React.useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const storedUserRole = localStorage.getItem('userRole');
    const storedUserName = localStorage.getItem('userName');
    const storedUserId = localStorage.getItem('userId');

    if (storedIsLoggedIn) {
      setIsLoggedIn(true);
      setUserRole(storedUserRole);
      setUserName(storedUserName);
      setUserId(storedUserId);
    
      console.log('Dados restaurados do localStorage:', {
        storedIsLoggedIn,
        storedUserRole,
        storedUserName,
        storedUserId,
      });
    } else {
      console.log('Nenhum dado de login encontrado no localStorage');
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userRole,
        userName,
        userId,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
