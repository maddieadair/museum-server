const mysql = require("mysql");

// Connect To Database
const db = mysql.createConnection({
    user: process.env.USER,
    host: process.env.HOST,
    password: process.env.PASSWORD,
    database: process.env.DB,
});

module.exports = db;