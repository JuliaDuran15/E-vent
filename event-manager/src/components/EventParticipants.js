import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styles/EventParticipants.css';

function EventParticipants() {
  const { eventId } = useParams();
  const [participants, setParticipants] = useState([]);
  const [filteredParticipants, setFilteredParticipants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Memoriza a função para evitar recriações
  const fetchParticipants = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/event-participants/${eventId}`);
      setParticipants(response.data);
      setFilteredParticipants(response.data); // Inicialmente, todos os participantes são exibidos
    } catch (error) {
      console.error('Erro ao buscar participantes:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = participants.filter((participant) =>
      participant.name.toLowerCase().includes(term)
    );
    setFilteredParticipants(filtered);
  };

  const toggleVipStatus = async (userId, isVip) => {
    try {
      const response = await axios.post('http://localhost:5000/update-vip-status', {
        userId,
        eventId,
        isVip: !isVip,
      });
      alert(response.data.message);

      // Atualiza o estado local
      setParticipants((prev) =>
        prev.map((participant) =>
          participant.userId === userId
            ? { ...participant, isVip: !isVip }
            : participant
        )
      );

      // Atualiza a lista filtrada também
      setFilteredParticipants((prev) =>
        prev.map((participant) =>
          participant.userId === userId
            ? { ...participant, isVip: !isVip }
            : participant
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar status VIP:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, [fetchParticipants]); // Incluímos fetchParticipants como dependência

  return (
    <div className="event-participants">
      <h2>Participantes do Evento</h2>

      {/* Barra de Pesquisa */}
      <input
        type="text"
        className="search-bar"
        placeholder="Buscar participante por nome..."
        value={searchTerm}
        onChange={handleSearch}
      />

      {loading ? (
        <p>Carregando participantes...</p>
      ) : filteredParticipants.length === 0 ? (
        <p>Nenhum participante encontrado.</p>
      ) : (
        <ul className="participants-list">
          {filteredParticipants.map((participant) => (
            <li key={participant.userId} className="participant-item">
              <span>
                {participant.name} ({participant.email})
              </span>
              <span className={`vip-status ${participant.isVip ? 'vip' : 'not-vip'}`}>
                {participant.isVip ? 'VIP' : 'Não VIP'}
              </span>
              <button
                className="toggle-vip-btn"
                onClick={() => toggleVipStatus(participant.userId, participant.isVip)}
              >
                {participant.isVip ? 'Remover VIP' : 'Tornar VIP'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default EventParticipants;
