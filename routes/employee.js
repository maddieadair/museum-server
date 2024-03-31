const http = require("http");
const mysql = require("mysql");
const db = require("../config/db");

// Get all employees
const getEmployees = (req, res) => {
  db.query(`SELECT * from employees`, (error, result) => {
    if (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error }));
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result));
    }
  });
};

// Employee login
const employeeLogin = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    const employee_email = body.employee_email;
    const employee_password = body.employee_password;
    console.log("Update request body:", data); // Log the request body

    db.query(
      "SELECT * FROM employees WHERE employee_email = ? AND employee_password=?",
      [employee_email, employee_password],
      (error, result) => {
        if (error) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: error }));
        } else if (result.length === 0) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Invalid username or password" }));
        } else {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Login successful" }));
        }
      }
    );
  });
};

module.exports = {
  employeeLogin,
  getEmployees,
};
