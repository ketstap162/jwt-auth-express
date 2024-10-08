const { Sequelize, DataTypes } = require('sequelize');

// const sequelize = new Sequelize({
//     dialect: 'sqlite',
//     storage:  './db.sqlite3',
//     logging: false,
//   });

const sequelize = new Sequelize(process.env.POSTGRES_DB, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  dialect: 'postgres',
  logging: false,
});

sequelize.sync({ alter: true })
.then(() => console.log('Database synced'))
.catch(err => console.error('Error syncing database', err));

const User = require('./user')(sequelize, DataTypes);

module.exports = {User, sequelize};
