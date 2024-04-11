const http = require("http");
const mysql = require("mysql");
const db = require("../config/db");

// Get all donations
const getDonations = (req, res) => {
  db.query(
    `SELECT donations.*, customers.Customer_Fname, customers.Customer_Lname, DATE_FORMAT(Donation_Date, "%M %d, %Y") AS New_Date from donations, customers WHERE donations.Donor_ID = customers.Customer_ID`,
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

// Add new donation
const addDonation = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    const Amount_Donated = parseInt(body.Amount_Donated);
    let Donation_Note = body.Donation_Note;
    const Donor_ID = body.Donor_ID;

    if (Donation_Note === "") {
      Donation_Note = null;
    }

    db.query(
      "INSERT INTO donations(Amount_Donated, Donation_Note, Donor_ID) VALUES (?, ?, ?)",
      [Amount_Donated, Donation_Note, Donor_ID],
      (error, result) => {
        if (error) {
          console.log(error);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Error adding donation!" }));
        } else {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Donation added successfully" }));
        }
      },
    );
  });
};

// Get donations for a customer by ID
const getCustomerDonations = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    const Donor_ID = parseInt(body.Donor_ID);

    db.query(
      `SELECT *, DATE_FORMAT(Donation_Date, "%M %d, %Y") AS New_Donation_Date from donations WHERE Donor_ID = ?`,
      [Donor_ID],
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

// Get donation by ID
const getDonationByID = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    const Donation_ID = parseInt(body.Donation_ID);

    db.query(
      `SELECT *, DATE_FORMAT(Donation_Date, "%M %d, %Y") AS New_Donation_Date from donations WHERE Donation_ID = ?`,
      [Donation_ID],
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

// Get all donations
const getDonationRevenue = (req, res) => {
  db.query(
    `SELECT SUM(Amount_Donated) AS Donation_Sum FROM museum.donations;`,
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

module.exports = {
  addDonation,
  getDonations,
  getCustomerDonations,
  getDonationByID,
  getDonationRevenue,
};
