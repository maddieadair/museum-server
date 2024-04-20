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
const tickets = require("./routes/tickets");
const auth = require("./authentication/auth");
const reports = require("./routes/reports");

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    res.writeHead(204);
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

      // Get Donations
    } else if (req.url === "/donations") {
      donations.getDonations(req, res);

      // Get Tickets
    } else if (req.url === "/tickets") {
      tickets.getTickets(req, res);

      // Get Managers
    } else if (req.url === "/managers") {
      employee.getManagers(req, res);

      // Get Curators
    } else if (req.url === "/curators") {
      employee.getCurators(req, res);

      // Get Shop Managers
    } else if (req.url === "/shop-managers") {
      employee.getShopManagers(req, res);

      // Get Managers without a department
    } else if (req.url === "/new-managers") {
      employee.getNewManagers(req, res);

      // Get Current Exhibitions
    } else if (req.url === "/current-exhibits") {
      exhibitions.getCurrentExhibitions(req, res);

      // Get Future Exhibitions
    } else if (req.url === "/future-exhibits") {
      exhibitions.getFutureExhibitions(req, res);

      // Get current exhibitions and future ones that open in a month
    } else if (req.url === "/month-exhibits") {
      exhibitions.getOneMonthExhibits(req, res);

      // Get Past Exhibitions
    } else if (req.url === "/past-exhibits") {
      exhibitions.getPastExhibitions(req, res);
    } else if (req.url === "/supervisors") {
      employee.getSupervisors(req, res);
    } else if (req.url === "/exhibit-stats") {
      exhibitions.allExhibitStats(req, res);
    } else if (req.url === "/exhibit-revenue") {
      exhibitions.allExhibitRev(req, res);
    } else if (req.url === "/collection-revenue") {
      exhibitions.collectionTicketRevenue(req, res);
    } else if (req.url === "/collection-stats") {
      exhibitions.collectionTicketStats(req, res);
    } else if (req.url === "/donation-rev") {
      donations.getDonationRevenue(req, res);
    } else if (req.url === "/donation-rev") {
      tickets.totalExhibitSales(req, res);
    } else if (req.url === "/exhibit-ticket-sum") {
      exhibitions.exhibitTicketSum(req, res);
    } else if (req.url === "/dept-no-mgr") {
      department.getDeptNoManagers(req, res);
    } else if (req.url === "/total-rev") {
      reports.getTotalRevenue(req, res);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////

    // POST methods
  } else if (req.method === "POST") {
    // Add new donation
    if (req.url === "/donations") {
      donations.addDonation(req, res);

      // Customer login
    } else if (req.url === "/customer-login") {
      auth.customerLogin(req, res);

      // Check if customer exists already
    } else if (req.url === "/check-customer") {
      auth.checkCustomer(req, res);

      // Customer Signup
    } else if (req.url === "/customer-signup") {
      auth.customerSignup(req, res);

      // Employee Login
    } else if (req.url === "/employee-login") {
      auth.employeeLogin(req, res);

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

      // Get Suboordinates
    } else if (req.url === "/suboordinates") {
      employee.getSuboordinates(req, res);

      // Add Department
    } else if (req.url === "/department") {
      department.addDepartment(req, res);

      // Get Customer by ID
    } else if (req.url === "/customer-ID") {
      customer.getCustomerByID(req, res);

      // Get Customer Donations
    } else if (req.url === "/customer-donations") {
      donations.getCustomerDonations(req, res);

      // Get Customer Gift Transactions
    } else if (req.url === "/customer-gifts") {
      gift_log.getCustomerGifts(req, res);

      // Get Customer Ticket Transactions
    } else if (req.url === "/customer-tickets") {
      tickets.getCustomerTickets(req, res);

      // Get Ticket by ID
    } else if (req.url === "/ticket-ID") {
      tickets.getTicketByID(req, res);

      // Get Donation by ID
    } else if (req.url === "/donation-ID") {
      donations.getDonationByID(req, res);

      // Get Gift Transaction by ID
    } else if (req.url === "/gift-ID") {
      gift_log.getGiftTransactionByID(req, res);

      // Add Ticket
    } else if (req.url === "/tickets") {
      tickets.addTicket(req, res);

      // Get Department by Name
    } else if (req.url === "/department-name") {
      department.getDepartmentByName(req, res);
    } else if (req.url === "/department-col-name") {
      collections.getDeptCollByName(req, res);

      // Get Employee by ID
    } else if (req.url === "/employee-ID") {
      employee.getEmployeeByID(req, res);

      // Add new employee
    } else if (req.url === "/employee") {
      employee.addEmployee(req, res);
    } else if (req.url === "/dep-artworks") {
      artworks.artworksInDep(req, res);
    } else if (req.url === "/past-art") {
      artworks.getPastArtworks(req, res);
    } else if (req.url === "/employee-exhibits") {
      exhibitions.employeeExhibitions(req, res);
    } else if (req.url === "/exhibitions") {
      exhibitions.addExhibition(req, res);
    } else if (req.url === "/employee-cols") {
      collections.employeeCollections(req, res);
    } else if (req.url === "/collection") {
      collections.addCollection(req, res);
    } else if (req.url === "/employee-art") {
      artworks.employeeArtworks(req, res);
    } else if (req.url === "/artwork") {
      artworks.addArt(req, res);
    } else if (req.url === "/curator-exhibit-stats") {
      exhibitions.employeeExhibitStats(req, res);
    } else if (req.url === "/curator-exhibit-rev") {
      exhibitions.employeeExhibitRev(req, res);
    } else if (req.url === "/dept-exhibits") {
      exhibitions.getDeptExhibits(req, res);
    } else if (req.url === "/dept-exhibit-stats") {
      exhibitions.deptExhibitStats(req, res);
    } else if (req.url === "/dept-exhibit-rev") {
      exhibitions.deptExhibitRev(req, res);
    } else if (req.url === "/rev-dates") {
      reports.revenueDates(req, res);
    } else if (req.url === "/new-artists") {
      reports.newArtists(req, res);
    } else if (req.url === "/new-artworks") {
      reports.newArtworks(req, res);
    } else if (req.url === "/shop-report") {
      reports.shopReport(req, res);
    } else if (req.url === "/shop-count") {
      reports.shopReportCount(req, res);
    } else if (req.url === "/dept-new-artists") {
      reports.deptNewArtists(req, res);
    } else if (req.url === "/dept-new-art") {
      reports.deptNewArt(req, res);
    } else if (req.url === "/dept-ex-report") {
      reports.deptExReport(req, res);
    } else if (req.url === "/dept-ex-tickets") {
      reports.deptExTickets(req, res);
    } else if (req.url === "/curator-ex-report") {
      reports.curatorExhibitReport(req, res);
    } else if (req.url === "/curator-ex-tickets") {
      reports.curatorTicketReport(req, res);
    } else if (req.url === "/shop-report-total") {
      reports.shopReportTotal(req, res);
    } else if (req.url === "/curator-ex-sum") {
      reports.curatorExSum(req, res);
    } else if (req.url === "/dept-ex-sum") {
        reports.deptExSum(req, res);
      }

    ////////////////////////////////////////////////////////////////////////////////////////////////

    // DELETE methods
  } else if (req.method === "DELETE") {
    // Add new donation
    if (req.url === "/gifts") {
      gifts.deleteGift(req, res);

      // Delete employee
    } else if (req.url === "/employee") {
      employee.deleteEmployee(req, res);
    } else if (req.url === "/collection") {
      collections.deleteCollection(req, res);
    } else if (req.url === "/artwork") {
      artworks.deleteArt(req, res);
    } else if (req.url === "/exhibition") {
      exhibitions.deleteExhibition(req, res);
    } else if (req.url === "/department") {
      department.deleteDept(req, res);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////

    // PUT methods
  } else if (req.method === "PUT") {
    // Update gift item
    if (req.url === "/gifts") {
      gifts.updateGift(req, res);

      // Update customer
    } else if (req.url === "/customer") {
      customer.updateCustomer(req, res);

      // Update Employee
    } else if (req.url === "/employee") {
      employee.updateEmployee(req, res);
    } else if (req.url === "/exhibition") {
      exhibitions.updateExhibition(req, res);
    } else if (req.url === "/archive-exhibit") {
      exhibitions.archiveExhibition(req, res);
    } else if (req.url === "/collection") {
      collections.updateCollection(req, res);
    } else if (req.url === "/artwork") {
      artworks.updateArt(req, res);
    } else if (req.url === "/department") {
      department.updateDepartment(req, res);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found!" }));
  }
});

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
const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
