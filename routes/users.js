const pool = require("../config/db.js");

// ------------------------------------------------ USERS ------------------------------------------------

// GET
const getUsers = (req, res) => {
  pool.query("SELECT * from users", (error, results) => {
    if (error) {
      console.error("Error getting users:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Internal server error" }));
    } else {
      console.log("Sending users:", results);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(results));
    }
  });
};

// GET
const getAUser = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("PUT request body:", data);
      const { User_ID } = data;
      pool.query(
        "SELECT * from users WHERE User_ID=?",
        [User_ID],
        (error, results) => {
          if (error) {
            console.error("Error getting specific user:", error);
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

// POST
const addUser = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("POST request body:", data);
      const {
        User_First_Name,
        User_Last_Name,
        User_Email,
        User_Password,
        User_Address,
        User_City,
        User_State,
        User_Zipcode,
        isAdmin,
      } = data;
      pool.query(
        "INSERT INTO users(User_First_Name, User_Last_Name, User_Email, User_Password, User_Address, User_City, User_State, User_Zipcode, isAdmin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          User_First_Name,
          User_Last_Name,
          User_Email,
          User_Password,
          User_Address,
          User_City,
          User_State,
          User_Zipcode,
          isAdmin,
        ],
        (error, results) => {
          if (error) {
            console.error("Error adding user:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal server error" }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "User added successfully" }));
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
const updateUser = (req, res) => {
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
const deleteUser = (req, res) => {
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

module.exports = { getUsers, getAUser, addUser, updateUser, updateUser, deleteUser };
