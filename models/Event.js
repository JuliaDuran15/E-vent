const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Event = sequelize.define('Event', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  participants: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0, // Número máximo de participantes
  },
  currentParticipants: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0, // Número de participantes atualmente inscritos
  },
  organizerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'ativo', // Estado inicial: ativo
    validate: {
      isIn: [['ativo', 'cancelado']], // Apenas aceita esses valores
    },
  },
});

module.exports = Event;
