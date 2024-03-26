const pool = require("../config/db.js");

// ------------------------------------------------ GIFT LOG ------------------------------------------------

// GET
const getGiftLog = (req, res) => {
  pool.query("SELECT * from gift_log", (error, results) => {
    if (error) {
      console.error("Error getting gift log:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Internal server error" }));
    } else {
      console.log("Sending gift log:", results);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(results));
    }
  });
};

// EVERYTHING BELOW HERE IS NOT DONE

// GET
const getUserGifts = (req, res) => {
  console.log("getUserGifts");
};

// PUT
const updateGiftLog = (req, res) => {
  console.log("updateGiftLog");
};

// POST
const addGiftTransaction = (req, res) => {
  console.log("addGiftTransaction");
};

// DELETE
const deleteGiftTransaction = (req, res) => {
  console.log("deleteGiftTransaction");
};

module.exports = {
  getGiftLog,
  updateGiftLog,
  addGiftTransaction,
  deleteGiftTransaction,
  getUserGifts,
};
