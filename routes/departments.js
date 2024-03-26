const pool = require("../config/db.js");

// ------------------------------------------------ DEPARTMENTS ------------------------------------------------

// GET
const getDepartments = (req, res) => {
  pool.query("SELECT * from department", (error, results) => {
    if (error) {
      console.error("Error getting departments:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Internal server error" }));
    } else {
      console.log("Sending users:", results);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(results));
    }
  });
};

// POST
const addDepartment = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("POST request body:", data);
      const {
        department_name,
        manager_start_date,
        department_manager_id,
        Department_Description,
      } = data;
      pool.query(
        "INSERT INTO department(department_name, manager_start_date, department_manager_id, Department_Description) VALUES (?, ?, ?, ?)",
        [
          department_name,
          manager_start_date,
          department_manager_id,
          Department_Description,
        ],
        (error, results) => {
          if (error) {
            console.error("Error adding department:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal server error" }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ message: "Department added successfully" }),
            );
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
const updateDepartment = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("Update request body:", data); // Log the request body
      const {
        new_department_name,
        manager_start_date,
        department_manager_id,
        Department_Description,
        department_name,
      } = data;
      pool.query(
        "UPDATE department SET department_name=?, manager_start_date=?, department_manager_id=?, Department_Description=?  WHERE department_name=?",
        [
          new_department_name,
          manager_start_date,
          department_manager_id,
          Department_Description,
          department_name,
        ],
        (error, results) => {
          if (error) {
            console.error("Error updating department:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal server error" }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ message: "Department updated successfully" }),
            );
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
const deleteDepartment = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("DELETE request body:", data);
      const { department_name } = data;
      pool.query(
        "DELETE from department WHERE department_name=?",
        [department_name],
        (error, results) => {
          if (error) {
            console.error("Error deleting department:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal server error" }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ message: "Department deleted successfully" }),
            );
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
  getDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
};
