import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import '../styles/CreateEvent.css';

function CreateEvent() {
  const { userId } = useContext(AuthContext);

  const [event, setEvent] = useState({
    name: '',
    date: '',
    location: '',
    participants: '',

  });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(null);

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!event.name || !event.date || !event.location || !event.participants) {
      setMessage('Por favor, preencha todos os campos.');
      return;
    }

    try {
      console.log('Dados enviados para o backend:', {
        ...event,
        organizerId: userId,
      });

      const response = await axios.post('http://localhost:5000/create-event', {
        ...event,
        organizerId: userId, // Usa o userId corretamente
      });
      
      setMessage(response.data.message);
      setIsSuccess(true);
      setEvent({ name: '', date: '', location: '', participants: '' });
    } catch (error) {
      setMessage('Erro ao criar o evento. Tente novamente.', error);
      setIsSuccess(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Criar Evento</h1>
      <form className="event-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nome do Evento"
          value={event.name}
          onChange={handleChange}
          required
          className="input-field"
        />

        <input
          type="date"
          name="date"
          placeholder="Data"
          value={event.date}
          onChange={handleChange}
          required
          className="input-field"
        />

        <input
          type="text"
          name="location"
          placeholder="Local"
          value={event.location}
          onChange={handleChange}
          required
          className="input-field"
        />

        <input
          type="number"
          name="participants"
          placeholder="Número de Participantes"
          value={event.participants}
          onChange={handleChange}
          required
          className="input-field"
        />

        <button type="submit" className="submit-btn">Criar Evento</button>
      </form>
      {message && <p className={isSuccess ? 'message-success' : 'message-error'}>{message}</p>}
    </div>
  );
}

export default CreateEvent;
