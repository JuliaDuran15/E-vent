import React from 'react';
import '../styles/ShareEvent.css';


function ShareEvent({ event }) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Confira o evento: ${event.name}`,
          text: `Não perca o evento ${event.name} em ${event.date}. Saiba mais!`,
          url: window.location.href,
        });
        alert('Evento compartilhado com sucesso!');
      } catch (error) {
        alert('Erro ao compartilhar evento.');
      }
    } else {
      alert('Compartilhamento não suportado neste navegador.');
    }
  };

  return (
    <button onClick={handleShare} className="share-btn">
      Compartilhar Evento
    </button>
  );
}

export default ShareEvent;
