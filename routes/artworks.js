const http = require("http");
const mysql = require("mysql");
const db = require("../config/db");

// Get all artworks
const getArtworks = (req, res) => {
  db.query(
    `SELECT artworks.*, YEAR(Date_Acquired) AS Year_Acquired, YEAR(Date_Created) AS Year_Created, department.department_name, exhibitions.Exhibit_Name, collections.collection_name FROM artworks 
  LEFT JOIN department ON artworks.Department_ID = department.department_id 
  LEFT JOIN collections ON artworks.Collection_ID = collections.collection_id
  LEFT JOIN exhibitions ON artworks.Exhibit_ID = exhibitions.Exhibit_ID;
  `,
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
      `SELECT artworks.*, YEAR(Date_Acquired) AS Year_Acquired, YEAR(Date_Created) AS Year_Created, department.department_name, exhibitions.Exhibit_Name, collections.collection_name FROM artworks 
      LEFT JOIN department ON artworks.Department_ID = department.department_id 
      LEFT JOIN collections ON artworks.Collection_ID = collections.collection_id
      LEFT JOIN exhibitions ON artworks.Exhibit_ID = exhibitions.Exhibit_ID
      WHERE artworks.Collection_ID=?;`,
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
      `SELECT artworks.*, YEAR(Date_Acquired) AS Year_Acquired, YEAR(Date_Created) AS Year_Created, department.department_name, exhibitions.Exhibit_Name, collections.collection_name FROM artworks 
      LEFT JOIN department ON artworks.Department_ID = department.department_id 
      LEFT JOIN collections ON artworks.Collection_ID = collections.collection_id
      LEFT JOIN exhibitions ON artworks.Exhibit_ID = exhibitions.Exhibit_ID
      WHERE artworks.Art_ID = ?;`,
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
`SELECT artworks.*, YEAR(Date_Acquired) AS Year_Acquired, YEAR(Date_Created) AS Year_Created, department.department_name, exhibitions.Exhibit_Name, collections.collection_name FROM artworks 
LEFT JOIN department ON artworks.Department_ID = department.department_id 
LEFT JOIN collections ON artworks.Collection_ID = collections.collection_id
LEFT JOIN exhibitions ON artworks.Exhibit_ID = exhibitions.Exhibit_ID
WHERE artworks.Exhibit_ID = ?;`,
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
`SELECT artworks.*, YEAR(Date_Acquired) AS Year_Acquired, YEAR(Date_Created) AS Year_Created, department.department_name, exhibitions.Exhibit_Name, collections.collection_name FROM artworks 
LEFT JOIN department ON artworks.Department_ID = department.department_id 
LEFT JOIN collections ON artworks.Collection_ID = collections.collection_id
LEFT JOIN exhibitions ON artworks.Exhibit_ID = exhibitions.Exhibit_ID
WHERE artworks.Department_ID = ?;`,
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
