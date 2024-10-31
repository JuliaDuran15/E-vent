import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import { AuthContext } from './AuthContext'; // Importa o AuthContext

function Login() {
  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(null);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Usa o contexto para acessar a função de login

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', user);
      setMessage(response.data.message);
      setIsSuccess(true);

      if (response.data.message === 'Login bem-sucedido!') {
        login(); // Chama a função de login para atualizar o estado de autenticação


        // (NÃO SOU O CHATGPT!!!!!!!!!) VER NO BANCO DE DADOS A ROLE REFERENTE AO EMAIL
        
        //SE FOR ORGANIZADOR -> /OrgView

        //SE FOR USUARIO COMUM -> /UserView

        navigate('/home'); // Redireciona o usuário para a página inicial
      }
      setUser({ email: '', password: '' });
    } catch (error) {
      setMessage('Erro ao fazer login.');
      setIsSuccess(false);
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Login</h1>
      <form className="login-form" onSubmit={handleSubmit}>
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
        <button type="submit" className="submit-btn">Login</button>
      </form>

      {message && (
        <p className={isSuccess ? 'message-success' : 'message-error'}>{message}</p>
      )}
    </div>
  );
}

export default Login;
