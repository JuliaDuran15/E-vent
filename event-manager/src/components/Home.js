import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../styles/Home.css'; // Arquivo de estilos separado

function Home() {
  const [events, setEvents] = useState([]);

  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate('/events');
  };



  return (
    <div className="home-container">
      <div className="hero">
        <h1>Bem-vindo à E-vent</h1>
        <p>USUARIO BEM VINDO</p>
        <button className="cta-button" onClick={handleExploreClick}>
          Explorar Eventos
        </button>
      </div>
    </div>
  );
}

export default Home;
