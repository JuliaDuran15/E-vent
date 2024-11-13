import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateEvent from './components/CreateEvent';
import Register from './components/Register';
import RegisterOrganizer from './components/RegisterOrganizer';
import Login from './components/Login'; 
import Header from './components/Header'; // Importe o novo componente de navegação
import ProtectedRoute from './components/ProtectedRoute';

import UserView from './components/UserView'
import OrgView from './components/OrgView'
import Unauthorized from './components/Unauthorized';
import './App.css'; 
import Home from './components/UserView';
import EventList from './components/EventList';

function App() {
  return (
    <Router>
      <div>
        <Header /> {/* Componente de navegação */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/organizer" element={<RegisterOrganizer />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events" element={<EventList />} />
          <Route path="/userview" 
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <UserView />
              </ProtectedRoute>
            } />
          <Route path="/orgview"
             element={
              <ProtectedRoute allowedRoles={[2]}>
                <OrgView />
              </ProtectedRoute>
            } />
          <Route path="/unauthorized" element={<Unauthorized />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
