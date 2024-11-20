const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Event = require('./Event');

const EventParticipants = sequelize.define('EventParticipants', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  eventId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Event,
      key: 'id',
    },
  },
  isVip: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // Não VIP por padrão
  },
}, {
  timestamps: false,
});

// Definir associações para os relacionamentos
User.hasMany(EventParticipants, { foreignKey: 'userId' });
EventParticipants.belongsTo(User, { foreignKey: 'userId' });

Event.hasMany(EventParticipants, { foreignKey: 'eventId' });
EventParticipants.belongsTo(Event, { foreignKey: 'eventId' });

module.exports = EventParticipants;
