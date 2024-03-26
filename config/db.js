require("dotenv").config();
const mysql = require("mysql");

// Database connection setup
const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.SQLUSER,
    password: process.env.PASSWORD,
    database: process.env.DB,
    port: process.env.PORTNUM 
});

module.exports = pool;