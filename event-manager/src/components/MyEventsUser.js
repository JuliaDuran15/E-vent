import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import '../styles/EventList.css';

function MyEventsUser() {
  const { userId } = useContext(AuthContext);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/my-events-user/${userId}`);
        setJoinedEvents(response.data);
      } catch (error) {
        console.error('Erro ao buscar eventos inscritos:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchMyEvents();
    }
  }, [userId]);

  return (
    <div className="event-list">
      <h2>Meus Eventos</h2>
      {loading ? (
        <p>Carregando seus eventos...</p>
      ) : joinedEvents.length === 0 ? (
        <p>Você não está inscrito em nenhum evento.</p>
      ) : (
        <div className="card-container">
          {joinedEvents.map((event) => (
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

export default MyEventsUser;
