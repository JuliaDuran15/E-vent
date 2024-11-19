import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import logo from '../images/e-vent-logo.png';
import '../styles/Header.css';

function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, userRole, logout } = useContext(AuthContext);

  // Log para verificar o valor de userRole
  console.log('userRole:', userRole);

  // Função para logout usando o contexto
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
              <Link to="/" className="navbar-link">Home</Link>
            </li>
            <li className="navbar-item">
              <Link to="/login" className="navbar-link">Login</Link>
            </li>
            <li className="navbar-item">
              <Link to="/register" className="navbar-link">Registrar Usuário</Link>
            </li>
            <li className="navbar-item">
              <Link to="/organizer" className="navbar-link">Registrar Organizador</Link>
            </li>
          </>
        ) : (
          <>
            <li className="navbar-item">
              <Link to="/" className="navbar-link">Home</Link>
            </li>

            {/* Verificação correta para userRole como string */}
            {userRole === 2 && (
              <>
                <li className="navbar-item">
                  <Link to="/create-event" className="navbar-link">Criar Evento</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/my-events-org" className="navbar-link">Meus Eventos</Link>
                </li>
              </>
            )}

      {userRole === 1 && (

              <li className="navbar-item">
                <Link to="/my-events-user" className="navbar-link">Meus Eventos</Link>
              </li>
      )}



            <li className="navbar-item">
              <Link to="/login" className="navbar-link" onClick={handleLogout}>
                Logout
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Header;
