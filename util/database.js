const Sequelize = require('sequelize');
const sequelize = new Sequelize('node-complete', 'root', 'viku8300', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;