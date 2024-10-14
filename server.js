const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');
const Event = require('./models/Event');
const User = require('./models/User');

// Inicializando o aplicativo
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Sincronizar os modelos com o banco de dados PostgreSQL
sequelize.sync({ force: true })
  .then(() => console.log('Banco de dados sincronizado'))
  .catch(err => console.error('Erro ao sincronizar o banco de dados:', err));

// Rota para criar um evento
app.post('/create-event', async (req, res) => {
  const { name, date, location, participants } = req.body;
  
  try {
    const newEvent = await Event.create({ name, date, location, participants });
    res.status(201).json({ message: 'Evento criado com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar o evento', error });
  }
});

// Rota para registrar um novo cliente
app.post('/register', async (req, res) => {
    console.log(req.body); // Adiciona isso para ver os dados que estão sendo enviados
    try {
      const newUser = await User.create(req.body);
      res.json({ message: 'Usuário registrado com sucesso!' });
    } catch (error) {
      console.error('Erro ao registrar usuário:', error); // Verifique qualquer erro
      res.status(500).json({ message: 'Erro ao registrar o usuário.' });
    }
  });
// Iniciar o servidor
app.listen(5000, () => {
  console.log('Servidor rodando na porta 5000');
});
