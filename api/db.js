'use strict';
const mysql = require('mysql');

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "everfit",
  password: process.env.DB_PASSWORD || "everfit",
  database: process.env.DB_NAME || "everfit"
});

module.exports = db