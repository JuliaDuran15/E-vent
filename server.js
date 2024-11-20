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
    res.status(201).json({ message: 'Evento criado com sucesso.' });
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

app.post('/register', async (req, res) => {
  const { email } = req.body;

  try {
    // Verifica se o email já está registrado
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: 'E-mail já está em uso. Por favor, use outro.' });
    }

    // Cria um novo usuário se o email não estiver registrado
    const newUser = await User.create(req.body);
    res.json({ message: 'Usuário registrado com sucesso!' });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
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
    const events = await Event.findAll({
      include: [
        {
          model: EventParticipants,
          attributes: ['userId'], // Somente o ID dos participantes
        },
      ],
    });

    // Formate os eventos para incluir `participantsList`
    const formattedEvents = events.map((event) => ({
      ...event.toJSON(),
      participantsList: event.EventParticipants.map((participant) => participant.userId),
    }));

    res.json(formattedEvents);
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    res.status(500).json({ message: 'Erro ao buscar eventos' });
  }
});

app.post('/join-event', async (req, res) => {
  const { userId, eventId } = req.body;

  if (!userId || !eventId) {
    return res.status(400).json({ message: 'Dados incompletos. Envie userId e eventId.' });
  }

  try {
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado.' });
    }

    // Verifica se o evento já atingiu o limite de participantes
    if (event.currentParticipants >= event.participants) {
      return res.status(400).json({ message: 'O evento já atingiu o limite de participantes.' });
    }

    const existingParticipant = await EventParticipants.findOne({
      where: { userId, eventId },
    });

    if (existingParticipant) {
      return res.status(400).json({ message: 'Você já está inscrito neste evento.' });
    }

    // Iniciar transação para evitar inconsistências
    const result = await sequelize.transaction(async (t) => {
      // Criar registro de inscrição
      await EventParticipants.create({ userId, eventId }, { transaction: t });

      // Incrementar o número de participantes atualmente inscritos
      event.currentParticipants += 1;
      await event.save({ transaction: t });

      return event; // Retorna o evento atualizado
    });

    res.json({
      message: 'Inscrição realizada com sucesso!',
      event: {
        id: result.id,
        name: result.name,
        date: result.date,
        location: result.location,
        currentParticipants: result.currentParticipants,
        maxParticipants: result.participants,
      },
    });
  } catch (error) {
    console.error('Erro ao inscrever usuário no evento:', error);
    res.status(500).json({ message: 'Erro ao inscrever usuário no evento.' });
  }
});



app.get('/event-participants/:eventId', async (req, res) => {
  const { eventId } = req.params;

  try {
    // Verificar se o evento existe
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado.' });
    }

    // Buscar participantes com informações do usuário
    const participants = await EventParticipants.findAll({
      where: { eventId },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email'], // Informações relevantes do usuário
        },
      ],
    });

    // Formatar resposta
    const participantList = participants.map((p) => ({
      userId: p.User.id,
      name: p.User.name,
      email: p.User.email,
      isVip: p.isVip || false, // Status VIP
    }));

    res.json(participantList);
  } catch (error) {
    console.error('Erro ao buscar participantes do evento:', error);
    res.status(500).json({ message: 'Erro ao buscar participantes do evento.' });
  }
});


// Rota para atualizar o status VIP de um participante
app.post('/update-vip-status', async (req, res) => {
  const { userId, eventId, isVip } = req.body;

  if (!userId || !eventId || typeof isVip !== 'boolean') {
    return res.status(400).json({ message: 'Dados incompletos. Envie userId, eventId e isVip.' });
  }

  try {
    // Verificar se o registro de participação existe
    const participant = await EventParticipants.findOne({
      where: { userId, eventId },
    });

    if (!participant) {
      return res.status(404).json({ message: 'Participante não encontrado no evento.' });
    }

    // Atualizar o status VIP
    participant.isVip = isVip;
    await participant.save();

    res.json({ message: 'Status VIP atualizado com sucesso.', userId, eventId, isVip });
  } catch (error) {
    console.error('Erro ao atualizar status VIP:', error);
    res.status(500).json({ message: 'Erro ao atualizar status VIP.' });
  }
});

app.get('/event-participants/:eventId', async (req, res) => {
  const { eventId } = req.params;

  try {
    const participants = await EventParticipants.findAll({
      where: { eventId },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    const formattedParticipants = participants.map((participant) => ({
      userId: participant.User.id,
      name: participant.User.name,
      email: participant.User.email,
      isVip: participant.isVip,
    }));

    res.json(formattedParticipants);
  } catch (error) {
    console.error('Erro ao buscar participantes do evento:', error);
    res.status(500).json({ message: 'Erro ao buscar participantes do evento.' });
  }
});


app.get('/my-events-user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const events = await Event.findAll({
      include: [
        {
          model: EventParticipants,
          where: { userId },
          required: true,
          attributes: ['isVip'], // Inclui o status VIP
        },
      ],
      attributes: ['id', 'name', 'date', 'location', 'currentParticipants', 'participants', 'status'], // Campos do evento
    });

    // Formatar a resposta para incluir os dados necessários
    const formattedEvents = events.map((event) => ({
      id: event.id,
      name: event.name,
      date: event.date,
      location: event.location,
      currentParticipants: event.currentParticipants,
      participants: event.participants,
      status: event.status,
      isVip: event.EventParticipants[0].isVip, // Inclui o status VIP
    }));

    res.json(formattedEvents);
  } catch (error) {
    console.error('Erro ao buscar eventos do usuário:', error);
    res.status(500).json({ message: 'Erro ao buscar eventos do usuário.' });
  }
});


// Rota para cancelar (marcar como cancelado) um evento
app.put('/cancel-event/:eventId', async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado.' });
    }

    // Atualizar o status do evento para "cancelado"
    event.status = 'cancelado'; // Adicione uma coluna "status" no modelo, se necessário
    await event.save();

    res.status(200).json({ message: 'Evento marcado como cancelado.' });
  } catch (error) {
    console.error('Erro ao cancelar evento:', error);
    res.status(500).json({ message: 'Erro ao cancelar evento.' });
  }
});

// Rota para apagar (excluir) definitivamente um evento
app.delete('/delete-event/:eventId', async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado.' });
    }

    await Event.destroy({ where: { id: eventId } });
    res.status(200).json({ message: 'Evento apagado com sucesso.' });
  } catch (error) {
    console.error('Erro ao apagar evento:', error);
    res.status(500).json({ message: 'Erro ao apagar evento.' });
  }
});



// Iniciar o servidor
app.listen(5000, () => {
  console.log('Servidor rodando na porta 5000');
});
