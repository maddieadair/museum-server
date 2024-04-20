const http = require("http");
const mysql = require("mysql");
const db = require("../config/db");

// Get all tickets
const getTickets = (req, res) => {
  db.query(
    `SELECT tickets.*, DATE_FORMAT(Transaction_Date, "%M %d, %Y") AS New_Transaction_Date, DATE_FORMAT(Ticket_Date, "%M %d, %Y") AS New_Ticket_Date, customers.Customer_Fname, customers.Customer_Lname, SUM(tickets.Num_Child_Tickets + tickets.Num_Teen_Tickets + tickets.Num_Adult_Tickets + tickets.Num_Senior_Tickets) AS Ticket_Count from tickets, customers WHERE tickets.Customer_ID = customers.Customer_ID GROUP BY tickets.TicketTransaction_ID
    `,
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

// Get tickets for a customer by ID
const getCustomerTickets = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    const Customer_ID = parseInt(body.Customer_ID);

    db.query(
      `SELECT *, DATE_FORMAT(Transaction_Date, "%M %d, %Y") AS New_Transaction_Date, DATE_FORMAT(Ticket_Date, "%M %d, %Y") AS New_Ticket_Date, SUM(tickets.Num_Child_Tickets + tickets.Num_Teen_Tickets + tickets.Num_Adult_Tickets + tickets.Num_Senior_Tickets) AS Ticket_Count from tickets WHERE tickets.Customer_ID = ? GROUP BY tickets.TicketTransaction_ID`,
      [Customer_ID],
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

// Get ticket by ID
const getTicketByID = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    const TicketTransaction_ID = parseInt(body.TicketTransaction_ID);

    db.query(
      `SELECT *, DATE_FORMAT(Transaction_Date, "%M %d, %Y") AS New_Transaction_Date, DATE_FORMAT(Ticket_Date, "%M %d, %Y") AS New_Ticket_Date, SUM(tickets.Num_Child_Tickets + tickets.Num_Teen_Tickets + tickets.Num_Adult_Tickets + tickets.Num_Senior_Tickets) AS Ticket_Count from tickets WHERE tickets.TicketTransaction_ID = ? GROUP BY tickets.TicketTransaction_ID`,
      [TicketTransaction_ID],
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

// Add Ticket
const addTicket = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    const Customer_ID = parseInt(body.Customer_ID);
    const Total_Bill = parseInt(body.Total_Bill);
    const Ticket_Date = body.Ticket_Date;
    const Ticket_Time = body.Ticket_Time;
    const Num_Child_Tickets = parseInt(body.Num_Child_Tickets);
    const Num_Teen_Tickets = parseInt(body.Num_Teen_Tickets);
    const Num_Adult_Tickets = parseInt(body.Num_Adult_Tickets);
    const Num_Senior_Tickets = parseInt(body.Num_Senior_Tickets);
    let Exhibition_Name = body.Exhibition_Name;

    if (Exhibition_Name === "") {
      Exhibition_Name = null;
    }

    console.log(body)

    db.query(
      `INSERT INTO tickets(Customer_ID, Total_Bill, Ticket_Date, Ticket_Time, Num_Child_Tickets, Num_Teen_Tickets, Num_Adult_Tickets, Num_Senior_Tickets, Exhibition_Name) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        Customer_ID,
        Total_Bill,
        Ticket_Date,
        Ticket_Time,
        Num_Child_Tickets,
        Num_Teen_Tickets,
        Num_Adult_Tickets,
        Num_Senior_Tickets,
        Exhibition_Name,
      ],
      (error, result) => {
        console.log(result)
        if (error) {
            console.log(error)
          if (
            error.sqlMessage === "Tickets for this date and time are sold out."
          ) {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: "Tickets for this date and time are sold out.",
              }),
            );
          } else if (
            error.sqlMessage === "Requested quantity exceeds current stock"
          ) {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: "Requested quantity exceeds current stock",
              }),
            );
          } else {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: error }));
          }
        } else {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(result));
        }
      },
    );
  });
};

module.exports = {
  getTickets,
  getCustomerTickets,
  getTicketByID,
  addTicket,

};
