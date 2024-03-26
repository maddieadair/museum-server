const pool = require("../config/db.js");

// ------------------------------------------------ GIFT ITEMS ------------------------------------------------

// GET
const getGiftItems = (req, res) => {
  pool.query("SELECT * FROM gifts", (error, results) => {
    if (error) {
      console.error("Error getting gift items:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Internal server error" }));
    } else {
      console.log("Sending gift items:", results);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(results));
    }
  });
};

// PUT
const addGiftItem = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("Update request body:", data); // Log the request body
      const { gift_name, gift_price, gift_currStock } = data;
      pool.query(
        "INSERT into gifts(gift_name, gift_price, gift_currStock) VALUES(?, ?, ?)",
        [gift_name, gift_price, gift_currStock],
        (error, results) => {
          if (error) {
            console.error("Error adding gift item:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal server error" }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ message: "Gift item added successfully" }),
            );
          }
        },
      );
    } catch (error) {
      console.error("Error parsing request body:", error);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid request body" }));
    }
  });
};

// PUT
const updateGiftItem = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("Update request body:", data); // Log the request body
      const { gift_name, gift_price, gift_index } = data;
      pool.query(
        "UPDATE gifts SET gift_name=?, gift_price=? WHERE gift_index=?",
        [gift_name, gift_price, gift_index],
        (error, results) => {
          if (error) {
            console.error("Error updating gift item:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal server error" }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ message: "Gift item updated successfully" }),
            );
          }
        },
      );
    } catch (error) {
      console.error("Error parsing request body:", error);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid request body" }));
    }
  });
};

// DELETE
const deleteGiftItem = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("DELETE request body:", data);
      const { gift_index } = data;
      pool.query(
        "DELETE from gifts WHERE gift_index=?",
        [gift_index],
        (error, results) => {
          if (error) {
            console.error("Error deleting gift item:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal server error" }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ message: "Gift item deleted successfully" }),
            );
          }
        },
      );
    } catch (error) {
      console.error("Error parsing request body:", error);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid request body" }));
    }
  });
};

module.exports = { getGiftItems, addGiftItem, updateGiftItem, deleteGiftItem };
