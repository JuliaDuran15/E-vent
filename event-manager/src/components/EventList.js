import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import '../styles/EventList.css';
import ShareEvent from './ShareEvent';
import { AuthContext } from './AuthContext';

function EventList() {
  const { isLoggedIn, userId } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch events from the backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/events');
        const activeEvents = response.data.filter((event) => event.status === 'ativo');

        setEvents(activeEvents);
      } catch (error) {
        console.error('Erro ao buscar eventos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Função para participar de um evento
  const handleJoinEvent = async (eventId) => {
    if (!isLoggedIn || !userId) {
      alert('Por favor, faça login para se inscrever no evento.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/join-event', {
        userId,
        eventId,
      });
      alert(response.data.message);

      // Atualiza o estado local após participar de um evento
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === eventId
            ? {
                ...event,
                currentParticipants: event.currentParticipants + 1,
                participantsList: [...(event.participantsList || []), userId],
              }
            : event
        )
      );
    } catch (error) {
      console.error('Erro ao se inscrever no evento:', error);
      if (error.response?.status === 400) {
        alert('Você já está inscrito neste evento.');
      } else {
        alert('Erro ao se inscrever no evento.');
      }
    }
  };

  return (
    <div className="event-list">
      <h2>Eventos Disponíveis</h2>
      {loading ? (
        <p>Carregando eventos...</p>
      ) : events.length === 0 ? (
        <p>Não há eventos disponíveis no momento.</p>
      ) : (
        <div className="card-container">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <h3>{event.name}</h3>
              <p>Data: {new Date(event.date).toLocaleDateString()}</p>
              <p>Localização: {event.location}</p>
              <p>Participantes: {event.currentParticipants}/{event.participants}</p>
              {isLoggedIn && (
                <button
                  className="join-btn"
                  onClick={() => handleJoinEvent(event.id)}
                  disabled={
                    event.currentParticipants >= event.participants ||
                    (event.participantsList || []).includes(userId)
                  }
                >
                  {event.currentParticipants >= event.participants
                    ? 'Evento Cheio'
                    : (event.participantsList || []).includes(userId)
                    ? 'Já Inscrito'
                    : 'Participar'}
                </button>
              )}
              <ShareEvent event={event} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EventList;
