const pool = require("../config/db.js");

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
      const {
        collection_name,
        collection_description,
        collections_department,
        collection_curator_ID,
      } = data;
      pool.query(
        "INSERT INTO collections(collection_name, collection_description, collections_department, collection_curator_ID) VALUES (?, ?, ?, ?)",
        [
          collection_name,
          collection_description,
          collections_department,
          collection_curator_ID,
        ],
        (error, results) => {
          if (error) {
            console.error("Error adding collection:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal server error" }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ message: "Collection added successfully" }),
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
const updateCollection = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("Update request body:", data); // Log the request body
      const {
        new_collection_name,
        collection_description,
        collections_department,
        collection_curator_ID,
        collection_name,
      } = data;
      pool.query(
        "UPDATE collections SET collection_name=?, collection_description=?, collections_department=?, collection_curator_ID=?  WHERE collection_name=?",
        [
          new_collection_name,
          collection_description,
          collections_department,
          collection_curator_ID,
          collection_name,
        ],
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
            res.end(
              JSON.stringify({ message: "Collection deleted successfully" }),
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
  getCollections,
  addCollection,
  updateCollection,
  deleteCollection,
};
