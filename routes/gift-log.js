const http = require("http");
const mysql = require("mysql");
const db = require("../config/db");

// Get all gift transactions
const getGiftTransactions = (req, res) => {
  db.query(`SELECT gift_log.*, gifts.gift_name from gift_log, gifts WHERE gift_log.item_ID = gifts.gift_index`, (error, result) => {
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
    getGiftTransactions,
};
