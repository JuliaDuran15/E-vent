import React, { useEffect, useState } from 'react';
import '../styles/EventList.css';

function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento

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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EventList;
