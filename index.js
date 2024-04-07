const http = require("http");
const url = require("url");
const db = require("./config/db");

const artworks = require("./routes/artworks");
const customer = require("./routes/customer");
const department = require("./routes/department");
const collections = require("./routes/collections");
const donations = require("./routes/donations");
const employee = require("./routes/employee");
const exhibitions = require("./routes/exhibitions");
const gifts = require("./routes/gifts");
const gift_log = require("./routes/gift-log");

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }
  // GET Requests
  if (req.method === "GET") {
    if (req.url === "/") {
      res.setHeader("Content-Type", "text/html");
      res.write(
        "<html><head><title>Homepage</title></head><body><h1>Homepage</h1></body></html>",
      );
      res.end();
    }

    // Get all exhibitions
    else if (req.url === "/exhibitions") {
      exhibitions.getExhibitions(req, res);

      // Get all exhibitions in date order
    } else if (req.url === "/ordered-exhibitions") {
      exhibitions.orderedExhibitions(req, res);

      // Get Current 3 Exhibitions On View for Homepage
    } else if (req.url === "/exhibitions-preview") {
      exhibitions.exhibitionsPreview(req, res);

      // Get all gifts
    } else if (req.url === "/gifts") {
      gifts.getGifts(req, res);

      // Get all collections
    } else if (req.url === "/collections") {
      collections.getCollections(req, res);

      // Get all departments
    } else if (req.url === "/departments") {
      department.getDepartments(req, res);

      // Get all artworks
    } else if (req.url === "/artworks") {
      artworks.getArtworks(req, res);

      // Get all customers
    } else if (req.url === "/customers") {
      customer.getCustomers(req, res);

      // Get all employees
    } else if (req.url === "/employees") {
      employee.getEmployees(req, res);

      // Get all gift transactions
    } else if (req.url === "/gift-log") {
      gift_log.getGiftTransactions(req, res);

      // Get shop revenue
    } else if (req.url === "/shop-revenue") {
      gift_log.getShopRevenue(req, res);

      // Get Num of Items Sold Desc order
    } else if (req.url === "/num-sold") {
      gifts.getNumSoldDesc(req, res);

      // Add gift transaction
    } else if (req.url === "/sold-out") {
      gifts.getSoldOut(req, res);

      // Get Low Stock items
    } else if (req.url === "/low-stock") {
      gifts.getLowStock(req, res);

      // Get Shop Bestsellers
    } else if (req.url === "/bestsellers") {
      gifts.getBestsellers(req, res);

      // Get Shop Worstsellers
    } else if (req.url === "/worstsellers") {
      gifts.getWorstsellers(req, res);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////

    // POST methods
  } else if (req.method === "POST") {
    // Add new donation
    if (req.url === "/donations") {
      donations.addDonation(req, res);

      // Customer login
    } else if (req.url === "/customer-login") {
      customer.customerLogin(req, res);

      // Check if customer exists already
    } else if (req.url === "/check-customer") {
      customer.checkCustomer(req, res);

      // Customer Signup
    } else if (req.url === "/customer-signup") {
      customer.customerSignup(req, res);

      // Employee Login
    } else if (req.url === "/employee-login") {
      employee.employeeLogin(req, res);

      // Get all collections in a department
    } else if (req.url === "/department-collections") {
      collections.departmentCollections(req, res);

      // Get all artworks in a collection
    } else if (req.url === "/collection-artworks") {
      artworks.collectionArtworks(req, res);

      // Get all artworks in a department
    } else if (req.url === "/department-artworks") {
      artworks.departmentArtworks(req, res);

      // Get all artworks in an exhibition
    } else if (req.url === "/exhibition-artworks") {
      artworks.exhibitionArtworks(req, res);

      // Get exhibition info by ID
    } else if (req.url === "/exhibition-ID") {
      exhibitions.getExhibitionByID(req, res);

      // Get collection info by ID
    } else if (req.url === "/collection-ID") {
      collections.getCollectionByID(req, res);

      // Get department info by ID
    } else if (req.url === "/department-ID") {
      department.getDepartmentByID(req, res);

      // Get Artwork by ID
    } else if (req.url === "/artwork-ID") {
      artworks.artworkByID(req, res);
    } else if (req.url === "/filtered-art") {
      artworks.getFilteredArt(req, res);

      // Add gift item
    } else if (req.url === "/gifts") {
      gifts.addGift(req, res);

      // Add gift transaction
    } else if (req.url === "/gift-log") {
      gift_log.addGiftTransaction(req, res);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////

    // DELETE methods
  } else if (req.method === "DELETE") {
    // Add new donation
    if (req.url === "/gifts") {
      gifts.deleteGift(req, res);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////

    // PUT methods
  } else if (req.method === "PUT") {
    // Update gift item
    if (req.url === "/gifts") {
      gifts.updateGift(req, res);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found!" }));
  }
});

// Handle Cors Function To Allow Axios
// const handleCors = (req, res) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//   res.setHeader("Access-Control-Allow-Credentials", true);

//   if (req.method === "OPTIONS") {
//     res.writeHead(200);
//     res.end();
//     return;
//   }
// };

// Set Up Server To Listen For Requests From Port 3001
const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
