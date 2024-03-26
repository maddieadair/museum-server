const http = require("http");
const { parse } = require("url");
const mysql = require("mysql");

const pool = mysql.createPool({
  host: "mysql-museum.mysql.database.azure.com",
  user: "admin01",
  password: "bananafish1!",
  database: "museum",
  port: "3306",
});

const server = http.createServer((req, res) => {
  handleCors(req, res);

  const { pathname } = parse(req.url);

  if (pathname === "/gift-items" && req.method === "PUT") {
    updateGiftItem(req, res);
  } else if (pathname === "/gift-items" && req.method === "GET") {
    getGiftItems(req, res);
  } else if (pathname === "/gift-items" && req.method === "POST") {
    addGiftItem(req, res);
  } else if (pathname === "/gift-items" && req.method === "DELETE") {
    deleteGiftItem(req, res);

  } else if (pathname === "/donations" && req.method === "GET") {
    getDonations(req, res);
  } else if (pathname === "/donations" && req.method === "PUT") {
    updateDonation(req, res);
  } else if (pathname === "/donations" && req.method === "POST") {
    addDonation(req, res);
  } else if (pathname === "/donations" && req.method === "DELETE") {
    deleteDonation(req, res);
  } else if (pathname === "/userDonations" && req.method === "GET") {
    getUserDonations(req, res);

  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found" }));
  }
});


// ------------------------------------------------ GIFT ITEMS ------------------------------------------------

// GET
const getGiftItems = (req, res) => {
    pool.query("SELECT * FROM gifts", (error, results) => {
      if (error) {
        console.error("Error getting gift items:", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Internal server error" }));
      } else {
        console.log("Sending gift items:", results); 
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(results));
      }
    });
  };


  // PUT
const addGiftItem = (req, res) => {
    let body = "";

    req.on("data", (chunk) => {
        body += chunk.toString();
    });

    req.on("end", () => {
        try {
        const data = JSON.parse(body);
        console.log("Update request body:", data); // Log the request body
        const {
            gift_name,
            gift_price,
            gift_currStock
        } = data;
        pool.query(
            "INSERT into gifts(gift_name, gift_price, gift_currStock) VALUES(?, ?, ?)",
            [
                gift_name,
                gift_price,
                gift_currStock
            ],
            (error, results) => {
            if (error) {
                console.error("Error adding gift item:", error);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Internal server error" }));
            } else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(
                JSON.stringify({ message: "Gift item added successfully" }),
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
const updateGiftItem = (req, res) => {
    let body = "";

    req.on("data", (chunk) => {
        body += chunk.toString();
    });

    req.on("end", () => {
        try {
        const data = JSON.parse(body);
        console.log("Update request body:", data); // Log the request body
        const {
            gift_name,
            gift_price,
            gift_index
        } = data;
        pool.query(
            "UPDATE gifts SET gift_name=?, gift_price=? WHERE gift_index=?",
            [
                gift_name,
                gift_price,
                gift_index
            ],
            (error, results) => {
            if (error) {
                console.error("Error updating gift item:", error);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Internal server error" }));
            } else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(
                JSON.stringify({ message: "Gift item updated successfully" }),
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
const deleteGiftItem = (req, res) => {
    let body = "";
  
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
  
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        console.log("DELETE request body:", data);
        const { gift_index } = data;
        pool.query(
          "DELETE from gifts WHERE gift_index=?",
          [gift_index],
          (error, results) => {
            if (error) {
              console.error("Error deleting gift item:", error);
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ message: "Internal server error" }));
            } else {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ message: "Gift item deleted successfully" }));
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

  
// ------------------------------------------------ DONATIONS ------------------------------------------------

// GET
  const getDonations = (req, res) => {
    pool.query("SELECT donations.Donation_ID, donations.Amount_Donated, donations.Donation_Note, donations.Donation_Date, donations.Donor_ID, users.User_First_Name, users.User_Last_Name FROM donations, users WHERE donations.Donor_ID = users.User_ID", (error, results) => {
      if (error) {
        console.error("Error getting donations:", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Internal server error" }));
      } else {
        console.log("Sending donations:", results);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(results));
      }
    });
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
            const {
              Amount_Donated,
              Donation_Note,
              Donation_Date,
              Donation_ID
            } = data;
            pool.query(
              "UPDATE donations SET Amount_Donated=?, Donation_Note=?, Donation_Date=? WHERE Donation_ID=?",
              [
                Amount_Donated,
                Donation_Note,
                Donation_Date,
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
              res.end(JSON.stringify({ message: "Donation deleted successfully" }));
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


 
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Handle Cors Function To Allow Axios
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
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
