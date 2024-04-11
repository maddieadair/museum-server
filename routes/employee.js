const http = require("http");
const mysql = require("mysql");
const db = require("../config/db");

// Get all employees
const getEmployees = (req, res) => {
  db.query(
    `SELECT E.*, DATE_FORMAT(E.DOB, "%c/%e/%Y") AS New_DOB, M.employee_fname AS "Supervisor_Fname", M.employee_lname AS "Supervisor_Lname", department.department_name
    FROM employees E 
    LEFT OUTER JOIN employees M
      ON E.supervisor_id = M.employee_id
    LEFT OUTER JOIN department
    ON E.dep_ID = department.department_id;`,
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

// Get employee by ID
const getEmployeeByID = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    const employee_id = parseInt(body.employee_id);

    db.query(
      `SELECT E.*, DATE_FORMAT(E.DOB, "%c/%e/%Y") AS New_DOB, M.employee_fname AS "Supervisor_Fname", M.employee_lname AS "Supervisor_Lname", department.department_name
      FROM employees E 
      LEFT OUTER JOIN employees M
        ON E.supervisor_id = M.employee_id
      LEFT OUTER JOIN department
      ON E.dep_ID = department.department_id WHERE E.employee_id = ?;`,
      [employee_id],
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

// Get all suboordinates
const getSuboordinates = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    const supervisor_id = parseInt(body.supervisor_id);

    db.query(
      `SELECT E.*, DATE_FORMAT(E.DOB, "%c/%e/%Y") AS New_DOB, department.department_name
      FROM employees E 
      LEFT OUTER JOIN employees M
        ON E.supervisor_id = M.employee_id
      LEFT OUTER JOIN department
      ON E.dep_ID = department.department_id
      WHERE E.employee_id != 1 AND E.supervisor_id = ?;`,
      [supervisor_id],
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

// Add Employee
const addEmployee = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    console.log(body)
    const employee_fname = body.employee_fname;
    let employee_mname = body.employee_mname;
    const employee_lname = body.employee_lname;
    const employee_address = body.employee_address;
    const employee_city = body.employee_city;
    const employee_state = body.employee_state;
    const employee_zipcode = body.employee_zipcode;
    const sex = body.sex;
    const role = body.role;
    const salary = parseInt(body.salary);
    const DOB = body.DOB;
    let dep_ID = body.dep_ID !== "" ? parseInt(body.dep_ID) : null;
    let supervisor_id = body.supervisor_id !== "" ? parseInt(body.supervisor_id) : null;

    if (employee_mname === ""){
        employee_mname = null;
    }

    if (supervisor_id === ""){
        supervisor_id = null;
    }

    db.query(
      `INSERT INTO employees(employee_fname, employee_mname, employee_lname, employee_address, employee_city, employee_state, employee_zipcode, sex, role, salary, DOB, dep_ID, supervisor_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [employee_fname, employee_mname, employee_lname, employee_address, employee_city, employee_state, employee_zipcode, sex, role, salary, DOB, dep_ID, supervisor_id],
      (error, result) => {
        if (error) {
            console.log(error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: error }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "New employee added successfully" }));
          }
      },
    );
  });
};

// Update Employee
const updateEmployee = (req, res) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
  
    req.on("end", () => {
      const body = JSON.parse(data);
      const employee_id = parseInt(body.employee_id);
      const role = body.role;
      const salary = parseInt(body.salary);
      let dep_ID = body.dep_ID !== ""  ? parseInt(body.dep_ID) : null;
      let supervisor_id = body.supervisor_id !== "" ? parseInt(body.supervisor_id) : null;
  
      if (dep_ID === ""){
        dep_ID = null;
      }
  
      if (supervisor_id === ""){
          supervisor_id = null;
      }
  
      db.query(
        `UPDATE employees SET role = ?, salary = ?, dep_ID = ?, supervisor_id = ? WHERE employee_id = ?`,
        [role, salary, dep_ID, supervisor_id, employee_id],
        (error, result) => {
            if (error) {
                console.log(error);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Error updating employee information!" }));
              } else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Employee information updated successfully" }));
              }
        },
      );
    });
  };

  // Delete Gift
const deleteEmployee = (req, res) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
  
    req.on("end", () => {
      const body = JSON.parse(data);
      const employee_id = parseInt(body.employee_id);
  
      db.query(
        "DELETE from employees WHERE employee_id = ?",
        [employee_id],
        (error, result) => {
          if (error) {
            console.log(error);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Error deleting employee" }));
            //res.end(JSON.stringify({ error: error }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ message: "Employee deleted successfully" }),
            );
          }
        },
      );
    });
  };

// Get all managers
const getManagers = (req, res) => {
  db.query(
    `SELECT E.*, DATE_FORMAT(E.DOB, "%c/%e/%Y") AS New_DOB, M.employee_fname AS "Supervisor_Fname", M.employee_lname AS "Supervisor_Lname", department.department_name
    FROM employees E 
    LEFT OUTER JOIN employees M
      ON E.supervisor_id = M.employee_id
    LEFT OUTER JOIN department
    ON E.dep_ID = department.department_id
    WHERE E.employee_id != 1 AND E.role = "Manager";`,
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

// Get all supervisores (manager + director)
const getSupervisors = (req, res) => {
    db.query(
      `SELECT E.*, DATE_FORMAT(E.DOB, "%c/%e/%Y") AS New_DOB, M.employee_fname AS "Supervisor_Fname", M.employee_lname AS "Supervisor_Lname", department.department_name
      FROM employees E 
      LEFT OUTER JOIN employees M
        ON E.supervisor_id = M.employee_id
      LEFT OUTER JOIN department
      ON E.dep_ID = department.department_id
      WHERE E.role = "Manager" OR E.role = "Director";`,
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


// Get all managers without a department
const getNewManagers = (req, res) => {
  db.query(
    `SELECT employee_id, employee_fname, employee_lname FROM employees WHERE role = "Manager" AND dep_ID IS NULL;`,
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

// Get all curators
const getCurators = (req, res) => {
  db.query(
    `SELECT E.*, DATE_FORMAT(E.DOB, "%c/%e/%Y") AS New_DOB, M.employee_fname AS "Supervisor_Fname", M.employee_lname AS "Supervisor_Lname", department.department_name
    FROM employees E 
    LEFT OUTER JOIN employees M
      ON E.supervisor_id = M.employee_id
    LEFT OUTER JOIN department
    ON E.dep_ID = department.department_id
    WHERE E.employee_id != 1 AND E.role = "Curator";`,
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

// Get all shop managers
const getShopManagers = (req, res) => {
  db.query(
    `SELECT E.*, DATE_FORMAT(E.DOB, "%c/%e/%Y") AS New_DOB, M.employee_fname AS "Supervisor_Fname", M.employee_lname AS "Supervisor_Lname", department.department_name
    FROM employees E 
    LEFT OUTER JOIN employees M
      ON E.supervisor_id = M.employee_id
    LEFT OUTER JOIN department
    ON E.dep_ID = department.department_ID
    WHERE E.employee_id != 1 AND E.role = "Shop Manager";`,
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
      },
    );
  });
};

module.exports = {
  employeeLogin,
  getEmployees,
  getSuboordinates,
  getManagers,
  getCurators,
  getShopManagers,
  getNewManagers,
  getEmployeeByID,
  deleteEmployee,
  addEmployee,
  updateEmployee,
  getSupervisors
};
