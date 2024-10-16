const { Sequelize } = require('sequelize');

// Configurando a conexão com o banco de dados MySQL
const sequelize = new Sequelize('eventManager', 'root', 'admin', {
  host: 'localhost',
  dialect: 'mysql', // Alterado para MySQL
});

sequelize.authenticate()
  .then(() => console.log('Conectado ao MySQL'))
  .catch(err => console.error('Erro ao conectar ao MySQL:', err));

module.exports = sequelize;
