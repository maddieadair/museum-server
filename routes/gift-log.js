const http = require("http");
const mysql = require("mysql");
const db = require("../config/db");

// Get all gift transactions
const getGiftTransactions = (req, res) => {
  db.query(`SELECT gift_log.*, gifts.gift_name, DATE_FORMAT(transaction_date, "%M %d, %Y") AS New_Date from gift_log, gifts WHERE gift_log.item_ID = gifts.gift_index`, (error, result) => {
    if (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error }));
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result));
    }
  });
};

// Add Gift Transaction
const addGiftTransaction = (req, res) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
  
    req.on("end", () => {
      const body = JSON.parse(data);
      const item_ID = parseInt(body.item_ID);
      const customer_ID = parseInt(body.customer_ID);
      const total_bill = parseInt(body.total_bill);
      const transaction_quantity = parseInt(body.transaction_quantity);

      db.query(
        "INSERT INTO gift_log(item_ID, customer_ID, total_bill, transaction_quantity) VALUES (?, ?, ?, ?);",
        [item_ID, customer_ID, total_bill, transaction_quantity],
        (error, result) => {
          if (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: 'Error adding the gift transaction' }));
            //res.end(JSON.stringify({ error: error }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: 'Gift transaction added successfully' }));
        }
        }
      );
    });
  };

module.exports = {
    getGiftTransactions,
    addGiftTransaction,
};
