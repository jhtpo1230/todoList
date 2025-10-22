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
console.log('✅ NODE_ENV:', process.env.NODE_ENV);
console.log('✅ DB_HOST_CT:', process.env.DB_HOST_CT);
console.log('✅ DB_PORT_CT:', process.env.DB_PORT_CT);