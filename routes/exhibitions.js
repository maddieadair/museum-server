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
    },
  );
};

// Get future exhibitions
const getFutureExhibitions = (req, res) => {
  db.query(
    `SELECT exhibitions.*, department.department_name, employees.employee_fname AS curator_fname, employees.employee_lname AS curator_lname, DATE_FORMAT(Opening_Date, "%M %d, %Y") AS New_Open_Date, DATE_FORMAT(End_Date, "%M %d, %Y") AS New_End_Date
      FROM exhibitions LEFT JOIN department ON exhibitions.Exhibition_Department = department.department_id 
      LEFT JOIN employees ON exhibitions.Curator_ID = employees.employee_id WHERE exhibitions.Opening_Date > CURDATE() ORDER BY Opening_Date ASC`,
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

// Get future exhibitions
const getPastExhibitions = (req, res) => {
  db.query(
    `SELECT exhibitions.*, department.department_name, employees.employee_fname AS curator_fname, employees.employee_lname AS curator_lname, DATE_FORMAT(Opening_Date, "%M %d, %Y") AS New_Open_Date, DATE_FORMAT(End_Date, "%M %d, %Y") AS New_End_Date
        FROM exhibitions LEFT JOIN department ON exhibitions.Exhibition_Department = department.department_id 
        LEFT JOIN employees ON exhibitions.Curator_ID = employees.employee_id WHERE exhibitions.isArchived = 1 ORDER BY Opening_Date ASC;`,
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

// Get current exhibitions + future ones that open within 3 months
const getOneMonthExhibits = (req, res) => {
  db.query(
    `SELECT exhibitions.*, department.department_name, employees.employee_fname AS curator_fname, employees.employee_lname AS curator_lname, DATE_FORMAT(Opening_Date, "%M %d, %Y") AS New_Open_Date, DATE_FORMAT(End_Date, "%M %d, %Y") AS New_End_Date
      FROM exhibitions LEFT JOIN department ON exhibitions.Exhibition_Department = department.department_id 
      LEFT JOIN employees ON exhibitions.Curator_ID = employees.employee_id WHERE exhibitions.Opening_Date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 3 MONTH);`,
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

// Get current exhibitions
const getCurrentExhibitions = (req, res) => {
  db.query(
    `SELECT exhibitions.*, department.department_name, employees.employee_fname AS curator_fname, employees.employee_lname AS curator_lname, DATE_FORMAT(Opening_Date, "%M %d, %Y") AS New_Open_Date, DATE_FORMAT(End_Date, "%M %d, %Y") AS New_End_Date
      FROM exhibitions LEFT JOIN department ON exhibitions.Exhibition_Department = department.department_id 
      LEFT JOIN employees ON exhibitions.Curator_ID = employees.employee_id WHERE exhibitions.Opening_Date <= CURDATE() AND exhibitions.End_Date > CURDATE() ORDER BY Opening_Date ASC`,
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
    },
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
    },
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
      },
    );
  });
};

// Get Exhibitions by Department
const getDeptExhibits = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    const Exhibition_Department = parseInt(body.Exhibition_Department);

    db.query(
      `SELECT exhibitions.*, department.department_name, employees.employee_fname AS curator_fname, employees.employee_lname AS curator_lname, DATE_FORMAT(Opening_Date, "%M %d, %Y") AS New_Open_Date, DATE_FORMAT(End_Date, "%M %d, %Y") AS New_End_Date
        FROM exhibitions LEFT JOIN department ON exhibitions.Exhibition_Department = department.department_id 
        LEFT JOIN employees ON exhibitions.Curator_ID = employees.employee_id 
        WHERE exhibitions.Exhibition_Department = (?);`,
      [Exhibition_Department],
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

// Get an Employee's Exhibitions
const employeeExhibitions = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    const Curator_ID = parseInt(body.Curator_ID);

    db.query(
      `SELECT *, DATE_FORMAT(Opening_Date, "%M %d, %Y") AS New_Open_Date, DATE_FORMAT(End_Date, "%M %d, %Y") AS New_End_Date from exhibitions WHERE exhibitions.Curator_ID = ?`,
      [Curator_ID],
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

// Add Exhibition
const addExhibition = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    const Exhibit_Name = body.Exhibit_Name;
    let Curator_ID = body.Curator_ID !== "" ? parseInt(body.Curator_ID) : null;
    const Description = body.Description;
    let Opening_Date = body.Opening_Date;
    let End_Date = body.End_Date;
    const Exhibition_Department = parseInt(body.Exhibition_Department);

    if (Opening_Date === "") {
      Opening_Date = null;
    }

    if (End_Date === "") {
      End_Date === null;
    }

    console.log("body", body);

    db.query(
      `INSERT INTO exhibitions(Exhibit_Name, Curator_ID, Description, Opening_Date, End_Date, Exhibition_Department) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        Exhibit_Name,
        Curator_ID,
        Description,
        Opening_Date,
        End_Date,
        Exhibition_Department,
      ],
      (error, result) => {
        if (error) {
          console.log(error);
          if (
            error.sqlMessage === "Closing Date cannot be before Opening Date"
          ) {
            console.log(error);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: "Closing Date cannot be before Opening Date",
              }),
            );
          } else if (
            error.sqlMessage === "Opening/Closing Date cannot be before today"
          ) {
            console.log(error);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: "Opening/Closing Date cannot be before today",
              }),
            );
          } else {
            console.log(error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: error }));
          }
        } else {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ message: "Exhibition successfully added!" }),
          );
        }
      },
    );
  });
};

// Archive Exhibition
const archiveExhibition = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    const Exhibit_ID = parseInt(body.Exhibit_ID);
    db.query(
      `UPDATE exhibitions SET isArchived = 1 WHERE Exhibit_ID =?`,
      [Exhibit_ID],
      (error, result) => {
        if (error) {
          console.log(error);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Error archiving exhibition" }));
        } else {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ message: "Exhibition archived successfully" }),
          );
        }
      },
    );
  });
};

// Archive Exhibition
const deleteExhibition = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    const Exhibit_ID = parseInt(body.Exhibit_ID);
    db.query(
      `DELETE from exhibitions WHERE Exhibit_ID =?`,
      [Exhibit_ID],
      (error, result) => {
        if (error) {
          console.log(error);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: error }));
        } else {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ message: "Exhibition successfully deleted" }),
          );
        }
      },
    );
  });
};

// Update exhibition
const updateExhibition = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    const Exhibit_Name = body.Exhibit_Name;
    let Curator_ID = body.Curator_ID !== "" ? parseInt(body.Curator_ID) : null;
    const Description = body.Description;
    let Opening_Date = body.Opening_Date;
    let End_Date = body.End_Date;
    const Exhibition_Department = parseInt(body.Exhibition_Department);
    const Exhibit_ID = parseInt(body.Exhibit_ID);

    if (Opening_Date === "") {
      Opening_Date = null;
    }

    if (End_Date === "") {
      End_Date === null;
    }

    db.query(
      `UPDATE exhibitions SET Exhibit_Name = ?, Curator_ID =?, Description =?, Opening_Date =?, End_Date =?, Exhibition_Department =? WHERE Exhibit_ID =?`,
      [
        Exhibit_Name,
        Curator_ID,
        Description,
        Opening_Date,
        End_Date,
        Exhibition_Department,
        Exhibit_ID,
      ],
      (error, result) => {
        if (error) {
          if (
            error.sqlMessage === "Closing Date cannot be before Opening Date"
          ) {
            console.log(error);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: "Closing Date cannot be before Opening Date",
              }),
            );
          } else if (
            error.sqlMessage === "Opening/Closing Date cannot be before today"
          ) {
            console.log(error);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: "Opening/Closing Date cannot be before today",
              }),
            );
          } else {
            console.log(error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: error }));
          }
        } else {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ message: "Exhibition successfully updated!" }),
          );
        }
      },
    );
  });
};

// Get employee exhibition Stats
const employeeExhibitStats = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    const Curator_ID = parseInt(body.Curator_ID);

    console.log(body);

    db.query(
      `select exhibitions.*, SUM(tickets.Total_Bill) AS Total_Revenue, SUM(tickets.Num_Child_Tickets) AS Child_Tix, SUM(tickets.Num_Teen_Tickets) AS Teen_Tix, SUM(tickets.Num_Adult_Tickets) AS Adult_Tix, SUM(tickets.Num_Senior_Tickets) AS Senior_Tix, SUM(Total_Bill) AS Total_Revenue from exhibitions left join tickets on tickets.Exhibition_Name = exhibitions.Exhibit_Name WHERE exhibitions.Curator_ID = (?) AND exhibitions.isArchived = 0 group by exhibitions.Exhibit_Name;`,
      [Curator_ID],
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

// Get employee exhibition revenue
const employeeExhibitRev = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    const Curator_ID = parseInt(body.Curator_ID);

    console.log(body);

    db.query(
      `select SUM(tickets.Total_Bill) AS Total_Revenue from tickets, exhibitions WHERE tickets.Exhibition_Name = exhibitions.Exhibit_Name AND exhibitions.Curator_ID = (?) AND exhibitions.isArchived = 0`,
      [Curator_ID],
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

// Get department exhibition stats
const deptExhibitStats = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    const Exhibition_Department = parseInt(body.Exhibition_Department);

    console.log(body);

    db.query(
      `select exhibitions.*, SUM(tickets.Total_Bill) AS Total_Revenue, SUM(tickets.Num_Child_Tickets) AS Child_Tix, SUM(tickets.Num_Teen_Tickets) AS Teen_Tix, SUM(tickets.Num_Adult_Tickets) AS Adult_Tix, SUM(tickets.Num_Senior_Tickets) AS Senior_Tix, SUM(Total_Bill) AS Total_Revenue from exhibitions left join tickets on tickets.Exhibition_Name = exhibitions.Exhibit_Name WHERE exhibitions.Exhibition_Department = (?) AND exhibitions.isArchived = 0 group by exhibitions.Exhibit_Name;`,
      [Exhibition_Department],
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

// Get employee exhibition revenue
const deptExhibitRev = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    const Exhibition_Department = parseInt(body.Exhibition_Department);

    console.log(body);

    db.query(
      `select SUM(tickets.Total_Bill) AS Total_Revenue from tickets, exhibitions WHERE tickets.Exhibition_Name = exhibitions.Exhibit_Name AND exhibitions.Exhibition_Department = (?) AND exhibitions.isArchived = 0`,
      [Exhibition_Department],
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

// get exhibition stats
const allExhibitStats = (req, res) => {
  db.query(
    `select exhibitions.*, SUM(tickets.Total_Bill) AS Total_Revenue, SUM(tickets.Num_Child_Tickets) AS Child_Tix, SUM(tickets.Num_Teen_Tickets) AS Teen_Tix, SUM(tickets.Num_Adult_Tickets) AS Adult_Tix, SUM(tickets.Num_Senior_Tickets) AS Senior_Tix, SUM(Total_Bill) AS Total_Revenue from exhibitions left join tickets on tickets.Exhibition_Name = exhibitions.Exhibit_Name WHERE exhibitions.isArchived = 0 group by exhibitions.Exhibit_Name;`,
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

// get exhibition stats
const totalExhibitTickets = (req, res) => {
    db.query(
      `select exhibitions.*, SUM(tickets.Total_Bill) AS Total_Revenue, SUM(tickets.Num_Child_Tickets) AS Child_Tix, SUM(tickets.Num_Teen_Tickets) AS Teen_Tix, SUM(tickets.Num_Adult_Tickets) AS Adult_Tix, SUM(tickets.Num_Senior_Tickets) AS Senior_Tix, SUM(Total_Bill) AS Total_Revenue from exhibitions left join tickets on tickets.Exhibition_Name = exhibitions.Exhibit_Name WHERE exhibitions.isArchived = 0 group by exhibitions.Exhibit_Name;`,
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

// Get all exhibition revenue
const allExhibitRev = (req, res) => {
  db.query(
    `select SUM(tickets.Total_Bill) AS Total_Revenue from tickets, exhibitions WHERE tickets.Exhibition_Name = exhibitions.Exhibit_Name  AND exhibitions.isArchived = 0;`,
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

// get collection ticket stats
const collectionTicketStats = (req, res) => {
  db.query(
    `SELECT SUM(Num_Child_Tickets) AS Sum_Child, SUM(Num_Teen_Tickets) AS Sum_Teen, SUM(Num_Adult_Tickets) AS Sum_Adult, SUM(Num_Senior_Tickets) AS Sum_Senior, SUM(Num_Child_Tickets + Num_Teen_Tickets + Num_Adult_Tickets + Num_Senior_Tickets) AS Total_Sum FROM museum.tickets WHERE Exhibition_Name IS NULL;`,
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

// get collection ticket stats
const collectionTicketRevenue = (req, res) => {
    db.query(
      `SELECT SUM(Total_Bill) AS Total_Rev FROM museum.tickets WHERE Exhibition_Name IS NULL;`,
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

// get collection ticket stats
const exhibitTicketSum = (req, res) => {
    db.query(
        `SELECT SUM(Num_Child_Tickets) AS Sum_Child, SUM(Num_Teen_Tickets) AS Sum_Teen, SUM(Num_Adult_Tickets) AS Sum_Adult, SUM(Num_Senior_Tickets) AS Sum_Senior, SUM(Num_Child_Tickets + Num_Teen_Tickets + Num_Adult_Tickets + Num_Senior_Tickets) AS Total_Sum FROM museum.tickets WHERE Exhibition_Name IS NOT NULL`,
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
  getExhibitions,
  exhibitionsPreview,
  orderedExhibitions,
  getExhibitionByID,
  getFutureExhibitions,
  getCurrentExhibitions,
  getOneMonthExhibits,
  getPastExhibitions,
  employeeExhibitions,
  addExhibition,
  updateExhibition,
  archiveExhibition,
  employeeExhibitStats,
  employeeExhibitRev,
  getDeptExhibits,
  deleteExhibition,
  deptExhibitStats,
  deptExhibitRev,
  allExhibitStats,
  allExhibitRev,
  collectionTicketRevenue,
  collectionTicketStats,
  exhibitTicketSum
};
