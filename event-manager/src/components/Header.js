// Header.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../images/e-vent-logo.png'; // Ajuste o caminho para seu logo
import './Header.css'; // Estilos específicos para o cabeçalho

function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  // Simulando um estado de autenticação
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Verifica se o usuário está logado ao montar o componente
  useEffect(() => {
    const userIsLoggedIn = localStorage.getItem('isLoggedIn'); // Exemplo: verifica no localStorage
    if (userIsLoggedIn === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  // Função para logout
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn'); // Remove o estado de login do localStorage
    setIsLoggedIn(false);
    navigate('/login'); // Redireciona o usuário para a página de login
  };

  // Verifica se a página atual é "Home"
  const isHomePage = location.pathname === '/home';

  return (
    <nav className="navbar fixed-nav">
      {/* Logo e título do aplicativo */}
      <div className="navbar-logo">
        <img src={logo} alt="logo" className="logo" />
        <span className="logo-text">E-vent</span>
      </div>

      {/* Itens de navegação, escondidos na página Home */}
      
        <ul className="navbar-list">
        {!isHomePage && (
            <>
          <li className="navbar-item">
            <Link to="/" className="navbar-link">Registrar Usuário</Link>
          </li>
          <li className="navbar-item">
            <Link to="/organizer" className="navbar-link">Registrar Organizador</Link>
          </li>
            <li className="navbar-item">
              <Link to="/create-event" className="navbar-link">Criar Evento</Link>
            </li>
            <li className="navbar-item">
              <Link to="/login" className="navbar-link">
                Login
              </Link>
            </li>
            </>
        )}
        </ul>
      {isHomePage && (
            <li className="navbar-item">
              <Link to="/login" className="navbar-link" onClick={handleLogout}>
                Logout
              </Link>
            </li>
        )}
    </nav>
  );
}

export default Header;
