import React, { useState } from 'react';
import axios from 'axios';
import '../styles/RegisterOrganizer.css'; // Importa o arquivo de estilo
import { useNavigate } from 'react-router-dom';

function RegisterOrganizer() {
  const [organizer, setOrganizer] = useState({
    name: '',
    email: '',
    password: '',
    role: 2, // 2 = Organizador
  });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(null); // Para controlar se a mensagem é de sucesso ou erro
  const navigate = useNavigate();

  const handleChange = (e) => {
    setOrganizer({ ...organizer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/register', organizer);
      setMessage(`Bem-vindo(a), ${organizer.name}! Seu cadastro foi realizado com sucesso!`);
      setIsSuccess(true); // Define como sucesso

      // Redireciona para a página de login após 2 segundos
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setMessage('Erro ao registrar o organizador. Por favor, tente novamente.');
      setIsSuccess(false); // Define como erro
    }
  };

  return (
    <div className="organizer-container">
      <h1 className="organizer-title">Registrar Organizador</h1>
      <form className="organizer-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nome"
          value={organizer.name}
          onChange={handleChange}
          required
          className="input-field"
        />
        <input
          type="email"
          name="email"
          placeholder="E-mail"
          value={organizer.email}
          onChange={handleChange}
          required
          className="input-field"
        />
        <input
          type="password"
          name="password"
          placeholder="Senha"
          value={organizer.password}
          onChange={handleChange}
          required
          className="input-field"
        />
        <button type="submit" className="submit-btn">Registrar Organizador</button>
      </form>

      {message && (
        <p className={isSuccess ? 'message-success' : 'message-error'}>{message}</p>
      )}
    </div>
  );
}

export default RegisterOrganizer;
