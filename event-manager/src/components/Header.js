// Header.js
import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext'; // Importa o contexto de autenticação
import logo from '../images/e-vent-logo.png';
import '../styles/Header.css';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useContext(AuthContext); // Acessa o estado e funções de login/logout

  // Função para logout usando o contexto
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isHomePage = location.pathname === '/home';

  return (
    <nav className="navbar fixed-nav">
      <div className="navbar-logo">
        <img src={logo} alt="logo" className="logo" />
        <span className="logo-text">E-vent</span>
      </div>

      <ul className="navbar-list">
        
        {!isLoggedIn ? (
          <>
              
              <li className="navbar-item">
              <Link to="/" className="navbar-link">Registrar Usuário</Link>
            </li>
            <li className="navbar-item">
              <Link to="/organizer" className="navbar-link">Registrar Organizador</Link>
            </li>
            <li className="navbar-item">
                <Link to="/login" className="navbar-link">Login</Link>
              </li>
              </>
            ) : (
              <>
              {!isHomePage && (
              <li className="navbar-item">
              <Link to="/home" className="navbar-link">Home</Link>
            </li>)}

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
                <Link to="/login" className="navbar-link" onClick={handleLogout}>Logout</Link>
              </li>
              
              </>
        )}
      </ul>
    </nav>
  );
}

export default Header;
