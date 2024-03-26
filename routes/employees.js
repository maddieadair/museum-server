const pool = require("../config/db.js");

// ------------------------------------------------ EMPLOYEES ------------------------------------------------

// GET
const getEmployees = (req, res) => {
  pool.query("SELECT * from employees", (error, results) => {
    if (error) {
      console.error("Error getting employees:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Internal server error" }));
    } else {
      console.log("Sending employees:", results);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(results));
    }
  });
};

// GET
const getAnEmployee = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("PUT request body:", data);
      const { employee_id } = data;
      pool.query(
        "SELECT * from employees WHERE employee_id=?",
        [employee_id],
        (error, results) => {
          if (error) {
            console.error("Error getting employee:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal server error" }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(results));
          }
        },
      );
    } catch (error) {
      console.error("Error parsing request body:", error);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid request body" }));
    }
  });
};

///// EVERYTHING BELOW HERE IS NOT DONE

// POST
const addEmployee = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("POST request body:", data);
      const { sex, role, salary, DOB, dep_name, supervisor_id } = data;
      pool.query(
        "INSERT INTO employees(sex, role, salary, DOB, dep_name, supervisor_id) VALUES (?, ?, ?, ?, ?, ?)",
        [sex, role, salary, DOB, dep_name, dep_name, supervisor_id],
        (error, results) => {
          if (error) {
            console.error("Error adding employee:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal server error" }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Employee added successfully" }));
          }
        },
      );
    } catch (error) {
      console.error("Error parsing request body:", error);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid request body" }));
    }
  });
};

// PUT
const updateEmployee = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("Update request body:", data); // Log the request body
      const {
        User_First_Name,
        User_Last_Name,
        User_Email,
        User_Password,
        User_Address,
        User_City,
        User_State,
        User_Zipcode,
        User_ID,
      } = data;
      pool.query(
        "UPDATE users SET User_First_Name=?, User_Last_Name=?, User_Email=?, User_Password=?, User_Address=?, User_City=?, User_State=?, User_Zipcode=? WHERE User_ID=?",
        [
          User_First_Name,
          User_Last_Name,
          User_Email,
          User_Password,
          User_Address,
          User_City,
          User_State,
          User_Zipcode,
          User_ID,
        ],
        (error, results) => {
          if (error) {
            console.error("Error updating user:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal server error" }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "User updated successfully" }));
          }
        },
      );
    } catch (error) {
      console.error("Error parsing request body:", error);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid request body" }));
    }
  });
};

// DELETE
const deleteEmployee = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("DELETE request body:", data);
      const { User_ID } = data;
      pool.query(
        "DELETE from users WHERE User_ID=?",
        [User_ID],
        (error, results) => {
          if (error) {
            console.error("Error deleting user:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal server error" }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "User deleted successfully" }));
          }
        },
      );
    } catch (error) {
      console.error("Error parsing request body:", error);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid request body" }));
    }
  });
};

module.exports = {
  getEmployees,
  getAnEmployee,
  addEmployee,
  deleteEmployee,
  updateEmployee,
};
