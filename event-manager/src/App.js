import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateEvent from './components/CreateEvent';
import Register from './components/Register';
import RegisterOrganizer from './components/RegisterOrganizer';
import Login from './components/Login'; 
import Home from './components/Home';
import Header from './components/Header'; // Importe o novo componente de navegação
import ProtectedRoute from './components/ProtectedRoute';
import './App.css'; 

function App() {
  return (
    <Router>
      <div>
        <Header /> {/* Componente de navegação */}
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/organizer" element={<RegisterOrganizer />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
