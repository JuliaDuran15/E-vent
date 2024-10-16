const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt'); // Importa o bcrypt


const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1, // 1 = Cliente, 2 = Organizador
  },
}, {
  hooks: {
    beforeSave: async (user) => {
      console.log("Criptografando senha antes de salvar usuário...");
      if (user.changed('password')) { // Apenas criptografa se a senha foi alterada
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

module.exports = User;
