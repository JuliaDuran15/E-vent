// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';



export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null); // Novo estado para o "role"

  useEffect(() => {
    const userIsLoggedIn = localStorage.getItem('isLoggedIn');
    setIsLoggedIn(userIsLoggedIn === 'true');
  }, []);

  const login = (role) => {
    localStorage.setItem('isLoggedIn', 'true');
    setUserRole(role)
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    setUserRole(null)

  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
