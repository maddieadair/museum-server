const http = require("http");
const { parse } = require("url");
const pool = require("./config/db.js");

const gifts = require("./routes/gift-items")
const artworks = require("./routes/artworks")
const collections = require("./routes/collections")
const exhibitions = require("./routes/exhibitions")
const departments = require("./routes/departments")
const donations = require("./routes/donations")
const employees = require("./routes/employees")
const giftlog = require("./routes/gift-log")
const tickets = require("./routes/tickets")
const users = require("./routes/users")


const server = http.createServer((req, res) => {
  handleCors(req, res);

  const { pathname } = parse(req.url);

  if (pathname === "/gift-items" && req.method === "PUT") {
    gifts.updateGiftItem(req, res);
  } else if (pathname === "/gift-items" && req.method === "GET") {
    gifts.getGiftItems(req, res);
  } else if (pathname === "/gift-items" && req.method === "POST") {
    gifts.addGiftItem(req, res);
  } else if (pathname === "/gift-items" && req.method === "DELETE") {
    gifts.deleteGiftItem(req, res);

  } else if (pathname === "/donations" && req.method === "GET") {
    donations.getDonations(req, res);
  } else if (pathname === "/donations" && req.method === "PUT") {
    donations.updateDonation(req, res);
  } else if (pathname === "/donations" && req.method === "POST") {
    donations.addDonation(req, res);
  } else if (pathname === "/donations" && req.method === "DELETE") {
    donations.deleteDonation(req, res);
  } else if (pathname === "/userDonations" && req.method === "GET") {
    donations.getUserDonations(req, res);

  } else if (pathname === "/exhibitions" && req.method === "GET") {
    exhibitions.getExhibitions(req, res);
  } else if (pathname === "/exhibitions" && req.method === "POST") {
    exhibitions.addExhibition(req, res);
  } else if (pathname === "/exhibitions" && req.method === "PUT") {
    exhibitions.updateExhibition(req, res);
  } else if (pathname === "/exhibitions" && req.method === "DELETE") {
    exhibitions.deleteExhibition(req, res);
  } else if (pathname === "/exhibitions-three" && req.method === "GET") {
    exhibitions.getCurrentThreeExhibitions(req, res);

  } else if (pathname === "/users" && req.method === "GET") {
    users.getUsers(req, res);
  } else if (pathname === "/getUser" && req.method === "GET") {
    users.getAUser(req, res);
  } else if (pathname === "/users" && req.method === "POST") {
    users.addUser(req, res);
  } else if (pathname === "/users" && req.method === "PUT") {
    users.updateUser(req, res);
  } else if (pathname === "/users" && req.method === "DELETE") {
    users.deleteUser(req, res);

  } else if (pathname === "/departments" && req.method === "GET") {
    departments.getDepartments(req, res);
  } else if (pathname === "/departments" && req.method === "POST") {
    departments.addDepartment(req, res);
  } else if (pathname === "/departments" && req.method === "PUT") {
    departments.updateDepartment(req, res);
  } else if (pathname === "/departments" && req.method === "DELETE") {
    departments.deleteDepartment(req, res);

  } else if (pathname === "/collections" && req.method === "GET") {
    collections.getCollections(req, res);
  } else if (pathname === "/collections" && req.method === "POST") {
    collections.addCollection(req, res);
  } else if (pathname === "/collections" && req.method === "PUT") {
    collections.updateCollection(req, res);
  } else if (pathname === "/collections" && req.method === "DELETE") {
    collections.deleteCollection(req, res);

  } else if (pathname === "/tickets" && req.method === "GET") {
    tickets.getTickets(req, res);
  } else if (pathname === "/tickets" && req.method === "DELETE") {
    tickets.deleteTicket(req, res);
  } else if (pathname === "/tickets" && req.method === "PUT") {
    tickets.updateTicket(req, res);
  } else if (pathname === "/tickets" && req.method === "POST") {
    tickets.addTicket(req, res);
  } else if (pathname === "/userTickets" && req.method === "GET") {
    tickets.getUserTickets(req, res);



  } else if (pathname === "/employees" && req.method === "GET") {
    employees.getEmployees(req, res);
  } else if (pathname === "/employees" && req.method === "DELETE") {
    employees.deleteEmployee(req, res);
  } else if (pathname === "/employees" && req.method === "PUT") {
    employees.updateEmployee(req, res);
  } else if (pathname === "/employees" && req.method === "POST") {
    employees.addEmployee(req, res);

  } else if (pathname === "/artworks" && req.method === "GET") {
    artworks.getArtworks(req, res);
  } else if (pathname === "/artworks" && req.method === "DELETE") {
    artworks.deleteArtwork(req, res);
  } else if (pathname === "/artworks" && req.method === "PUT") {
    artworks.updateArtwork(req, res);
  } else if (pathname === "/artworks" && req.method === "POST") {
    artworks.updateArtwork(req, res);

  } else if (pathname === "/gift-log" && req.method === "GET") {
    giftlog.getGiftLog(req, res);
  } else if (pathname === "/userGifts" && req.method === "GET") {
    giftlog.getUserGifts(req, res);
  } else if (pathname === "/gift-log" && req.method === "DELETE") {
    giftlog.deleteGiftTransaction(req, res);
  } else if (pathname === "/gift-log" && req.method === "PUT") {
    giftlog.updateGiftTransaction(req, res);
  } else if (pathname === "/gift-log" && req.method === "POST") {
    giftlog.addGiftTransaction(req, res);

  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found" }));
  }
});
  


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
