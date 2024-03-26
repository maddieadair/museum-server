const pool = require("../config/db.js");

// ------------------------------------------------ DONATIONS ------------------------------------------------

// GET

const getDonations = (req, res) => {
  pool.query(
    "SELECT donations.Donation_ID, donations.Amount_Donated, donations.Donation_Note, donations.Donation_Date, donations.Donor_ID, users.User_First_Name, users.User_Last_Name FROM donations, users WHERE donations.Donor_ID = users.User_ID",
    // "SELECT * FROM donations",

    (error, results) => {
      if (error) {
        console.error("Error getting donations:", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Internal server error" }));
      } else {
        console.log("Sending donations:", results);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(results));
      }
    },
  );
};

// GET
const getUserDonations = (req, res) => {
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
        "SELECT donations.* FROM donations INNER JOIN users ON donations.Donor_ID=users.User_ID WHERE users.User_ID=?",
        [User_ID],
        (error, results) => {
          if (error) {
            console.error("Error getting user's donations:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal server error" }));
          } else {
            console.log("Sending user's donations:", results);
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
const addDonation = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("POST request body:", data);
      const { Amount_Donated, Donation_Note, Donation_Date, Donor_ID } = data;
      pool.query(
        "INSERT INTO donations(Amount_Donated, Donation_Note, Donation_Date, Donor_ID) VALUES (?, ?, ?, ?)",
        [Amount_Donated, Donation_Note, Donation_Date, Donor_ID],
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
      const { Amount_Donated, Donation_Note, Donation_Date, Donation_ID } =
        data;
      pool.query(
        "UPDATE donations SET Amount_Donated=?, Donation_Note=?, Donation_Date=? WHERE Donation_ID=?",
        [Amount_Donated, Donation_Note, Donation_Date, Donation_ID],
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
      console.log("DELETE request body:", data);
      const { Donation_ID } = data;
      pool.query(
        "DELETE from donations WHERE Donation_ID=?",
        [Donation_ID],
        (error, results) => {
          if (error) {
            console.error("Error deleting donation:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal server error" }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ message: "Donation deleted successfully" }),
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
  getDonations,
  getUserDonations,
  addDonation,
  updateDonation,
  deleteDonation,
};
