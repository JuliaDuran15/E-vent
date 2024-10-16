import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CreateEvent from './components/CreateEvent';
import Register from './components/Register';
import RegisterOrganizer from './components/RegisterOrganizer';
import logo from './images/e-vent-logo.png';
import './App.css'; // Arquivo CSS para adicionar estilos

function App() {
  return (
    <Router>
      <div>
<nav className="navbar fixed-nav">
  <img src={logo} alt="logo" className="logo" />
  <span className='logo-text'>e-vent</span>
          <ul className="navbar-list">
            <li className="navbar-item">
              <Link to="/" className="navbar-link">Registrar Usuário</Link>
            </li>
            <li className="navbar-item">
              <Link to="/organizer" className="navbar-link">Registrar Organizador</Link>
            </li>
            <li className="navbar-item">
              <Link to="/create-event" className="navbar-link">Criar Evento</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/organizer" element={<RegisterOrganizer />} />
          <Route path="/create-event" element={<CreateEvent />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
