const http = require("http");
const mysql = require("mysql");
const db = require("../config/db");

// Get all departments
const getDepartments = (req, res) => {
  db.query(`SELECT department.*, employees.employee_fname AS manager_fname,employees.employee_lname AS manager_lname from department, employees WHERE department.department_manager_id = employees.employee_id;`, (error, result) => {
    if (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error }));
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result));
    }
  });
};

// Get Department by ID
const getDepartmentByID = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    const department_id = parseInt(body.department_id);

    db.query(
      "SELECT department.*, employees.employee_fname AS manager_fname, employees.employee_lname AS manager_lname FROM department LEFT JOIN employees ON department.department_manager_id = employees.employee_id WHERE department.department_id = ?;",
      [department_id],
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
  getDepartments,
  getDepartmentByID,
};
