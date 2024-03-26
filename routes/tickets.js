const pool = require("../config/db.js");

// ------------------------------------------------ TICKETS ------------------------------------------------

// GET
const getTickets = (req, res) => {
  pool.query("SELECT * from tickets", (error, results) => {
    if (error) {
      console.error("Error getting tickets:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Internal server error" }));
    } else {
      console.log("Sending tickets:", results);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(results));
    }
  });
};

// POST
const addTicket = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("POST request body:", data);
      const {
        Total_Price,
        Transaction_Date,
        Ticket_Date,
        Ticket_Time,
        Customer_ID,
        Num_Child_Tickets,
        Num_Teen_Tickets,
        Num_Adult_Tickets,
        Num_Senior_Tickets,
        Exhibition_Name,
      } = data;
      pool.query(
        "INSERT INTO tickets(Total_Price, Transaction_Date, Ticket_Date, Ticket_Time, Customer_ID, Num_Child_Tickets, Num_Teen_Tickets, Num_Adult_Tickets, Num_Senior_Tickets, Exhibition_Name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          Total_Price,
          Transaction_Date,
          Ticket_Date,
          Ticket_Time,
          Customer_ID,
          Num_Child_Tickets,
          Num_Teen_Tickets,
          Num_Adult_Tickets,
          Num_Senior_Tickets,
          Exhibition_Name,
        ],
        (error, results) => {
          if (error) {
            console.error("Error adding ticket:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal server error" }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Ticket added successfully" }));
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
const updateTicket = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("Update request body:", data); // Log the request body
      const {
        Total_Price,
        Transaction_Date,
        Ticket_Date,
        Ticket_Time,
        Customer_ID,
        Num_Child_Tickets,
        Num_Teen_Tickets,
        Num_Adult_Tickets,
        Num_Senior_Tickets,
        Exhibition_Name,
        TicketTransaction_ID,
      } = data;
      pool.query(
        "UPDATE tickets SET Total_Price=?, Transaction_Date=?, Ticket_Date=?, Ticket_Time=?, Customer_ID=?, Num_Child_Tickets=?, Num_Teen_Tickets=?, Num_Adult_Tickets=?, Num_Senior_Tickets=?, Exhibition_Name=? WHERE TicketTransaction_ID=?",
        [
          Total_Price,
          Transaction_Date,
          Ticket_Date,
          Ticket_Time,
          Customer_ID,
          Num_Child_Tickets,
          Num_Teen_Tickets,
          Num_Adult_Tickets,
          Num_Senior_Tickets,
          Exhibition_Name,
          TicketTransaction_ID,
        ],
        (error, results) => {
          if (error) {
            console.error("Error updating ticket transaction:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal server error" }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: "Ticket transaction updated successfully",
              }),
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
const deleteTicket = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("DELETE request body:", data);
      const { TicketTransaction_ID } = data;
      pool.query(
        "DELETE from tickets WHERE TicketTransaction_ID=?",
        [TicketTransaction_ID],
        (error, results) => {
          if (error) {
            console.error("Error deleting ticket transaction:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal server error" }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: "Ticket transaction deleted successfully",
              }),
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

// GET
const getUserTickets = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("GET request body:", data);
      const { User_ID } = data;
      pool.query(
        "SELECT tickets.* FROM tickets INNER JOIN users ON tickets.Customer_ID=users.User_ID WHERE users.User_ID=?",
        [User_ID],
        (error, results) => {
          if (error) {
            console.error("Error getting user's ticket transaction:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal server error" }));
          } else {
            console.log("Sending user's tickets:", results);
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

module.exports = {
  getTickets,
  addTicket,
  updateTicket,
  deleteTicket,
  getUserTickets,
};
