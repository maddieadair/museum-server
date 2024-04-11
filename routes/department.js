const http = require("http");
const mysql = require("mysql");
const db = require("../config/db");

// Get all departments
const getDepartments = (req, res) => {
  db.query(
    `SELECT department.*, DATE_FORMAT(manager_start_date, "%Y-%m-%d") AS New_MgrStart, employees.employee_fname AS manager_fname, employees.employee_lname AS manager_lname FROM department LEFT JOIN employees ON department.department_manager_id = employees.employee_id;`,
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

// Get all departments
const getDeptNoManagers = (req, res) => {
    db.query(
        `SELECT * FROM department WHERE department.department_manager_id IS NULL;`,
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
      `SELECT department.*, DATE_FORMAT(manager_start_date, "%Y-%m-%d") AS New_MgrStart, employees.employee_fname AS manager_fname, employees.employee_lname AS manager_lname FROM department LEFT JOIN employees ON department.department_manager_id = employees.employee_id WHERE department.department_id = ?;`,
      [department_id],
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

// Get Department by Name
const getDepartmentByName = (req, res) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
  
    req.on("end", () => {
      const body = JSON.parse(data);
      const department_name = body.department_name;
  
      db.query(
        `SELECT * from department WHERE department.department_name = ?;`,
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

// Add Department
const addDepartment = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);

    console.log("body", body)
    const department_name = body.department_name;
    let manager_start_date = body.manager_start_date !== "" ? body.manager_start_date : null;
    let department_manager_id = body.department_manager_id !== "" ? parseInt(body.department_manager_id) : null;
    const Department_Description = body.Department_Description;

    db.query(
      `INSERT INTO department(department_name, manager_start_date, department_manager_id, Department_Description) VALUES (?, ?, ?, ?);`,
      [
        department_name,
        manager_start_date,
        department_manager_id,
        Department_Description,
      ],
      (error, result) => {
        if (error) {
            console.log(error)
          console.log(error);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: error }));
          //res.end(JSON.stringify({ error: error }));
        } else {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Department successfully added!" }));
        }
      },
    );
  });
};

// Update Department
const updateDepartment = (req, res) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
  
    req.on("end", () => {
      const body = JSON.parse(data);
  
      const department_name = body.department_name;
      let manager_start_date = body.manager_start_date !== "" ? body.manager_start_date : null;
      let department_manager_id = body.department_manager_id !== "" ? parseInt(body.department_manager_id) : null;
      const Department_Description = body.Department_Description;
      const department_id = parseInt(body.department_id);

      db.query(
        `UPDATE department SET department_name=?, manager_start_date=?, department_manager_id=?, Department_Description=? WHERE department_id=?;`,
        [
          department_name,
          manager_start_date,
          department_manager_id,
          Department_Description,
          department_id
        ],
        (error, result) => {
          if (error) {
              console.log(error)
            console.log(error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: error }));
            //res.end(JSON.stringify({ error: error }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Department successfully updated!" }));
          }
        },
      );
    });
  };

  // delete department
const deleteDept = (req, res) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
  
    req.on("end", () => {
      const body = JSON.parse(data);
      const department_id = parseInt(body.department_id);
  
      db.query(
        `DELETE from department WHERE department_id = ?;`,
        [department_id],
        (error, result) => {
          if (error) {
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: error }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Department successfully deleted" }));
          }
        },
      );
    });
  };

module.exports = {
  getDepartments,
  getDepartmentByID,
  addDepartment,
  getDepartmentByName,
  addDepartment,
  updateDepartment,
  deleteDept,
  getDeptNoManagers
};
