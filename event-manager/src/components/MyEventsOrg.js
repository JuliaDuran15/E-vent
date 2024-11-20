import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import '../styles/EventList.css';

function MyEventsOrg() {
  const { userId } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [canceledEvents, setCanceledEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/my-events/${userId}`);
        const allEvents = response.data;

        // Separar eventos ativos e cancelados
        const activeEvents = allEvents.filter((event) => event.status !== 'cancelado');
        const canceledEvents = allEvents.filter((event) => event.status === 'cancelado');

        setEvents(activeEvents);
        setCanceledEvents(canceledEvents);
      } catch (error) {
        console.error('Erro ao buscar seus eventos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, [userId]);

  const handleViewParticipants = (eventId) => {
    navigate(`/event-participants/${eventId}`);
  };

  const handleCancelEvent = async (eventId) => {
    if (window.confirm('Tem certeza de que deseja cancelar este evento?')) {
      try {
        await axios.put(`http://localhost:5000/cancel-event/${eventId}`);
        alert('Evento cancelado com sucesso.');

        // Mover o evento para a lista de cancelados
        const canceledEvent = events.find((event) => event.id === eventId);
        setEvents((prev) => prev.filter((event) => event.id !== eventId));
        setCanceledEvents((prev) => [...prev, { ...canceledEvent, status: 'cancelado' }]);
      } catch (error) {
        console.error('Erro ao cancelar evento:', error);
        alert('Erro ao cancelar evento. Tente novamente.');
      }
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Tem certeza de que deseja apagar este evento? Esta ação é irreversível.')) {
      try {
        await axios.delete(`http://localhost:5000/delete-event/${eventId}`);
        alert('Evento apagado com sucesso.');

        // Remove o evento da lista de cancelados
        setCanceledEvents((prev) => prev.filter((event) => event.id !== eventId));
      } catch (error) {
        console.error('Erro ao apagar evento:', error);
        alert('Erro ao apagar evento. Tente novamente.');
      }
    }
  };

  const renderEventCard = (event, isCanceled = false) => (
    <div key={event.id} className={`event-card ${isCanceled ? 'canceled' : ''}`}>
      <h3>{event.name}</h3>
      <p>Data: {new Date(event.date).toLocaleDateString()}</p>
      <p>Localização: {event.location}</p>
      <p>Máximo de Participantes: {event.participants}</p>
      {!isCanceled ? (
        <>
          <button
            className="view-participants-btn"
            onClick={() => handleViewParticipants(event.id)}
          >
            Ver Participantes
          </button>
          <button
            className="cancel-event-btn"
            onClick={() => handleCancelEvent(event.id)}
          >
            Cancelar Evento
          </button>
        </>
      ) : (
        <button
          className="delete-event-btn"
          onClick={() => handleDeleteEvent(event.id)}
        >
          Apagar Evento
        </button>
      )}
    </div>
  );

  return (
    <div className="event-list">
      <h2>Meus Eventos</h2>
      {loading ? (
        <p>Carregando seus eventos...</p>
      ) : (
        <>
          {/* Eventos Ativos */}
          <div>
            <h3 className="event-section">Eventos Ativos</h3>
            {events.length === 0 ? (
              <p>Você não tem eventos ativos no momento.</p>
            ) : (
              <div className="card-container">
                {events.map((event) => renderEventCard(event))}
              </div>
            )}
          </div>

          {/* Eventos Cancelados */}
          <div>
            <h3 className="event-section">Eventos Cancelados</h3>
            {canceledEvents.length === 0 ? (
              <p>Você não tem eventos cancelados.</p>
            ) : (
              <div className="card-container">
                {canceledEvents.map((event) => renderEventCard(event, true))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default MyEventsOrg;
