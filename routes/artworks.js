const http = require("http");
const mysql = require("mysql");
const db = require("../config/db");

// Get all artworks
const getArtworks = (req, res) => {
  db.query(
    `SELECT artworks.*, DATE_FORMAT(Date_Created, "%Y-%m-%d") AS New_CreatDate, DATE_FORMAT(Date_Acquired, "%Y-%m-%d") AS New_AcqDate, YEAR(Date_Acquired) AS Year_Acquired, YEAR(Date_Created) AS Year_Created, department.department_name, exhibitions.Exhibit_Name, collections.collection_name FROM artworks 
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

const getPastArtworks = (req, res) => {
  db.query(
    `SELECT artworks.*, DATE_FORMAT(Date_Created, "%Y-%m-%d") AS New_CreatDate, DATE_FORMAT(Date_Acquired, "%Y-%m-%d") AS New_AcqDate, YEAR(Date_Acquired) AS Year_Acquired, YEAR(Date_Created) AS Year_Created, department.department_name, exhibitions.Exhibit_Name, collections.collection_name FROM artworks 
      LEFT JOIN department ON artworks.Department_ID = department.department_id 
      LEFT JOIN collections ON artworks.Collection_ID = collections.collection_id
      LEFT JOIN exhibitions ON artworks.Exhibit_ID = exhibitions.Exhibit_ID WHERE artworks.Archived = 1;
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
      `SELECT artworks.*, DATE_FORMAT(Date_Created, "%Y-%m-%d") AS New_CreatDate, DATE_FORMAT(Date_Acquired, "%Y-%m-%d") AS New_AcqDate, YEAR(Date_Acquired) AS Year_Acquired, YEAR(Date_Created) AS Year_Created, department.department_name, exhibitions.Exhibit_Name, collections.collection_name FROM artworks 
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
      `SELECT artworks.*, DATE_FORMAT(Date_Created, "%Y-%m-%d") AS New_CreatDate, DATE_FORMAT(Date_Acquired, "%Y-%m-%d") AS New_AcqDate, YEAR(Date_Acquired) AS Year_Acquired, YEAR(Date_Created) AS Year_Created, department.department_name, exhibitions.Exhibit_Name, collections.collection_name FROM artworks 
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
      `SELECT artworks.*, DATE_FORMAT(Date_Created, "%Y-%m-%d") AS New_CreatDate, DATE_FORMAT(Date_Acquired, "%Y-%m-%d") AS New_AcqDate, YEAR(Date_Acquired) AS Year_Acquired, YEAR(Date_Created) AS Year_Created, department.department_name, exhibitions.Exhibit_Name, collections.collection_name FROM artworks 
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

    console.log("body", body)

    db.query(
      `SELECT artworks.*, DATE_FORMAT(Date_Created, "%Y-%m-%d") AS New_CreatDate, DATE_FORMAT(Date_Acquired, "%Y-%m-%d") AS New_AcqDate, YEAR(Date_Acquired) AS Year_Acquired, YEAR(Date_Created) AS Year_Created, department.department_name, exhibitions.Exhibit_Name, collections.collection_name FROM artworks 
LEFT JOIN department ON artworks.Department_ID = department.department_id 
LEFT JOIN collections ON artworks.Collection_ID = collections.collection_id
LEFT JOIN exhibitions ON artworks.Exhibit_ID = exhibitions.Exhibit_ID
WHERE artworks.Department_ID = (?);`,
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

// Get all artworks in a department based on department name
const artworksInDep = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    const department_name = body.department_name;

    db.query(
      `SELECT artworks.*, DATE_FORMAT(Date_Created, "%Y-%m-%d") AS New_CreatDate, DATE_FORMAT(Date_Acquired, "%Y-%m-%d") AS New_AcqDate, YEAR(Date_Acquired) AS Year_Acquired, YEAR(Date_Created) AS Year_Created, department.department_name, exhibitions.Exhibit_Name, collections.collection_name FROM artworks 
        LEFT JOIN department ON artworks.Department_ID = department.department_id 
        LEFT JOIN collections ON artworks.Collection_ID = collections.collection_id
        LEFT JOIN exhibitions ON artworks.Exhibit_ID = exhibitions.Exhibit_ID
        WHERE artworks.Department_ID = (SELECT department_id from department WHERE department_name = ?);`,
      [department_name],
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
    let sql = `SELECT artworks.Art_ID, artworks.Art_Name, artworks.Culture, artworks.Medium, artworks.Collection_ID, artworks.Exhibit_ID, artworks.Department_ID, artworks.Artist_Fname, artworks.Artist_Lname, artworks.On_View, YEAR(Date_Acquired) AS Year_Acquired, YEAR(Date_Created) AS Year_Created, department.department_name, exhibitions.Exhibit_Name, collections.collection_name FROM artworks 
    LEFT JOIN department ON artworks.Department_ID = department.department_id 
    LEFT JOIN collections ON artworks.Collection_ID = collections.collection_id
    LEFT JOIN exhibitions ON artworks.Exhibit_ID = exhibitions.Exhibit_ID`;

    console.log("body", body);
    if (Object.keys(body).length !== 0) {
      sql += ` WHERE`;

      if (body["Include_Exhibit"] && body["Include_Exhibit"] === true) {
        sql += ` artworks.Exhibit_ID IS NOT NULL`;
        if (body["Exhibit_ID"]) {
          const Exhibit_ID = body.Exhibit_ID;
          params.push(Exhibit_ID);
          if (Array.isArray(body["Exhibit_ID"])) {
            sql += ` AND artworks.Exhibit_ID IN (?)`;
          } else {
            sql += ` AND artworks.Exhibit_ID = ?`;
          }
        }
      } else {
        sql += ` artworks.Exhibit_ID IS NULL`;
      }

      if (body["Culture"]) {
        const Culture = body.Culture;
        params.push(Culture);
        console.log("Culture length", body["Culture"].length);
        if (Array.isArray(body["Culture"])) {
          if (params.length === 0) {
            sql += ` artworks.Culture IN (?)`;
          } else {
            sql += ` AND artworks.Culture IN (?)`;
          }
        } else {
          if (params.length === 0) {
            sql += ` artworks.Culture = ?`;
          } else {
            sql += ` AND artworks.Culture = ?`;
          }
        }
      }

      if (body["Collection_ID"]) {
        const Collection_ID = body.Collection_ID;
        params.push(Collection_ID);
        if (Array.isArray(body["Collection_ID"])) {
          if (params.length === 0) {
            sql += ` artworks.Collection_ID IN (?)`;
          } else {
            sql += ` AND artworks.Collection_ID IN (?)`;
          }
        } else {
          if (params.length === 0) {
            sql += ` artworks.Collection_ID = ?`;
          } else {
            sql += ` AND artworks.Collection_ID = ?`;
          }
        }
      }

      if (body["Medium"]) {
        const Medium = body.Medium;
        params.push(Medium);
        if (Array.isArray(body["Medium"])) {
          if (params.length === 0) {
            sql += ` artworks.Medium IN (?)`;
          } else {
            sql += ` AND artworks.Medium IN (?)`;
          }
        } else {
          if (params.length === 0) {
            sql += ` artworks.Medium = ?`;
          } else {
            sql += ` AND artworks.Medium = ?`;
          }
        }
      }

      if (body["Department_ID"]) {
        const Department_ID = body.Department_ID;
        params.push(Department_ID);
        if (Array.isArray(body["Department_ID"])) {
          if (params.length === 0) {
            sql += ` artworks.Department_ID IN (?)`;
          } else {
            sql += ` AND artworks.Department_ID IN (?)`;
          }
        } else {
          if (params.length === 0) {
            sql += ` artworks.Department_ID = ?`;
          } else {
            sql += ` AND artworks.Department_ID = ?`;
          }
        }
      }

      if (body["On_View"]) {
        const On_View = body.On_View;
        if (body["On_View"] === true) {
          params.push(On_View);
          if (params.length === 0) {
            sql += ` artworks.On_View = 1`;
          } else {
            sql += ` AND artworks.On_View = 1`;
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

// Get all artworks in an exhibition
const employeeArtworks = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    const Curator_ID = parseInt(body.Curator_ID);

    db.query(
      `SELECT artworks.*, department.department_name, DATE_FORMAT(Date_Created, "%Y-%m-%d") AS New_CreatDate, DATE_FORMAT(Date_Acquired, "%Y-%m-%d") AS New_AcqDate, YEAR(Date_Acquired) AS Year_Acquired, YEAR(Date_Created) AS Year_Created, collections.collection_name, exhibitions.Exhibit_Name FROM artworks LEFT JOIN collections on artworks.Collection_ID = collections.collection_id LEFT JOIN exhibitions on artworks.Exhibit_ID = exhibitions.Exhibit_ID LEFT JOIN department on artworks.Department_ID = department.department_id WHERE ((artworks.Collection_ID IN (SELECT collections.collection_id from collections WHERE collections.collection_curator_ID = (?)) OR (artworks.Exhibit_ID IN (SELECT exhibitions.Exhibit_ID from exhibitions WHERE exhibitions.Curator_ID = (?)))));`,
      [Curator_ID, Curator_ID],
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

// Update artwork
const updateArt = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    console.log(body)
    const Art_Name = body.Art_Name;
    const Descr = body.Descr !== "" ? body.Descr : null;
    const Date_Created = body.Date_Created !== "" ? body.Date_Created : null;
    const Culture = body.Culture !== "" ? body.Culture : null;
    const Length = body.Length !== "" ? parseFloat(body.Length) : null;
    const Width = body.Width !== "" ? parseFloat(body.Width) : null;
    const Height = body.Height !== "" ? parseFloat(body.Height) : null;
    const Medium = body.Medium !== "" ? body.Medium : null;
    let Being_Refurbished =
      body.Being_Refurbished !== "" ? body.Being_Refurbished : null;
    const Artist_Fname = body.Artist_Fname !== "" ? body.Artist_Fname : null;
    const Artist_Lname = body.Artist_Lname !== "" ? body.Artist_Lname : null;
    let On_View = body.On_View;
    const Art_ID = parseInt(body.Art_ID);

    if (On_View === true) {
      On_View = 1;
    } else {
      On_View = 0;
    }

    if ((Being_Refurbished === true)) {
      Being_Refurbished = 1;
    } else {
      Being_Refurbished = 0;
    }

    db.query(
      `UPDATE artworks SET Art_Name=?, Descr=?, Date_Created=?, Culture=?, Length=?, Width=?, Height=?, Medium=?, Being_Refurbished=?, Artist_Fname=?, Artist_Lname=?, On_View=? WHERE Art_ID=?;`,
      [
        Art_Name,
        Descr,
        Date_Created,
        Culture,
        Length,
        Width,
        Height,
        Medium,
        Being_Refurbished,
        Artist_Fname,
        Artist_Lname,
        On_View,
        Art_ID,
      ],
      (error) => {
        if (error) {
            console.log(error)
            if (error.sqlMessage === "Item cannot be created after today.") {
                // console.log(error);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({
                    message: "Item cannot be created after today.",
                  }),
                );
              } else if (error.sqlMessage === "Item cannot be newer than the exhibition it is in.") {
                // console.log(error);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({
                    message: "Item cannot be newer than the exhibition it is in.",
                  }),
                );
              } else if (error.sqlMessage === "Item cannot be added to an ongoing exhibition.") {
                // console.log(error);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({
                    message: "Item cannot be added to an ongoing exhibition.",
                  }),
                );
              } else {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({
                    error: error,
                  }),
                );
              }
        } else {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Artwork updated successfully!" }));
        }
      },
    );
  });
};

// delete artwork
const deleteArt = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    const Art_ID = parseInt(body.Art_ID);

    db.query(
      `DELETE from artworks WHERE Art_ID = ?;`,
      [Art_ID],
      (error, result) => {
        if (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: error }));
        } else {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Artwork deleted successfully" }));
        }
      },
    );
  });
};

// add artwork
const addArt = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    console.log(body);
    const Art_Name = body.Art_Name;
    const Descr = body.Descr !== "" ? body.Descr : null;
    const Date_Acquired = body.Date_Acquired;
    const Date_Created = body.Date_Created !== "" ? body.Date_Created : null;
    const Culture = body.Culture !== "" ? body.Culture : null;
    const Length = body.Length !== "" ? parseFloat(body.Length) : null;
    const Width = body.Width !== "" ? parseFloat(body.Width) : null;
    const Height = body.Height !== "" ? parseFloat(body.Height) : null;
    const Medium = body.Medium !== "" ? body.Medium : null;
    let Being_Refurbished = body.Being_Refurbished;
    const Collection_ID = body.Collection_ID !== "" ? body.Collection_ID : null;
    const Exhibit_ID =
      body.Exhibit_ID !== "" ? parseInt(body.Exhibit_ID) : null;
    const Department_ID =
      body.Department_ID !== "" ? parseInt(body.Department_ID) : null;
    const Artist_Fname = body.Artist_Fname !== "" ? body.Artist_Fname : null;
    const Artist_Lname = body.Artist_Lname !== "" ? body.Artist_Lname : null;
    let On_View = body.On_View;

    if (On_View === true) {
      On_View = 1;
    } else {
      On_View = 0;
    }

    if (Being_Refurbished === true) {
      Being_Refurbished = 1;
    } else {
      Being_Refurbished = 0;
    }

    db.query(
      `INSERT INTO artworks(Art_Name, Descr, Date_Acquired, Date_Created, Culture, Length, Width, Height, Medium, Being_Refurbished, Collection_ID, Exhibit_ID, Department_ID, Artist_Fname, Artist_Lname, On_View) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        Art_Name,
        Descr,
        Date_Acquired,
        Date_Created,
        Culture,
        Length,
        Width,
        Height,
        Medium,
        Being_Refurbished,
        Collection_ID,
        Exhibit_ID,
        Department_ID,
        Artist_Fname,
        Artist_Lname,
        On_View,
      ],
      (error, result) => {
        if (error) {
          if (error.sqlMessage === "Item cannot be created after today.") {
            // console.log(error);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: "Item cannot be created after today.",
              }),
            );
          } else if (error.sqlMessage === "Item cannot be newer than the exhibition it is in.") {
            // console.log(error);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: "Item cannot be newer than the exhibition it is in.",
              }),
            );
          } else if (error.sqlMessage === "Item cannot be added to an ongoing exhibition.") {
            // console.log(error);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: "Item cannot be added to an ongoing exhibition.",
              }),
            );
          } else {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                error: error,
              }),
            );
          }
        } else {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Artwork added successfully" }));
        }
      },
    );
  });
};

module.exports = {
  getArtworks,
  collectionArtworks,
  exhibitionArtworks,
  departmentArtworks,
  artworkByID,
  getFilteredArt,
  artworksInDep,
  getPastArtworks,
  employeeArtworks,
  deleteArt,
  updateArt,
  addArt,
};
