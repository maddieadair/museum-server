const http = require("http");
const mysql = require("mysql");
const db = require("../config/db");

// Get all gifts
const getGifts = (req, res) => {
  db.query(`SELECT * from gifts`, (error, result) => {
    if (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error }));
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result));
    }
  });
};

module.exports = {
  getGifts,
};
