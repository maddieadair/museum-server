const http = require("http");
const mysql = require("mysql");
const db = require("../config/db");

// Get all collections
const getCollections = (req, res) => {
  db.query(`SELECT * from collections`, (error, result) => {
    if (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error }));
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result));
    }
  });
};

// Get all collections in a department
const departmentCollections = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    const collection_departmentID = body.collection_departmentID;

    db.query(
      "SELECT * FROM collections WHERE collection_departmentID = ?",
      [collection_departmentID],
      (error, result) => {
        if (error) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: error }));
        } else {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(result));
        }
      }
    );
  });
};


// Get Collection by ID
const getCollectionByID = (req, res) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
  
    req.on("end", () => {
      const body = JSON.parse(data);
      const collection_id = parseInt(body.collection_id);
  
      db.query(
        "SELECT * FROM collections WHERE collection_id = ?",
        [collection_id],
        (error, result) => {
          if (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: error }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(result));
          }
        }
      );
    });
  };

module.exports = {
  getCollections,
  departmentCollections,
  getCollectionByID,
};
