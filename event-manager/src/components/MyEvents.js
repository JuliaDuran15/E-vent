import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import '../styles/EventList.css';
import { AuthContext } from './AuthContext';

function MyEvents() {
  const { isLoggedIn, userId } = useContext(AuthContext);
  const [activeEvents, setActiveEvents] = useState([]);
  const [canceledEvents, setCanceledEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyEvents = async () => {
      if (!isLoggedIn || !userId) {
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/my-events-user/${userId}`);
        console.log('Eventos retornados:', response.data);

        // Filtra eventos por status
        const active = response.data.filter((event) => event.status === 'ativo');
        const canceled = response.data.filter((event) => event.status === 'cancelado');

        setActiveEvents(active);
        setCanceledEvents(canceled);
      } catch (error) {
        console.error('Erro ao buscar eventos inscritos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, [isLoggedIn, userId]);

  return (
    <div className="my-events">
      <h2>Meus Eventos</h2>
      {loading ? (
        <p>Carregando seus eventos...</p>
      ) : (
        <>
          {/* Eventos Ativos */}
          <div className="event-section">
            <h3>Eventos Ativos</h3>
            {activeEvents.length === 0 ? (
              <p>Você não está inscrito em nenhum evento ativo no momento.</p>
            ) : (
              <div className="event-list">
                {activeEvents.map((event) => (
                <div key={event.id} className="event-card active">
                  <h3>{event.name}</h3>
                  <p>Data: {new Date(event.date).toLocaleDateString()}</p>
                  <p>Localização: {event.location}</p>
                  <p>Participantes: {event.currentParticipants}/{event.participants}</p>
                
                  <span className={`vip-status ${event.isVip ? 'vip' : 'not-vip'}`}>
                        {event.isVip ? 'VIP' : 'Não VIP'}
                      </span>                </div>
              ))}
              </div>
            )}
          </div>

          {/* Eventos Cancelados */}
          <div className="event-section">
            <h3>Eventos Cancelados</h3>
            {canceledEvents.length === 0 ? (
              <p>Você não está inscrito em nenhum evento cancelado.</p>
            ) : (
              <div className="event-list">
                {canceledEvents.map((event) => (
                  <div key={event.id} className="event-card canceled">
                    <h3>{event.name}</h3>
                    <p>Data: {new Date(event.date).toLocaleDateString()}</p>
                    <p>Localização: {event.location}</p>
                    <p>Participantes: {event.currentParticipants}/{event.participants}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default MyEvents;
