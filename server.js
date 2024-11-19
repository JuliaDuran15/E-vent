const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');
const Event = require('./models/Event');
const User = require('./models/User');
const EventParticipants = require('./models/EventParticipants');


// Inicializando o aplicativo
const app = express();
const bcrypt = require('bcrypt');
app.use(cors());
app.use(express.json());

// Sincronizar os modelos com o banco de dados PostgreSQL
sequelize.sync({ force: true })
  .then(() => console.log('Banco de dados sincronizado'))
  .catch(err => console.error('Erro ao sincronizar o banco de dados:', err));

// Rota para criar um evento
app.post('/create-event', async (req, res) => {
  const { name, date, location, participants, organizerId } = req.body;

  try {
    console.log('Dados recebidos:', req.body);

    // Verificar se todos os campos necessários estão presentes
    if (!name || !date || !location || !participants || !organizerId) {
      console.error('Dados inválidos:', req.body);
      return res.status(400).json({ message: 'Dados inválidos. Por favor, preencha todos os campos.' });
    }

    // Criar o evento
    const newEvent = await Event.create({ name, date, location, participants, organizerId });
    console.log('Evento criado:', newEvent);
    res.status(201).json({ message: 'Evento criado com sucesso!' });
  } catch (error) {
    console.error('Erro ao criar o evento:', error);
    res.status(500).json({ message: 'Erro ao criar o evento.', error: error.message });
  }
});


// Rota para listar eventos do organizador
app.get('/my-events/:organizerId', async (req, res) => {
  const { organizerId } = req.params;

  try {
    const events = await Event.findAll({ where: { organizerId } });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar eventos do organizador' });
  }
});


// Rota para registrar um novo cliente
app.post('/register', async (req, res) => {
  console.log(req.body); // Verifica os dados que estão sendo recebidos
  try {
    const newUser = await User.create(req.body);
    res.json({ message: 'Usuário registrado com sucesso!' });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error); // Verifique qualquer erro
    res.status(500).json({ message: 'Erro ao registrar o usuário.' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Encontrar o usuário pelo e-mail
    const user = await User.findOne({ where: { email } });

    // Verificar se o usuário existe
    if (!user) {
      return res.status(400).json({ message: 'Usuário não encontrado.' });
    }

    // Comparar a senha enviada com a senha criptografada no banco de dados
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Senha incorreta.' });
    }
    
    console.log('Dados da resposta:', {
      message: 'Login bem-sucedido!',
      role: user.role,
      name: user.name,
      userId: user.id,
    });

    // Se a senha for correta, faça o login
    res.json({ message: 'Login bem-sucedido!', role: user.role, name: user.name, userId: user.id });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro ao fazer login.' });
  }
});

// Rota para listar todos os eventos
app.get('/events', async (req, res) => {
  try {
    const events = await Event.findAll();
    res.json(events);
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    res.status(500).json({ message: 'Erro ao buscar eventos' });
  }
});


// Rota para inscrever um usuário em um evento
app.post('/join-event', async (req, res) => {
  const { userId, eventId } = req.body;

  try {
    // Verificar se o evento existe
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado.' });
    }

    // Verificar se o usuário já está inscrito no evento
    const existingParticipant = await EventParticipants.findOne({
      where: { userId, eventId },
    });

    if (existingParticipant) {
      return res.status(400).json({ message: 'Você já está inscrito neste evento.' });
    }

    // Inscrever o usuário no evento
    await EventParticipants.create({ userId, eventId });

    // Incrementar o número de participantes no evento
    event.participants += 1;
    await event.save();

    res.json({ message: 'Inscrição realizada com sucesso!' });
  } catch (error) {
    console.error('Erro ao inscrever usuário no evento:', error);
    res.status(500).json({ message: 'Erro ao inscrever usuário no evento.' });
  }
});

// Rota para adicionar cliente VIP a um evento
app.post('/add-vip', async (req, res) => {
  const { eventId, vipEmail } = req.body;

  try {
    const event = await Event.findOne({ where: { id: eventId } });
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado.' });
    }

    // Verifica se a lista VIP existe, se não, cria uma lista vazia
    if (!event.vipList) {
      event.vipList = [];
    }

    // Verifica se o cliente VIP já está na lista
    if (event.vipList.includes(vipEmail)) {
      return res.status(400).json({ message: 'Cliente já é VIP.' });
    }

    // Adiciona o cliente VIP
    event.vipList.push(vipEmail);
    await event.save();

    res.json({ message: 'Cliente VIP adicionado com sucesso.' });
  } catch (error) {
    console.error('Erro ao adicionar cliente VIP:', error);
    res.status(500).json({ message: 'Erro ao adicionar cliente VIP.' });
  }
});


// Rota para listar eventos em que o usuário está inscrito
app.get('/my-events-user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Verificar se o userId foi passado corretamente
    console.log('userId recebido:', userId);

    // Buscar eventos nos quais o usuário está inscrito
    const events = await Event.findAll({
      include: [
        {
          model: EventParticipants,
          where: { userId },
          required: true,
        },
      ],
    });

    // Verificar se os eventos foram encontrados
    console.log('Eventos encontrados:', events);
  } catch (error) {
    console.error('Erro ao buscar eventos do usuário:', error);
    res.status(500).json({ message: 'Erro ao buscar eventos do usuário.' });
  }
});


// Iniciar o servidor
app.listen(5000, () => {
  console.log('Servidor rodando na porta 5000');
});
