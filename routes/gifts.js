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

// Get number of items sold in descending order
const getNumSoldDesc = (req, res) => {
  db.query(
    `SELECT gifts.gift_index, gifts.gift_name, gifts.gift_numSold FROM gifts ORDER BY gifts.gift_numSold DESC;`,
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

// Get all items that are sold out
const getSoldOut = (req, res) => {
  db.query(`SELECT * from gifts WHERE soldout_status = 1;`, (error, result) => {
    if (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error }));
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result));
    }
  });
};

// Get all items that are low in stock
const getLowStock = (req, res) => {
  db.query(
    `SELECT * from gifts where low_stock_flag = 1 AND soldout_status = 0;`,
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

// Get worstsellers
const getWorstsellers = (req, res) => {
    db.query(
      `SELECT * from gifts WHERE gift_numSold = 0;`,
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

// Get top three bestsellers
const getBestsellers = (req, res) => {
  db.query(
    `SELECT gifts.gift_index, gifts.gift_name, gifts.gift_numSold FROM gifts, gift_log GROUP BY gifts.gift_index ORDER BY gifts.gift_numSold DESC LIMIT 3;;`,
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

// Add Gift
const addGift = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    const gift_name = body.gift_name;
    const gift_price = parseInt(body.gift_price);
    const gift_currStock = parseInt(body.gift_currStock);

    db.query(
      "INSERT INTO gifts(gift_name, gift_price, gift_currStock) VALUES (?, ?, ?);",
      [gift_name, gift_price, gift_currStock],
      (error, result) => {
        if (error) {
          console.log(error);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: error }));
          //res.end(JSON.stringify({ error: error }));
        } else {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Gift item added successfully" }));
        }
      },
    );
  });
};

// Update Gift
const updateGift = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    const gift_index = parseInt(body.gift_index);
    const gift_name = body.gift_name;
    const gift_price = parseInt(body.gift_price);
    const gift_currStock = parseInt(body.gift_currStock);

    db.query(
      "UPDATE gifts SET gift_name = ?, gift_price = ?, gift_currStock = ? WHERE gift_index = ?",
      [gift_name, gift_price, gift_currStock, gift_index],
      (error, result) => {
        if (error) {
          console.log(error);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Error updating the gift item" }));
          //res.end(JSON.stringify({ error: error }));
        } else {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ message: "Gift item updated successfully" }),
          );
        }
      },
    );
  });
};

// Delete Gift
const deleteGift = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    const gift_index = parseInt(body.gift_index);

    db.query(
      "DELETE from gifts WHERE gift_index = ?",
      [gift_index],
      (error, result) => {
        if (error) {
          console.log(error);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Error deleting the gift item" }));
          //res.end(JSON.stringify({ error: error }));
        } else {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ message: "Gift item deleted successfully" }),
          );
        }
      },
    );
  });
};


module.exports = {
  getGifts,
  addGift,
  updateGift,
  deleteGift,
  getBestsellers,
  getNumSoldDesc,
  getSoldOut,
  getLowStock,
  getWorstsellers,
};
