const http = require("http");
const { parse } = require("url");
const mysql = require("mysql");

const pool = mysql.createPool({
  host: "mysql-museum.mysql.database.azure.com",
  user: "admin01",
  password: "bananafish1!",
  database: "museum",
  port: "3306",
  timezone : "+00:00"
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
  } else if (pathname === "/user-donations" && req.method === "POST") {
    getUserDonations(req, res);

  } else if (pathname === "/exhibitions" && req.method === "GET") {
    getExhibitions(req, res);
  } else if (pathname === "/ordered-exhibitions" && req.method === "GET") {
    getOrderedExhibitions(req, res);
  } else if (pathname === "/exhibitions" && req.method === "POST") {
    addExhibition(req, res);
  } else if (pathname === "/exhibitions" && req.method === "PUT") {
    updateExhibition(req, res);
  } else if (pathname === "/exhibitions" && req.method === "DELETE") {
    deleteExhibition(req, res);
  } else if (pathname === "/exhibitions-three" && req.method === "GET") {
    getCurrentThreeExhibitions(req, res);
} else if (pathname === "/get-exhibition" && req.method === "POST") {
    getAnExhibition(req, res);

  } else if (pathname === "/users" && req.method === "GET") {
    getUsers(req, res);
  } else if (pathname === "/getUser" && req.method === "GET") {
    getAUser(req, res);
  } else if (pathname === "/users" && req.method === "POST") {
    addUser(req, res);
  } else if (pathname === "/users" && req.method === "PUT") {
    updateUser(req, res);
  } else if (pathname === "/users" && req.method === "DELETE") {
    deleteUser(req, res);

  } else if (pathname === "/departments" && req.method === "GET") {
    getDepartments(req, res);
  } else if (pathname === "/departments" && req.method === "POST") {
    addDepartment(req, res);
  } else if (pathname === "/departments" && req.method === "PUT") {
    updateDepartment(req, res);
  } else if (pathname === "/departments" && req.method === "DELETE") {
    deleteDepartment(req, res);

  } else if (pathname === "/collections" && req.method === "GET") {
    getCollections(req, res);
  } else if (pathname === "/collections" && req.method === "POST") {
    addCollection(req, res);
  } else if (pathname === "/collections" && req.method === "PUT") {
    updateCollection(req, res);
  } else if (pathname === "/collections" && req.method === "DELETE") {
    deleteCollection(req, res);

  } else if (pathname === "/tickets" && req.method === "GET") {
    getTickets(req, res);
  } else if (pathname === "/tickets" && req.method === "DELETE") {
    deleteTicket(req, res);
  } else if (pathname === "/tickets" && req.method === "PUT") {
    updateTicket(req, res);
  } else if (pathname === "/tickets" && req.method === "POST") {
    addTicket(req, res);
  } else if (pathname === "/user-tickets" && req.method === "POST") {
    getUserTickets(req, res);



  } else if (pathname === "/employees" && req.method === "GET") {
    getEmployees(req, res);
  } else if (pathname === "/employees" && req.method === "DELETE") {
    deleteEmployee(req, res);
  } else if (pathname === "/employees" && req.method === "PUT") {
    updateEmployee(req, res);
  } else if (pathname === "/employees" && req.method === "POST") {
    addEmployee(req, res);

  } else if (pathname === "/artworks" && req.method === "GET") {
    getArtworks(req, res);
  } else if (pathname === "/artworks" && req.method === "DELETE") {
    deleteArtwork(req, res);
  } else if (pathname === "/artworks" && req.method === "PUT") {
    updateArtwork(req, res);
  } else if (pathname === "/artworks" && req.method === "POST") {
    updateArtwork(req, res);
} else if (pathname === "/exhibition-art" && req.method === "POST") {
    getExhibArt(req, res);

  } else if (pathname === "/gift-log" && req.method === "GET") {
    getTicketTransactions(req, res);
  } else if (pathname === "/user-gifts" && req.method === "POST") {
    getUserGifts(req, res);
  } else if (pathname === "/gift-log" && req.method === "DELETE") {
    deleteGiftTransaction(req, res);
  } else if (pathname === "/gift-log" && req.method === "PUT") {
    updateGiftTransaction(req, res);
  } else if (pathname === "/gift-log" && req.method === "POST") {
    addGiftTransaction(req, res);

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


  // ------------------------------------------------ EXHIBITIONS ------------------------------------------------

    // GET
    const getExhibitions = (req, res) => {
        pool.query(`SELECT Exhibit_Name, Curator_ID, Description, DATE_FORMAT(Opening_Date, "%M %d, %Y") AS New_Open_Date, DATE_FORMAT(End_Date, "%M %d, %Y") AS New_End_Date FROM exhibitions;`, (error, results) => {
            if (error) {
            console.error("Error getting exhibtions:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal server error" }));
          } else {
            console.log("Sending exhibitions:", results);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(results));
          }
        });
      };

  // GET
  const getOrderedExhibitions = (req, res) => {
    pool.query(`SELECT Exhibit_Name, Curator_ID, Description, DATE_FORMAT(Opening_Date, "%M %d, %Y") AS New_Open_Date, DATE_FORMAT(End_Date, "%M %d, %Y") AS New_End_Date FROM exhibitions ORDER BY Opening_Date ASC;`, (error, results) => {
        if (error) {
        console.error("Error getting ordered exhibtions:", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Internal server error" }));
      } else {
        console.log("Sending ordered exhibitions:", results);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(results));
      }
    });
  };


  // GET
  const getCurrentThreeExhibitions = (req, res) => {
    pool.query(`SELECT Exhibit_Name, Curator_ID, Description, DATE_FORMAT(Opening_Date, "%M %d, %Y") AS New_Open_Date, DATE_FORMAT(End_Date, "%M %d, %Y") AS New_End_Date FROM exhibitions
    WHERE (CURDATE() >= Opening_Date AND (CURDATE() <= End_Date OR End_Date IS NULL))
    ORDER BY Opening_Date ASC
    LIMIT 3;`, (error, results) => {
        if (error) {
        console.error("Error getting top 3 current exhibitions:", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Internal server error" }));
      } else {
        console.log("Sending top 3 current exhibitions:", results);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(results));
      }
    });
  };

    // GET
    const getAnExhibition = (req, res) => {
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
              "SELECT * FROM exhibitions WHERE Exhibit_Name = ?",
              [Exhibit_Name],
              (error, results) => {
                if (error) {
                  console.error("Error getting exhibition:", error);
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
const addExhibition = (req, res) => {
    let body = "";
  
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
  
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        console.log("POST request body:", data); // Log the request body
        const { Exhibit_Name, Curator_ID, Description, Opening_Date, End_Date } = data;
        pool.query(
          "INSERT INTO exhibitions(Exhibit_Name, Curator_ID, Description, Opening_Date, End_Date) VALUES (?, ?, ?, ?, ?)",
          [Exhibit_Name, Curator_ID, Description, Opening_Date, End_Date],
          (error, results) => {
            if (error) {
              console.error("Error adding exhibition:", error);
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ message: "Internal server error" }));
            } else {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ message: "Exhibition added successfully" }));
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
      console.log("DELETE request body:", data); 
      const { Exhibit_Name } = data;
      pool.query(
        "DELETE FROM exhibitions WHERE Exhibit_Name=?",
        [Exhibit_Name],
        (error, results) => {
          if (error) {
            console.error("Error deleting exhibition:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal server error" }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Exhibition deleted successfully" }));
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
  const updateExhibition = (req, res) => {
    let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("PUT request body:", data); 
      const { New_Exhibit_Name, Curator_ID, Description, Opening_Date, End_Date, Exhibit_Name } = data;
      pool.query(
        "UPDATE exhibitions SET Exhibit_Name=?, Curator_ID=?, Description=?, Opening_Date=?, End_Date=? WHERE Exhibit_Name=?",
        [New_Exhibit_Name, Curator_ID, Description, Opening_Date, End_Date, Exhibit_Name],
        (error, results) => {
          if (error) {
            console.error("Error updating exhibition:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal server error" }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Exhibition updated successfully" }));
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
        const { User_First_Name, User_Last_Name, User_Email, User_Password, User_Address, User_City, User_State, User_Zipcode, isAdmin } = data;
        pool.query(
          "INSERT INTO users(User_First_Name, User_Last_Name, User_Email, User_Password, User_Address, User_City, User_State, User_Zipcode, isAdmin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [User_First_Name, User_Last_Name, User_Email, User_Password, User_Address, User_City, User_State, User_Zipcode, isAdmin],
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
            const { User_First_Name, User_Last_Name, User_Email, User_Password, User_Address, User_City, User_State, User_Zipcode, User_ID } = data;
            pool.query(
              "UPDATE users SET User_First_Name=?, User_Last_Name=?, User_Email=?, User_Password=?, User_Address=?, User_City=?, User_State=?, User_Zipcode=? WHERE User_ID=?",
              [ User_First_Name, User_Last_Name, User_Email, User_Password, User_Address, User_City, User_State, User_Zipcode, User_ID],
              (error, results) => {
                if (error) {
                  console.error("Error updating user:", error);
                  res.writeHead(500, { "Content-Type": "application/json" });
                  res.end(JSON.stringify({ message: "Internal server error" }));
                } else {
                  res.writeHead(200, { "Content-Type": "application/json" });
                  res.end(
                    JSON.stringify({ message: "User updated successfully" }),
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
        const { department_name, manager_start_date, department_manager_id, Department_Description } = data;
        pool.query(
          "INSERT INTO department(department_name, manager_start_date, department_manager_id, Department_Description) VALUES (?, ?, ?, ?)",
          [department_name, manager_start_date, department_manager_id, Department_Description],
          (error, results) => {
            if (error) {
              console.error("Error adding department:", error);
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ message: "Internal server error" }));
            } else {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ message: "Department added successfully" }));
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
            const { new_department_name, manager_start_date, department_manager_id, Department_Description, department_name } = data;
            pool.query(
              "UPDATE department SET department_name=?, manager_start_date=?, department_manager_id=?, Department_Description=?  WHERE department_name=?",
              [ new_department_name, manager_start_date, department_manager_id, Department_Description, department_name],
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
              res.end(JSON.stringify({ message: "Department deleted successfully" }));
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




  // ------------------------------------------------ COLLECTIONS ------------------------------------------------

// GET
const getCollections = (req, res) => {
    pool.query("SELECT * from collections", (error, results) => {
      if (error) {
        console.error("Error getting collections:", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Internal server error" }));
      } else {
        console.log("Sending collections:", results);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(results));
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
        console.log("POST request body:", data);
        const { collection_name, collection_description, collections_department, collection_curator_ID } = data;
        pool.query(
          "INSERT INTO collections(collection_name, collection_description, collections_department, collection_curator_ID) VALUES (?, ?, ?, ?)",
          [collection_name, collection_description, collections_department, collection_curator_ID],
          (error, results) => {
            if (error) {
              console.error("Error adding collection:", error);
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ message: "Internal server error" }));
            } else {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ message: "Collection added successfully" }));
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
    const updateCollection = (req, res) => {
        let body = "";
      
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
      
        req.on("end", () => {
          try {
            const data = JSON.parse(body);
            console.log("Update request body:", data); // Log the request body
            const { new_collection_name, collection_description, collections_department, collection_curator_ID, collection_name } = data;
            pool.query(
              "UPDATE collections SET collection_name=?, collection_description=?, collections_department=?, collection_curator_ID=?  WHERE collection_name=?",
              [ new_collection_name, collection_description, collections_department, collection_curator_ID, collection_name],
              (error, results) => {
                if (error) {
                  console.error("Error updating collection:", error);
                  res.writeHead(500, { "Content-Type": "application/json" });
                  res.end(JSON.stringify({ message: "Internal server error" }));
                } else {
                  res.writeHead(200, { "Content-Type": "application/json" });
                  res.end(
                    JSON.stringify({ message: "Collection updated successfully" }),
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
        console.log("DELETE request body:", data);
        const { collection_name } = data;
        pool.query(
          "DELETE from collections WHERE collection_name=?",
          [collection_name],
          (error, results) => {
            if (error) {
              console.error("Error deleting collection:", error);
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ message: "Internal server error" }));
            } else {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ message: "Collection deleted successfully" }));
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
        const { Total_Price, Transaction_Date, Ticket_Date, Ticket_Time, Customer_ID, Num_Child_Tickets, Num_Teen_Tickets, Num_Adult_Tickets, Num_Senior_Tickets, Exhibition_Name } = data;
        pool.query(
          "INSERT INTO tickets(Total_Price, Transaction_Date, Ticket_Date, Ticket_Time, Customer_ID, Num_Child_Tickets, Num_Teen_Tickets, Num_Adult_Tickets, Num_Senior_Tickets, Exhibition_Name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [ Total_Price, Transaction_Date, Ticket_Date, Ticket_Time, Customer_ID, Num_Child_Tickets, Num_Teen_Tickets, Num_Adult_Tickets, Num_Senior_Tickets, Exhibition_Name ],
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
            const { Total_Price, Transaction_Date, Ticket_Date, Ticket_Time, Customer_ID, Num_Child_Tickets, Num_Teen_Tickets, Num_Adult_Tickets, Num_Senior_Tickets, Exhibition_Name, TicketTransaction_ID } = data;
            pool.query(
              "UPDATE tickets SET Total_Price=?, Transaction_Date=?, Ticket_Date=?, Ticket_Time=?, Customer_ID=?, Num_Child_Tickets=?, Num_Teen_Tickets=?, Num_Adult_Tickets=?, Num_Senior_Tickets=?, Exhibition_Name=? WHERE TicketTransaction_ID=?",
              [ Total_Price, Transaction_Date, Ticket_Date, Ticket_Time, Customer_ID, Num_Child_Tickets, Num_Teen_Tickets, Num_Adult_Tickets, Num_Senior_Tickets, Exhibition_Name, TicketTransaction_ID ],
              (error, results) => {
                if (error) {
                  console.error("Error updating ticket transaction:", error);
                  res.writeHead(500, { "Content-Type": "application/json" });
                  res.end(JSON.stringify({ message: "Internal server error" }));
                } else {
                  res.writeHead(200, { "Content-Type": "application/json" });
                  res.end(
                    JSON.stringify({ message: "Ticket transaction updated successfully" }),
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
              res.end(JSON.stringify({ message: "Ticket transaction deleted successfully" }));
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
            const { User_First_Name, User_Last_Name, User_Email, User_Password, User_Address, User_City, User_State, User_Zipcode, User_ID } = data;
            pool.query(
              "UPDATE users SET User_First_Name=?, User_Last_Name=?, User_Email=?, User_Password=?, User_Address=?, User_City=?, User_State=?, User_Zipcode=? WHERE User_ID=?",
              [ User_First_Name, User_Last_Name, User_Email, User_Password, User_Address, User_City, User_State, User_Zipcode, User_ID],
              (error, results) => {
                if (error) {
                  console.error("Error updating user:", error);
                  res.writeHead(500, { "Content-Type": "application/json" });
                  res.end(JSON.stringify({ message: "Internal server error" }));
                } else {
                  res.writeHead(200, { "Content-Type": "application/json" });
                  res.end(
                    JSON.stringify({ message: "User updated successfully" }),
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


// ------------------------------------------------ ARTWORKS ------------------------------------------------


  const getExhibArt = (req, res) => {
    let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("POST request body:", data); 
      const { Exhibit_Name } = data;
      pool.query(
        "SELECT artworks.Art_ID, artworks.Art_Name FROM artworks LEFT JOIN exhibitions ON artworks.Exhibit_Name = exhibitions.Exhibit_Name WHERE exhibitions.Exhibit_Name=?",
        [Exhibit_Name],
        (error, results) => {
          if (error) {
            console.error("Error getting exhibition artworks:", error);
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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Handle Cors Function To Allow Axios
const handleCors = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);

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