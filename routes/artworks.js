const http = require("http");
const mysql = require("mysql");
const db = require("../config/db");

// Get all artworks
const getArtworks = (req, res) => {
  db.query(`SELECT *, YEAR(Date_Acquired) AS Year_Acquired, YEAR(Date_Created) AS Year_Created FROM artworks`, (error, result) => {
    if (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error }));
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result));
    }
  });
};

// Get all artworks in a collection
const collectionArtworks = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    const Collection_ID = parseInt(body.Collection_ID);

    db.query(
      "SELECT *, YEAR(Date_Acquired) AS Year_Acquired, YEAR(Date_Created) AS Year_Created FROM artworks WHERE Collection_ID = ?",
      [Collection_ID],
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

// Get artwork by ID
const artworkByID = (req, res) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
  
    req.on("end", () => {
      const body = JSON.parse(data);
      const Art_ID = parseInt(body.Art_ID);
  
      db.query(
        "SELECT artworks.*, YEAR(Date_Acquired) AS Year_Acquired, YEAR(Date_Created) AS Year_Created, department.department_name FROM artworks, department WHERE Art_ID = ? AND artworks.Department_ID = department.department_id",
        [Art_ID],
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

// Get all artworks in an exhibition
const exhibitionArtworks = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    const Exhibit_ID = parseInt(body.Exhibit_ID);

    db.query(
      "SELECT *, YEAR(Date_Acquired) AS Year_Acquired, YEAR(Date_Created) AS Year_Created FROM artworks WHERE Exhibit_ID = ?",
      [Exhibit_ID],
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

// Get all artworks in a department
const departmentArtworks = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    const Department_ID = parseInt(body.Department_ID);

    db.query(
      "SELECT *, YEAR(Date_Acquired) AS Year_Acquired, YEAR(Date_Created) AS Year_Created FROM artworks WHERE Department_ID = ?",
      [Department_ID],
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
  getArtworks,
  collectionArtworks,
  exhibitionArtworks,
  departmentArtworks,
  artworkByID,
};
