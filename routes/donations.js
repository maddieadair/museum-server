const http = require("http");
const mysql = require("mysql");
const db = require("../config/db");

// Add new donation
const addDonation = (req, res) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });

    req.on("end", () => {
      const body = JSON.parse(data);
      const { Amount_Donated, Donation_Note, Donor_ID } = body;

      db.query(
        "INSERT INTO donations(Amount_Donated, Donation_Note, Donor_ID) VALUES (?, ?, ?)",
        [Amount_Donated, Donation_Note, Donor_ID],
        (error) => {
          if (error) {
            console.log(error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Error adding donation!" }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ message: "Donation added successfully" }),
            );
          }
        },
      );
    });
};

module.exports = {
    addDonation,
};
