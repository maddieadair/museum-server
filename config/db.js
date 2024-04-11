const mysql = require("mysql");

// Connect To Database
const db = mysql.createPool({
    host: "mysql-museum.mysql.database.azure.com",
    user: "admin01",
    password: "bananafish1!",
    database: "museum",
    port: "3306",
});

module.exports = db;