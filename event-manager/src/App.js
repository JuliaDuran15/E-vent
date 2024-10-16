import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CreateEvent from './components/CreateEvent';
import Register from './components/Register';
import RegisterOrganizer from './components/RegisterOrganizer';
import Login from './components/Login'; // Importa o componente de login
import './App.css'; // Arquivo CSS para adicionar estilos

function App() {
  return (
    <Router>
      <div>
        <nav className="navbar fixed-nav">
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
            <li className="navbar-item">
              <Link to="/login" className="navbar-link">Login</Link> {/* Link para a rota de login */}
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/organizer" element={<RegisterOrganizer />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/login" element={<Login />} /> {/* Nova rota de login */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
