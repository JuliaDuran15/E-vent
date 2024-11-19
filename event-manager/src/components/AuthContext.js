// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';



export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null); // Novo estado para o "role"
  const [userId, setUserId] = useState(null); // Novo estado para o "userId"
  const [name, setName] = useState(null); 


  useEffect(() => {
    const userIsLoggedIn = localStorage.getItem('isLoggedIn');

    setIsLoggedIn(userIsLoggedIn === 'true');
    

  }, []);

  const login = (role, name, userId) => {
    console.log('Login chamado com:', { role, name, userId });
    localStorage.setItem('isLoggedIn', 'true');

    setUserRole(role);
    setName(name);
    setUserId(userId);
    setIsLoggedIn(true);
  };
  


  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userId');
    localStorage.removeItem('name');

    setIsLoggedIn(false);
    setUserRole(null);
    setName(null);
    setUserId(null);


  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole,name, userId,login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
