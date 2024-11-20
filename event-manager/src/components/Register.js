import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Register.css'; // Importa o arquivo de estilo
import { useNavigate } from 'react-router-dom';

function Register() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 1, // 1 = Cliente
  });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(null); // Para controlar se a mensagem é de sucesso ou erro
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/register', user);

      // Exibe mensagem de sucesso
      setMessage(response.data.message);
      setIsSuccess(true);

      // Redireciona para a página de login após o registro
      setTimeout(() => {
        navigate('/login');
      }, 2000); // Tempo para mostrar a mensagem antes de redirecionar
    } catch (error) {
      setMessage('Erro ao registrar o usuário.');
      setIsSuccess(false); // Define como erro
    }
  };

  return (
    <div className="register-container">
      <h1 className="register-title">Registrar Usuário</h1>
      <form className="register-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nome"
          value={user.name}
          onChange={handleChange}
          required
          className="input-field"
        />
        <input
          type="email"
          name="email"
          placeholder="E-mail"
          value={user.email}
          onChange={handleChange}
          required
          className="input-field"
        />
        <input
          type="password"
          name="password"
          placeholder="Senha"
          value={user.password}
          onChange={handleChange}
          required
          className="input-field"
        />
        <button type="submit" className="submit-btn">Registrar</button>
      </form>

      {message && (
        <p className={isSuccess ? 'message-success' : 'message-error'}>{message}</p>
      )}
    </div>
  );
}

export default Register;
