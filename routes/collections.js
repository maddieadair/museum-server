const http = require("http");
const mysql = require("mysql");
const db = require("../config/db");

// Get all collections
const getCollections = (req, res) => {
  db.query(
    `SELECT collections.*, department.department_name, employees.employee_fname AS curator_fname, employees.employee_lname AS curator_lname FROM collections 
  LEFT JOIN department ON collections.collection_departmentID = department.department_id 
  LEFT JOIN employees ON collections.collection_curator_ID = employees.employee_id;`,
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

// Get all collections in a department
const departmentCollections = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    const collection_departmentID = parseInt(body.collection_departmentID);

    db.query(
      "SELECT collections.*, department.department_name, employees.employee_fname AS curator_fname, employees.employee_lname AS curator_lname FROM collections LEFT JOIN department ON collections.collection_departmentID = department.department_id LEFT JOIN employees ON collections.collection_curator_ID = employees.employee_id WHERE collections.collection_departmentID = (?);",
      [collection_departmentID],
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

// Get all collections in a department by name
const getDeptCollByName = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    const department_name = body.department_name;

    db.query(
      `SELECT collections.*, department.department_name, employees.employee_fname AS curator_fname, employees.employee_lname AS curator_lname
      FROM collections LEFT JOIN department ON collections.collection_departmentID = department.department_id 
      LEFT JOIN employees ON collections.collection_curator_ID = employees.employee_id
    WHERE
        collections.collection_departmentID = (SELECT 
                department.department_id
            FROM
                department
            WHERE
                department.department_name = ? );`,
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
      "SELECT collections.*, department.department_name, employees.employee_fname AS curator_fname, employees.employee_lname AS curator_lname FROM collections LEFT JOIN department ON collections.collection_departmentID = department.department_id LEFT JOIN employees ON collections.collection_curator_ID = employees.employee_id WHERE collections.collection_id = ?;",
      [collection_id],
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

// Get an Employee's Collections
const employeeCollections = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    const collection_curator_ID = parseInt(body.collection_curator_ID);

    db.query(
      `SELECT * from collections WHERE collection_curator_ID = ?`,
      [collection_curator_ID],
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

// Get an Employee's Collections
const addCollection = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    const collection_name = body.collection_name;
    const collection_description = body.collection_description;
    const collection_curator_ID = body.collection_curatorID !== "" ? parseInt(body.collection_curator_ID) : null;
    const collection_departmentID = parseInt(body.collection_departmentID);

    db.query(
      `INSERT INTO collections(collection_name, collection_description, collection_curator_ID, collection_departmentID) VALUES (?, ?, ?, ?)`,
      [collection_name, collection_description, collection_curator_ID, collection_departmentID],
      (error, result) => {
        if (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ error: error }),
            );
        } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ message: "Collection successfully added!" }),
            );
        }
      },
    );
  });
};

// Get an Employee's Collections
const updateCollection = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    const collection_name = body.collection_name;
    const collection_description = body.collection_description;
    const collection_curator_ID = body.collection_curatorID !== "" ? parseInt(body.collection_curator_ID) : null;
    const collection_id = parseInt(body.collection_id);

    db.query(
        `UPDATE collections SET collection_name = ?, collection_description =?, collection_curator_ID =? WHERE collection_id =?`,
        [collection_name, collection_description, collection_curator_ID, collection_id],
      (error) => {
        if (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ error: error }),
            );
        } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ message: "Collection successfully updated!" }),
            );
        }
      },
    );
  });
};

// Get an Employee's Collections
const deleteCollection = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    const collection_id = parseInt(body.collection_id);

    db.query(
      `DELETE from collections WHERE collection_id = ?`,
      [collection_id],
      (error) => {
        if (error) {
            console.log(error)
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: error }));
        } else {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ message: "Collection successfully deleted!" }),
          );
        }
      },
    );
  });
};

module.exports = {
  getCollections,
  departmentCollections,
  getCollectionByID,
  getDeptCollByName,
  employeeCollections,
  addCollection,
  updateCollection,
  deleteCollection,
};
