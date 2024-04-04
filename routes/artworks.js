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

      if (body["Include_Exhibit"] && body["Include_Exhibit"] === true) {
          sql += ` Exhibit_ID IS NOT NULL`;
          if (body["Exhibit_ID"]) {
            const Exhibit_ID = body.Exhibit_ID;
            params.push(Exhibit_ID);
            if (Array.isArray(body["Exhibit_ID"])) {
              sql += ` AND Exhibit_ID IN (?)`;
            } else {
              sql += ` AND Exhibit_ID = ?`;
            }
        }
      } else {
        sql += ` Exhibit_ID IS NULL`;
      }

      if (body["Culture"]) {
        const Culture = body.Culture;
        params.push(Culture);
        console.log("Culture length", body["Culture"].length);
        if (Array.isArray(body["Culture"])) {
          if (params.length === 0) {
            sql += ` Culture IN (?)`;
          } else {
            sql += ` AND Culture IN (?)`;
          }
        } else {
          if (params.length === 0) {
            sql += ` Culture = ?`;
          } else {
            sql += ` AND Culture = ?`;
          }
        }
      }

      if (body["Collection_ID"]) {
        const Collection_ID = body.Collection_ID;
        params.push(Collection_ID);
        if (Array.isArray(body["Collection_ID"])) {
          if (params.length === 0) {
            sql += ` Collection_ID IN (?)`;
          } else {
            sql += ` AND Collection_ID IN (?)`;
          }
        } else {
          if (params.length === 0) {
            sql += ` Collection_ID = ?`;
          } else {
            sql += ` AND Collection_ID = ?`;
          }
        }
      }

      if (body["Medium"]) {
        const Medium = body.Medium;
        params.push(Medium);
        if (Array.isArray(body["Medium"])) {
          if (params.length === 0) {
            sql += ` Medium IN (?)`;
          } else {
            sql += ` AND Medium IN (?)`;
          }
        } else {
          if (params.length === 0) {
            sql += ` Medium = ?`;
          } else {
            sql += ` AND Medium = ?`;
          }
        }
      }

      if (body["Department_ID"]) {
        const Department_ID = body.Department_ID;
        params.push(Department_ID);
        if (Array.isArray(body["Department_ID"])) {
          if (params.length === 0) {
            sql += ` Department_ID IN (?)`;
          } else {
            sql += ` AND Department_ID IN (?)`;
          }
        } else {
          if (params.length === 0) {
            sql += ` Department_ID = ?`;
          } else {
            sql += ` AND Department_ID = ?`;
          }
        }
      }

      if (body["On_View"]) {
        const On_View = body.On_View;
        if (body["On_View"] === true) {
          params.push(On_View);
          if (params.length === 0) {
            sql += ` On_View = 1`;
          } else {
            sql += ` AND On_View = 1`;
          }
        }
      }
    }

    console.log("sql:", sql);

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
