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
    defaultValue: 0, // Define o valor inicial como 0

  },
  organizerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Event;
