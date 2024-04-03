const http = require("http");
const mysql = require("mysql");
const db = require("../config/db");

// Get all exhibitions
const getExhibitions = (req, res) => {
  db.query(
    `SELECT exhibitions.*, department.department_name, employees.employee_fname AS curator_fname, employees.employee_lname AS curator_lname, DATE_FORMAT(Opening_Date, "%M %d, %Y") AS New_Open_Date, DATE_FORMAT(End_Date, "%M %d, %Y") AS New_End_Date
    FROM exhibitions LEFT JOIN department ON exhibitions.Exhibition_Department = department.department_id 
    LEFT JOIN employees ON exhibitions.Curator_ID = employees.employee_id;`,
    (error, result) => {
      if (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: error }));
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      }
    }
  );
};

// Get Current 3 Exhibitions On View for Homepage
const exhibitionsPreview = (req, res) => {
  db.query(
    `SELECT Exhibit_Name, Exhibit_ID, Curator_ID, Description, Exhibition_Department, Tickets_Sold, DATE_FORMAT(Opening_Date, "%M %d, %Y") AS New_Open_Date, DATE_FORMAT(End_Date, "%M %d, %Y") AS New_End_Date FROM exhibitions
            WHERE (CURDATE() >= Opening_Date AND (CURDATE() <= End_Date OR End_Date IS NULL))
            ORDER BY Opening_Date ASC
            LIMIT 3;`,
    (error, result) => {
      if (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: error }));
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      }
    }
  );
};

// Get all exhibitions in date order
const orderedExhibitions = (req, res) => {
  db.query(
    `SELECT Exhibit_Name, Exhibit_ID, Curator_ID, Description, Exhibition_Department, Tickets_Sold, DATE_FORMAT(Opening_Date, "%M %d, %Y") AS New_Open_Date, DATE_FORMAT(End_Date, "%M %d, %Y") AS New_End_Date FROM exhibitions ORDER BY Opening_Date ASC;`,
    (error, result) => {
      if (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: error }));
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      }
    }
  );
};

// Get Exhibition by ID
const getExhibitionByID = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    const Exhibit_ID = parseInt(body.Exhibit_ID);

    db.query(
      `SELECT exhibitions.*, department.department_name, employees.employee_fname AS curator_fname, employees.employee_lname AS curator_lname, DATE_FORMAT(Opening_Date, "%M %d, %Y") AS New_Open_Date, DATE_FORMAT(End_Date, "%M %d, %Y") AS New_End_Date
      FROM exhibitions LEFT JOIN department ON exhibitions.Exhibition_Department = department.department_id 
      LEFT JOIN employees ON exhibitions.Curator_ID = employees.employee_id 
      WHERE exhibitions.Exhibit_ID = ?;`,
      [Exhibit_ID],
      (error, result) => {
        if (error) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: error }));
        } else {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(result));
        }
      }
    );
  });
};

module.exports = {
  getExhibitions,
  exhibitionsPreview,
  orderedExhibitions,
  getExhibitionByID,
};
