require('dotenv').config();
const todoListDB = require('mysql2/promise');

const isVercel = process.env.NODE_ENV === 'production';
const pool = todoListDB.createPool({
  host: isVercel ? process.env.DB_HOST : process.env.DB_HOST_LOCAL,
  port: isVercel ? process.env.DB_PORT : process.env.DB_PORT_LOCAL,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

module.exports = pool;