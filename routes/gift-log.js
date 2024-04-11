const http = require("http");
const mysql = require("mysql");
const db = require("../config/db");

// Get all gift transactions
const getGiftTransactions = (req, res) => {
  db.query(
    `SELECT gift_log.*, gifts.gift_name, DATE_FORMAT(transaction_date, "%M %d, %Y") AS New_Date from gift_log, gifts WHERE gift_log.item_ID = gifts.gift_index`,
    (error, result) => {
      if (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: error }));
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      }
    },
  );
};

// Get shop revenue
const getShopRevenue = (req, res) => {
  db.query(
    `SELECT sum(total_bill) AS total_revenue from gift_log`,
    (error, result) => {
      if (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: error }));
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      }
    },
  );
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
          res.end(
            JSON.stringify({ error: error }),
          );
          //res.end(JSON.stringify({ error: error }));
        } else {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ message: "Gift transaction added successfully" }),
          );
        }
      },
    );
  });
};

// Get gift transactions for a customer by ID
const getCustomerGifts = (req, res) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
  
    req.on("end", () => {
      const body = JSON.parse(data);
      const customer_ID = parseInt(body.customer_ID);
  
      db.query(
        `SELECT gift_log.*, gifts.gift_name, DATE_FORMAT(transaction_date, "%M %d, %Y") AS New_Date from gift_log, gifts WHERE gift_log.item_ID = gifts.gift_index AND customer_ID = ?`,
        [customer_ID],
        (error, result) => {
          if (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: error }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(result));
          }
        },
      );
    });
  };

  // Get gift transactions by ID
const getGiftTransactionByID = (req, res) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
  
    req.on("end", () => {
      const body = JSON.parse(data);
      const gift_transactionID = parseInt(body.gift_transactionID);
  
      db.query(
        `SELECT gift_log.*, gifts.gift_name, DATE_FORMAT(transaction_date, "%M %d, %Y") AS New_Date from gift_log, gifts WHERE gift_log.item_ID = gifts.gift_index AND gift_transactionID = ?`,
        [gift_transactionID],
        (error, result) => {
          if (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: error }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(result));
          }
        },
      );
    });
  };

module.exports = {
  getGiftTransactions,
  addGiftTransaction,
  getShopRevenue,
  getCustomerGifts,
  getGiftTransactionByID
};
