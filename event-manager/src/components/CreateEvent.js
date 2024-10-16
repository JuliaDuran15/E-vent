import React, { useState } from 'react';
import axios from 'axios';
import './CreateEvent.css'; // Importa o arquivo de estilo

function CreateEvent() {
  const [event, setEvent] = useState({
    name: '',
    date: '',
    location: '',
    participants: ''
  });

  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(null); // Para controlar se a mensagem é de sucesso ou erro
  const [eventSuccessMessage, setEventSuccessMessage] = useState('');

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
      const response = await axios.post('http://localhost:5000/create-event', event);
      setMessage(response.data.message);
      setIsSuccess(true); // Define como sucesso
      setEventSuccessMessage(`Evento ${event.name} criado com sucesso!`);
      setEvent({ name: '', date: '', location: '', participants: '' });
    } catch (error) {
      setMessage('Erro ao criar o evento. Tente novamente.');
      setIsSuccess(false); // Define como erro
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


      {message && (
        <p className={isSuccess ? 'message-success' : 'message-error'}>{message}</p>
      )}

    </div>
  );
}

export default CreateEvent;
