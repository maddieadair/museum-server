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
    },
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
      },
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
      },
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
      },
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
      },
    );
  });
};

// Get all filtered artworks
const getFilteredArt = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);

    let params = [];
    let sql = `SELECT Art_ID, Art_Name, YEAR(Date_Created) AS Year_Created, Artist_Fname, Artist_Lname FROM artworks`;

    console.log("body", body);
    if (Object.keys(body).length !== 0) {
      sql += ` WHERE`;
      if (body["Culture"]) {
        const Culture = body.Culture;
        params.push(Culture);
        sql += ` Culture IN (?)`;
      }

      if (body["Collection_ID"]) {
        const Collection_ID = body.Collection_ID;
        params.push(Collection_ID);
        sql += ` Collection_ID IN (?)`;
      }

      if (body["Exhibit_ID"]) {
        const Exhibit_ID = body.Exhibit_ID;
        params.push(Exhibit_ID);
        sql += ` Exhibit_ID IN (?)`;
      }

      if (body["Department_ID"]) {
        const Department_ID = body.Department_ID;
        params.push(Department_ID);
        sql += ` Department_ID IN (?)`;
      }
    }

    db.query(sql, params, (error, result) => {
      if (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: error }));
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      }
    });
  });
};

module.exports = {
  getArtworks,
  collectionArtworks,
  exhibitionArtworks,
  departmentArtworks,
  artworkByID,
  getFilteredArt,
};
