import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import '../styles/EventList.css';
import ShareEvent from './ShareEvent';
import { AuthContext } from './AuthContext';

function EventList() {
  const { userId } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joinedEvents, setJoinedEvents] = useState([]);


  useEffect(() => {
    // Fetch events from the backend
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/events');
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Erro ao buscar eventos:', error);
      } finally {
        setLoading(false); // Define o carregamento como falso após a tentativa de fetch
      }
    };

    fetchEvents();
  }, []);

// Função para participar de um evento
const handleJoinEvent = async (eventId) => {
  if (!userId) {
    alert('Por favor, faça login para se inscrever no evento.');
    return;
  }

  try {
    const response = await axios.post('http://localhost:5000/join-event', {
      userId,
      eventId,
    });
    alert(response.data.message);
    setJoinedEvents((prev) => [...prev, eventId]);
  } catch (error) {
    console.error('Erro ao se inscrever no evento:', error);
    if (error.response && error.response.status === 400) {
      alert('Você já está inscrito neste evento.');
      setJoinedEvents((prev) => [...prev, eventId]);
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
          {events.map(event => (
            <div key={event.id} className="event-card">
              <h3>{event.name}</h3>
              <p>Data: {new Date(event.date).toLocaleDateString()}</p>
              <p>Localização: {event.location}</p>
              <p>Participantes: {event.participants}</p>
              {/* Botão para participar do evento */}
              <button
                className="join-btn"
                onClick={() => handleJoinEvent(event.id)}
                disabled={joinedEvents.includes(event.id)}
              >
                {joinedEvents.includes(event.id) ? 'Já Inscrito' : 'Participar'}
              </button>
              <ShareEvent event={event} />
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EventList;
