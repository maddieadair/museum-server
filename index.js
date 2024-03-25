const http = require("http");
const { parse } = require("url");
const mysql = require("mysql");

// "proxy": "http://localhost:4000",

const pool = mysql.createPool({
  host: "mysql-museum.mysql.database.azure.com",
  user: "admin01",
  password: "bananafish1!",
  database: "museum",
  dateStrings: true,
});

pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to database:", err);
      return;
    }
    console.log("Connected to database!");
    // Release the connection
    connection.release();
  });

// const pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.USER,
//     password: process.env.DB,
//     database: "museum",
//     dateStrings: true,
//   });

const server = http.createServer((req, res) => {
  handleCors(req, res);

  console.log("Incoming request:", req.method, req.url); // Log incoming requests
  if (req.url === "/") {
    res.setHeader("Content-Type", "text/html");
    res.write(
      "<html><head><title>Hello, Worlds!</title></head><body><h1>Hello, World!</h1></body></html>",
    );
    res.end();
  } else if (req.url === "/api/gift-items" && req.method === "PUT") {
    updateGiftItems(req, res);
  } else if (req.url === "/api/gift-items" && req.method === "GET") {
    fetchGiftItems(req, res);
  } else if (req.url === "/api/donations" && req.method === "GET") {
    fetchDonations(req, res);
  } else if (req.url === "/api/donations" && req.method === "PUT") {
    updateDonation(req, res);
  } else if (req.url === "/api/donations" && req.method === "POST") {
    addDonation(req, res);
  } else if (req.url === "/api/users" && req.method === "GET") {
    fetchUsers(req, res);
  } else if (req.url === "/api/users" && req.method === "POST") {
    addUser(req, res);
  } else if (req.url === "/api/users" && req.method === "PUT") {
    updateUser(req, res);
  } else if (req.url === "/api/users" && req.method === "DELETE") {
    deleteUser(req, res);
  } else if (req.url === "/api/getUser" && req.method === "GET") {
    getUser(req, res);
  } else if (req.url === "/api/departments" && req.method === "GET") {
    fetchDepartments(req, res);
  } else if (req.url === "/api/departments" && req.method === "POST") {
    addDepartment(req, res);
  } else if (req.url === "/api/departments" && req.method === "PUT") {
    updateDepartment(req, res);
  } else if (req.url === "/api/departments" && req.method === "DELETE") {
    deleteDepartment(req, res);
  } else if (req.url === "/api/collections" && req.method === "GET") {
    fetchCollections(req, res);
  } else if (req.url === "/api/collections" && req.method === "POST") {
    addCollection(req, res);
  } else if (req.url === "/api/collections" && req.method === "PUT") {
    updateCollection(req, res);
  } else if (req.url === "/api/collections" && req.method === "DELETE") {
    deleteCollection(req, res);
  } else if (req.url === "/api/employees" && req.method === "GET") {
    fetchEmployees(req, res);
  } else if (req.url === "/api/employees" && req.method === "POST") {
    addEmployee(req, res);
  } else if (req.url === "/api/employees" && req.method === "PUT") {
    updateEmployee(req, res);
  } else if (req.url === "/api/employees" && req.method === "DELETE") {
    deleteEmployee(req, res);
  } else if (req.url === "/api/exhibitions" && req.method === "GET") {
    fetchExhibitions(req, res);
  } else if (req.url === "/api/exhibitions" && req.method === "POST") {
    addExhibition(req, res);
  } else if (req.url === "/api/exhibitions" && req.method === "PUT") {
    updateExhibition(req, res);
  } else if (req.url === "/api/exhibitions" && req.method === "DELETE") {
    deleteExhibition(req, res);
  } else if (req.url === "/api/tickets" && req.method === "GET") {
    fetchTickets(req, res);
  } else if (req.url === "/api/tickets" && req.method === "DELETE") {
    deleteTicket(req, res);
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found. Try again" }));
  }
});

// ------------------------------ GIFTS ------------------------------

const updateGiftItems = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("Update request body:", data); // Log the request body
      const { itemId, newStock, newSold } = data;
      pool.query(
        "UPDATE gifts SET gift_currStock = ?, gift_numSold = ? WHERE gift_index = ?",
        [newStock, newSold, itemId],
        (error, results) => {
          if (error) {
            console.error("Error updating gift items:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal server error" }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ message: "Gift items updated successfully" }),
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

const fetchGiftItems = (req, res) => {
  pool.query("SELECT * FROM gifts", (error, results) => {
    if (error) {
      console.error("Error fetching gift items:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Internal server error" }));
    } else {
      console.log("Sending gift items:", results); // Log the fetched gift items
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(results));
    }
  });
};

// ------------------------------ DONATIONS ------------------------------

// GET
const fetchDonations = (req, res) => {
  pool.query(
    "SELECT donations.Donation_ID, donations.Amount_Donated, donations.Donation_Note, donations.Donation_Date, donations.Donor_ID, users.User_First_Name, users.User_Last_Name FROM donations, users WHERE donations.Donor_ID = users.User_ID",
    (error, results) => {
      if (error) {
        console.error("Error fetching donations:", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Internal server error" }));
      } else {
        console.log("Sending donations:", results); // Log the fetched gift items
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(results));
      }
    },
  );
};

// POST
const addDonation = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("POST request body:", data); // Log the request body
      const { Amount_Donated, Donation_Note, Donation_Date, Donor_ID } = data;
      pool.query(
        "INSERT INTO donations(Amount_Donated, Donation_Note, Donation_Date, Donor_ID) VALUES (?)",
        [data],
        (error, results) => {
          if (error) {
            console.error("Error adding donation:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal server error" }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Donation added successfully" }));
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
const updateDonation = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("Update request body:", data); // Log the request body
      const {
        Donation_ID,
        Amount_Donated,
        Donation_Note,
        Donation_Date,
        Donor_ID,
      } = data;
      pool.query(
        "UPDATE donations SET Donation_ID=?, Amount_Donated=?, Donation_Note=?, Donation_Date=?, Donor_ID=? WHERE Donation_ID=?",
        [
          Donation_ID,
          Amount_Donated,
          Donation_Note,
          Donation_Date,
          Donor_ID,
          Donation_ID,
        ],
        (error, results) => {
          if (error) {
            console.error("Error updating donations:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal server error" }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ message: "Donations updated successfully" }),
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
const deleteDonation = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("POST request body:", data); // Log the request body
      const { Donation_ID } = data;
      pool.query(
        "DELETE FROM donations WHERE Donation_ID=?",
        [Donation_ID],
        (error, results) => {
          if (error) {
            console.error("Error deleting donation:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal server error" }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Donation added successfully" }));
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

// ------------------------------ USERS ------------------------------

// GET
const fetchUsers = (req, res) => {
  pool.query("SELECT * FROM users", (error, results) => {
    if (error) {
      console.error("Error fetching users:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Internal server error" }));
    } else {
      console.log("Sending users:", results); // Log the fetched gift items
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(results));
    }
  });
};

// GET
const getUser = (req, res) => {
  pool.query("SELECT * FROM users WHERE User_ID = ?", (error, results) => {
    if (error) {
      console.error("Error fetching users:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Internal server error" }));
    } else {
      console.log("Sending users:", results); // Log the fetched gift items
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(results));
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
      console.log("POST request body:", data); // Log the request body
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
        User_ID,
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
        "UPDATE users SET User_First_Name=?, User_Last_Name=?, User_Email=?, User_Password=?, User_Address=?, User_City=?, User_State=?, User_Zipcode=?, isAdmin = ? WHERE User_ID = ?",
        [
          User_ID,
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
      console.log("POST request body:", data); // Log the request body
      const { User_ID } = data;
      pool.query(
        "DELETE FROM users WHERE User_ID=?",
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

// ------------------------------ DEPARTMENTS ------------------------------

// GET
const fetchDepartments = (req, res) => {
  pool.query("SELECT * FROM department", (error, results) => {
    if (error) {
      console.error("Error fetching departments:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Internal server error" }));
    } else {
      console.log("Sending departemnts:", results); // Log the fetched gift items
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
      console.log("POST request body:", data); // Log the request body
      const {
        department_name,
        manager_start_date,
        department_manager_id,
        Department_Description,
      } = data;
      console.log(data.department_name);
      pool.query(
        `INSERT INTO department VALUES (?, ?, ?, ?)`,
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
        department_name,
        manager_start_date,
        department_manager_id,
        Department_Description,
      } = data;
      pool.query(
        "UPDATE department SET department_name=?, manager_start_date=?, department_manager_id=?, Department_Description=? WHERE department_name=?",
        [
          department_name,
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
const deleteDepartment = (req, res) => {};

// ------------------------------ TICKETS ------------------------------

// GET
const fetchTickets = (req, res) => {
  pool.query(
    "SELECT *, SUM(Num_Child_Tickets + Num_Teen_Tickets + Num_Adult_Tickets + Num_Senior_Tickets) AS TotalCount FROM tickets GROUP BY TicketTransaction_ID;",
    (error, results) => {
      if (error) {
        console.error("Error fetching tickets:", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Internal server error" }));
      } else {
        console.log("Sending tickets:", results); // Log the fetched gift items
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(results));
      }
    },
  );
};

// DELETE
const deleteTicket = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("POST request body:", data); // Log the request body
      const { TicketTransaction_ID } = data;
      pool.query(
        "DELETE FROM tickets WHERE TicketTransaction_ID=?",
        [TicketTransaction_ID],
        (error, results) => {
          if (error) {
            console.error("Error deleting ticket:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal server error" }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Ticket deleted successfully" }));
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

// ------------------------------ USERS ------------------------------

// GET
const fetchExhibitions = (req, res) => {
  pool.query("SELECT * FROM exhibitions", (error, results) => {
    if (error) {
      console.error("Error fetching exhibitions:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Internal server error" }));
    } else {
      console.log("Sending exhibitions:", results); // Log the fetched gift items
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(results));
    }
  });
};

// PUT
const updateExhibition = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("POST request body:", data); // Log the request body
      const { Exhibit_Name } = data;
      pool.query(
        "DELETE FROM exhibitions WHERE Exhibit_Name=?",
        [Exhibit_Name],
        (error, results) => {
          if (error) {
            console.error("Error deleting exhibitions:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal server error" }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ message: "Exhibitions deleted successfully" }),
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

// POST
const addExhibition = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("POST request body:", data); // Log the request body
      const { Exhibit_Name } = data;
      pool.query(
        "DELETE FROM exhibitions WHERE Exhibit_Name=?",
        [Exhibit_Name],
        (error, results) => {
          if (error) {
            console.error("Error deleting exhibitions:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal server error" }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ message: "Exhibitions deleted successfully" }),
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
const deleteExhibition = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("POST request body:", data); // Log the request body
      const { Exhibit_Name } = data;
      pool.query(
        "DELETE FROM exhibitions WHERE Exhibit_Name=?",
        [Exhibit_Name],
        (error, results) => {
          if (error) {
            console.error("Error deleting exhibitions:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal server error" }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ message: "Exhibitions deleted successfully" }),
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

// ------------------------------ COLLECTIONS ------------------------------

// GET
const fetchCollections = (req, res) => {
  pool.query("SELECT * FROM collections", (error, results) => {
    if (error) {
      console.error("Error fetching collections:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Internal server error" }));
    } else {
      console.log("Sending collections:", results); // Log the fetched gift items
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(results));
    }
  });
};

// PUT
const updateCollection = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("POST request body:", data); // Log the request body
      const { Exhibit_Name } = data;
      pool.query(
        "DELETE FROM exhibitions WHERE Exhibit_Name=?",
        [Exhibit_Name],
        (error, results) => {
          if (error) {
            console.error("Error deleting exhibitions:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal server error" }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ message: "Exhibitions deleted successfully" }),
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

// POST
const addCollection = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("POST request body:", data); // Log the request body
      const { Exhibit_Name } = data;
      pool.query(
        "DELETE FROM exhibitions WHERE Exhibit_Name=?",
        [Exhibit_Name],
        (error, results) => {
          if (error) {
            console.error("Error deleting exhibitions:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal server error" }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ message: "Exhibitions deleted successfully" }),
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
const deleteCollection = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("POST request body:", data); // Log the request body
      const { Exhibit_Name } = data;
      pool.query(
        "DELETE FROM exhibitions WHERE Exhibit_Name=?",
        [Exhibit_Name],
        (error, results) => {
          if (error) {
            console.error("Error deleting exhibitions:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal server error" }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ message: "Exhibitions deleted successfully" }),
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

// ------------------------------ EMPLOYEES ------------------------------

// GET
const fetchEmployees = (req, res) => {
  pool.query("SELECT * FROM employees", (error, results) => {
    if (error) {
      console.error("Error fetching employees:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Internal server error" }));
    } else {
      console.log("Sending employees:", results); // Log the fetched gift items
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(results));
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
      console.log("POST request body:", data); // Log the request body
      const { Exhibit_Name } = data;
      pool.query(
        "DELETE FROM exhibitions WHERE Exhibit_Name=?",
        [Exhibit_Name],
        (error, results) => {
          if (error) {
            console.error("Error deleting exhibitions:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal server error" }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ message: "Exhibitions deleted successfully" }),
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

// POST
const addEmployee = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("POST request body:", data); // Log the request body
      const { Exhibit_Name } = data;
      pool.query(
        "DELETE FROM exhibitions WHERE Exhibit_Name=?",
        [Exhibit_Name],
        (error, results) => {
          if (error) {
            console.error("Error deleting exhibitions:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal server error" }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ message: "Exhibitions deleted successfully" }),
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
const deleteEmployee = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("POST request body:", data); // Log the request body
      const { Exhibit_Name } = data;
      pool.query(
        "DELETE FROM exhibitions WHERE Exhibit_Name=?",
        [Exhibit_Name],
        (error, results) => {
          if (error) {
            console.error("Error deleting exhibitions:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal server error" }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ message: "Exhibitions deleted successfully" }),
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

const handleCors = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }
};

// Set Up Server To Listen For Requests From Port 3001
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
