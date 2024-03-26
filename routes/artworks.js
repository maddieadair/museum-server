const pool = require("../config/db.js");

// ------------------------------------------------ ARTWORKS ------------------------------------------------

// GET
const getArtworks = (req, res) => {
  pool.query("SELECT * from artworks", (error, results) => {
    if (error) {
      console.error("Error getting artworks:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Internal server error" }));
    } else {
      console.log("Sending artworks:", results);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(results));
    }
  });
};

// EVERYTHING BELOW HERE IS NOT DONE

// PUT
const updateArtwork = (req, res) => {
  console.log("updateArtwork");
};

// POST
const addArtwork = (req, res) => {
  console.log("addArtwork");
};

// DELETE
const deleteArtwork = (req, res) => {
  console.log("deleteArtwork");
};

module.exports = { getArtworks, updateArtwork, addArtwork, deleteArtwork };
