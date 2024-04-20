const http = require("http");
const mysql = require("mysql");
const db = require("../config/db");

// Get total revenue
const getTotalRevenue = (req, res) => {
  db.query(
    `select r1 + r2 + r3 AS Total_Revenue from
    (select COALESCE(sum(donations.Amount_Donated),0) as r1 from donations) t1,
    (select COALESCE(sum(gift_log.total_bill),0) as r2 from gift_log) t2,
    (select COALESCE(sum(tickets.Total_Bill),0) as r3 from tickets) t3;`,
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

// Get total revenue between dates
const revenueDates = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    const Begin_Date = body.Begin_Date;
    let End_Date = body.End_Date;

    if (End_Date === "") {
        End_Date = new Date().toJSON().slice(0, 10);
      }
    db.query(
      `select r1 AS donations, r2 AS gifts, r3 AS tickets, r1 + r2 + r3 AS total from
        (select COALESCE(SUM(donations.Amount_Donated),0) as r1 from donations WHERE Donation_Date BETWEEN (?) AND (?)) t1,
        (select COALESCE(SUM(gift_log.total_bill),0) as r2 from gift_log WHERE transaction_date BETWEEN (?) AND (?)) t2,
        (select COALESCE(SUM(tickets.Total_Bill),0) as r3 from tickets WHERE Transaction_Date BETWEEN (?) AND (?)) t3`,
      [
        Begin_Date,
        End_Date,
        Begin_Date,
        End_Date,
        Begin_Date,
        End_Date,
        Begin_Date,
        End_Date,
      ],
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

// Get new artists added to the museum between certain dates
const newArtists = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    const Begin_Date = body.Begin_Date;
    let End_Date = body.End_Date;

    let query = "";

    if (End_Date === "") {
      End_Date = new Date().toJSON().slice(0, 10);
    }

    db.query(
      `SELECT Artist_Fname, Artist_Lname, DATE_FORMAT(MIN(Date_Acquired), "%Y-%m-%d") AS Date_Acquired
        FROM artworks
        WHERE Date_Acquired BETWEEN  (?) AND (?) AND Artist_Fname IS NOT NULL AND Artist_Lname IS NOT NULL
        AND  NOT EXISTS (
            SELECT 1
            FROM artworks AS x
            WHERE Artist_Fname = artworks.Artist_Fname
            AND Artist_Lname = artworks.Artist_Lname
            AND Date_Acquired < (?)
            AND Artist_Fname IS NOT NULL AND Artist_Lname IS NOT NULL
        )
        GROUP BY Artist_Fname, Artist_Lname`,
      [Begin_Date, End_Date, Begin_Date],
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

// Get new artworks added to the museum between certain dates
const newArtworks = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    const Begin_Date = body.Begin_Date;
    let End_Date = body.End_Date;

    if (End_Date === "") {
      End_Date = new Date().toJSON().slice(0, 10);
    }

    db.query(
      `SELECT *, DATE_FORMAT(Date_Acquired, "%Y-%m-%d") AS New_AcqDate
        FROM artworks
        WHERE Date_Acquired BETWEEN  (?) AND (?)`,
      [Begin_Date, End_Date],
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

// Get Shop Report
const shopReport = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    const Begin_Date = body.Begin_Date;
    let End_Date = body.End_Date;

    if (End_Date === "") {
      End_Date = new Date().toJSON().slice(0, 10);
    }

    db.query(
      `SELECT gift_log.*, gifts.gift_name, DATE_FORMAT(transaction_date, "%Y-%m-%d") AS New_Date
        from gift_log, gifts WHERE gift_log.item_ID = gifts.gift_index AND transaction_date BETWEEN  (?) AND (?)`,
      [Begin_Date, End_Date],
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

// Get Shop Report
const shopReportCount = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    const Begin_Date = body.Begin_Date;
    let End_Date = body.End_Date;

    if (End_Date === "") {
      End_Date = new Date().toJSON().slice(0, 10);
    }

    db.query(
      `SELECT gift_log.item_ID, gifts.gift_name, COUNT(item_ID) AS Count
        from gift_log, gifts WHERE gift_log.item_ID = gifts.gift_index AND transaction_date BETWEEN  (?) AND (?)
        GROUP BY item_ID
        ORDER BY Count DESC`,
      [Begin_Date, End_Date],
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

// Get Shop Report
const shopReportTotal = (req, res) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
  
    req.on("end", () => {
      const body = JSON.parse(data);
      const Begin_Date = body.Begin_Date;
      let End_Date = body.End_Date;
  
      if (End_Date === "") {
        End_Date = new Date().toJSON().slice(0, 10);
      }
  
      db.query(
        `SELECT SUM(total_bill) AS Revenue from gift_log WHERE transaction_date BETWEEN (?) AND (?)`,
        [Begin_Date, End_Date],
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

// Get new artists added to the museum between certain dates
const deptNewArtists = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    const Begin_Date = body.Begin_Date;
    let End_Date = body.End_Date;
    const Department_ID = parseInt(body.Department_ID);

    let query = "";

    if (End_Date === "") {
      End_Date = new Date().toJSON().slice(0, 10);
    }

    db.query(
      `SELECT Artist_Fname, Artist_Lname, DATE_FORMAT(MIN(Date_Acquired), "%Y-%m-%d") AS Date_Acquired
          FROM artworks
          WHERE Department_ID =(?) AND Date_Acquired BETWEEN  (?) AND (?) AND Artist_Fname IS NOT NULL AND Artist_Lname IS NOT NULL
          AND  NOT EXISTS (
              SELECT 1
              FROM artworks AS x
              WHERE Artist_Fname = artworks.Artist_Fname
              AND Artist_Lname = artworks.Artist_Lname
              AND Date_Acquired < (?)
              AND Department_ID =(?)
              AND Artist_Fname IS NOT NULL AND Artist_Lname IS NOT NULL
          )
          GROUP BY Artist_Fname, Artist_Lname`,
      [Department_ID, Begin_Date, End_Date, Begin_Date, Department_ID],
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

// Get new artworks added to the museum between certain dates
const deptNewArt = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    const Begin_Date = body.Begin_Date;
    let End_Date = body.End_Date;
    const Department_ID = parseInt(body.Department_ID);

    if (End_Date === "") {
      End_Date = new Date().toJSON().slice(0, 10);
    }

    db.query(
      `SELECT *, DATE_FORMAT(Date_Acquired, "%Y-%m-%d") AS New_AcqDate
          FROM artworks
          WHERE Date_Acquired BETWEEN  (?) AND (?) AND Department_ID=(?)`,
      [Begin_Date, End_Date, Department_ID],
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

const deptExSum = (req, res) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
  
    req.on("end", () => {
      const body = JSON.parse(data);
      const Begin_Date = body.Begin_Date;
      let End_Date = body.End_Date;
      const Department_ID = parseInt(body.Department_ID);
  
      if (End_Date === "") {
        End_Date = new Date().toJSON().slice(0, 10);
      }
  
      db.query(
        `SELECT SUM(tickets.Num_Child_Tickets + tickets.Num_Teen_Tickets + tickets.Num_Adult_Tickets + tickets.Num_Senior_Tickets) AS Total_Tickets, SUM(tickets.Total_Bill) AS Total_Revenue, SUM(tickets.Num_Child_Tickets) AS Child_Tix, SUM(tickets.Num_Teen_Tickets) AS Teen_Tix, SUM(tickets.Num_Adult_Tickets) AS Adult_Tix, SUM(tickets.Num_Senior_Tickets) AS Senior_Tix, SUM(Total_Bill) AS Total_Revenue from exhibitions left join tickets on tickets.Exhibition_Name = exhibitions.Exhibit_Name WHERE exhibitions.Exhibition_Department = (?) AND Transaction_Date BETWEEN (?) AND (?)`,
        [Department_ID, Begin_Date, End_Date],
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

const deptExReport = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    const Begin_Date = body.Begin_Date;
    let End_Date = body.End_Date;
    const Department_ID = parseInt(body.Department_ID);

    if (End_Date === "") {
      End_Date = new Date().toJSON().slice(0, 10);
    }

    db.query(
      `SELECT exhibitions.Exhibit_Name, exhibitions.Exhibit_ID, SUM(tickets.Num_Child_Tickets + tickets.Num_Teen_Tickets + tickets.Num_Adult_Tickets + tickets.Num_Senior_Tickets) AS Total_Tickets, SUM(tickets.Total_Bill) AS Total_Revenue, SUM(tickets.Num_Child_Tickets) AS Child_Tix, SUM(tickets.Num_Teen_Tickets) AS Teen_Tix, SUM(tickets.Num_Adult_Tickets) AS Adult_Tix, SUM(tickets.Num_Senior_Tickets) AS Senior_Tix, SUM(Total_Bill) AS Total_Revenue from exhibitions left join tickets on tickets.Exhibition_Name = exhibitions.Exhibit_Name WHERE exhibitions.Exhibition_Department = (?) AND Transaction_Date BETWEEN (?) AND (?) group by exhibitions.Exhibit_Name`,
      [Department_ID, Begin_Date, End_Date],
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

const deptExTickets = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    const Begin_Date = body.Begin_Date;
    let End_Date = body.End_Date;
    const Department_ID = parseInt(body.Department_ID);

    if (End_Date === "") {
      End_Date = new Date().toJSON().slice(0, 10);
    }

    db.query(
      `select tickets.*, DATE_FORMAT(Transaction_Date, "%Y-%m-%d") AS New_Transaction_Date, DATE_FORMAT(Ticket_Date, "%Y-%m-%d") AS New_Date, customers.Customer_Fname, customers.Customer_Lname, SUM(tickets.Num_Child_Tickets + tickets.Num_Teen_Tickets + tickets.Num_Adult_Tickets + tickets.Num_Senior_Tickets) AS Ticket_Count from tickets left join exhibitions on tickets.Exhibition_Name = exhibitions.Exhibit_Name left join customers on tickets.Customer_ID = customers.Customer_ID WHERE exhibitions.Exhibition_Department = (?) AND Transaction_Date BETWEEN (?) AND (?) AND tickets.Customer_ID = customers.Customer_ID GROUP BY tickets.TicketTransaction_ID`,
      [Department_ID, Begin_Date, End_Date],
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


const curatorExhibitReport = (req, res) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
  
    req.on("end", () => {
      const body = JSON.parse(data);
      const Begin_Date = body.Begin_Date;
      let End_Date = body.End_Date;
      const Curator_ID = parseInt(body.Curator_ID);
  
      if (End_Date === "") {
        End_Date = new Date().toJSON().slice(0, 10);
      }
  
      db.query(
        `select exhibitions.Exhibit_Name, exhibitions.Exhibit_ID, SUM(tickets.Num_Child_Tickets + tickets.Num_Teen_Tickets + tickets.Num_Adult_Tickets + tickets.Num_Senior_Tickets) AS Total_Tickets, SUM(tickets.Total_Bill) AS Total_Revenue, SUM(tickets.Num_Child_Tickets) AS Child_Tix, SUM(tickets.Num_Teen_Tickets) AS Teen_Tix, SUM(tickets.Num_Adult_Tickets) AS Adult_Tix, SUM(tickets.Num_Senior_Tickets) AS Senior_Tix, SUM(Total_Bill) AS Total_Revenue from exhibitions left join tickets on tickets.Exhibition_Name = exhibitions.Exhibit_Name WHERE exhibitions.Curator_ID = (?) AND Transaction_Date BETWEEN (?) AND (?) group by exhibitions.Exhibit_Name`,
        [Curator_ID, Begin_Date, End_Date],
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

  const curatorExSum = (req, res) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
  
    req.on("end", () => {
      const body = JSON.parse(data);
      const Begin_Date = body.Begin_Date;
      let End_Date = body.End_Date;
      const Curator_ID = parseInt(body.Curator_ID);
  
      if (End_Date === "") {
        End_Date = new Date().toJSON().slice(0, 10);
      }
  
      db.query(
        `select SUM(tickets.Num_Child_Tickets + tickets.Num_Teen_Tickets + tickets.Num_Adult_Tickets + tickets.Num_Senior_Tickets) AS Total_Tickets, SUM(tickets.Total_Bill) AS Total_Revenue, SUM(tickets.Num_Child_Tickets) AS Child_Tix, SUM(tickets.Num_Teen_Tickets) AS Teen_Tix, SUM(tickets.Num_Adult_Tickets) AS Adult_Tix, SUM(tickets.Num_Senior_Tickets) AS Senior_Tix, SUM(Total_Bill) AS Total_Revenue from exhibitions left join tickets on tickets.Exhibition_Name = exhibitions.Exhibit_Name WHERE exhibitions.Curator_ID = (?) AND Transaction_Date BETWEEN (?) AND (?)
        `,
        [Curator_ID, Begin_Date, End_Date],
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
  
  const curatorTicketReport = (req, res) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
  
    req.on("end", () => {
      const body = JSON.parse(data);
      const Begin_Date = body.Begin_Date;
      let End_Date = body.End_Date;
      const Curator_ID = parseInt(body.Curator_ID);
  
      if (End_Date === "") {
        End_Date = new Date().toJSON().slice(0, 10);
      }
  
      db.query(
        `select tickets.*, DATE_FORMAT(Transaction_Date, "%Y-%m-%d") AS New_Transaction_Date, DATE_FORMAT(Ticket_Date, "%Y-%m-%d") AS New_Date, customers.Customer_Fname, customers.Customer_Lname, SUM(tickets.Num_Child_Tickets + tickets.Num_Teen_Tickets + tickets.Num_Adult_Tickets + tickets.Num_Senior_Tickets) AS Ticket_Count from tickets left join exhibitions on tickets.Exhibition_Name = exhibitions.Exhibit_Name left join customers on tickets.Customer_ID = customers.Customer_ID WHERE exhibitions.Curator_ID = (?) AND Transaction_Date BETWEEN (?) AND (?) AND tickets.Customer_ID = customers.Customer_ID GROUP BY tickets.TicketTransaction_ID`,
        [Curator_ID, Begin_Date, End_Date],
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

module.exports = {
  getTotalRevenue,
  revenueDates,
  newArtists,
  newArtworks,
  shopReport,
  shopReportCount,
  deptNewArtists,
  deptNewArt,
  deptExReport,
  deptExTickets,
  curatorExhibitReport,
  curatorTicketReport,
  shopReportTotal,
  curatorExSum,
  deptExSum
};
