import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './components/AuthContext'; // Importa o AuthProvider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

// Se quiser começar a medir o desempenho da sua aplicação, passe uma função para logar resultados 
// (por exemplo: reportWebVitals(console.log)) ou envie para um endpoint de análise.
// Saiba mais em: https://bit.ly/CRA-vitals
reportWebVitals();
