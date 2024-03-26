const pool = require("../config/db.js");

// ------------------------------------------------ EXHIBITIONS ------------------------------------------------

// GET
const getExhibitions = (req, res) => {
  pool.query("SELECT * FROM exhibitions", (error, results) => {
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
const getCurrentThreeExhibitions = (req, res) => {
  pool.query("SELECT * FROM exhibitions LIMIT 3", (error, results) => {
    if (error) {
      console.error("Error getting top 3 current exhibtions:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Internal server error" }));
    } else {
      console.log("Sending top 3 current exhibitions:", results);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(results));
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
      const { Exhibit_Name, Curator_ID, Description, Opening_Date, End_Date } =
        data;
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
            res.end(
              JSON.stringify({ message: "Exhibition added successfully" }),
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
            res.end(
              JSON.stringify({ message: "Exhibition deleted successfully" }),
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
const updateExhibition = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("PUT request body:", data);
      const {
        New_Exhibit_Name,
        Curator_ID,
        Description,
        Opening_Date,
        End_Date,
        Exhibit_Name,
      } = data;
      pool.query(
        "UPDATE exhibitions SET Exhibit_Name=?, Curator_ID=?, Description=?, Opening_Date=?, End_Date=? WHERE Exhibit_Name=?",
        [
          New_Exhibit_Name,
          Curator_ID,
          Description,
          Opening_Date,
          End_Date,
          Exhibit_Name,
        ],
        (error, results) => {
          if (error) {
            console.error("Error updating exhibition:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal server error" }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ message: "Exhibition updated successfully" }),
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
  getExhibitions,
  getCurrentThreeExhibitions,
  addExhibition,
  deleteExhibition,
  updateExhibition,
};
