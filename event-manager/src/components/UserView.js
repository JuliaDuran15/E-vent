import React from 'react';
import '../styles/UserView.css'; // Arquivo de estilos separado

function Home() {
  return (
    <div className="home-container">
      <div className="hero">
        <h1>Bem-vindo à E-vent</h1>
        <p>USUARIO BEM VINDO</p>
        <button className="cta-button">Explorar Eventos</button>
      </div>
    </div>
  );
}

export default Home;
