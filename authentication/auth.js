const http = require("http");
const mysql = require("mysql");
const db = require("../config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Customer login
const customerLogin = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    const Customer_Email = body.Customer_Email;
    const Customer_Password = body.Customer_Password;
    console.log("Update request body:", data); // Log the request body

    db.query(
      "SELECT * FROM customers WHERE Customer_Email = ? AND Customer_Password=?",
      [Customer_Email, Customer_Password],
      (error, result) => {

        const customer = result[0]
        console.log(customer);

        if (error) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: error }));
        } else if (!customer) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Invalid username or password" }));
        } else {
            const token = jwt.sign({ 
                ID: customer.Customer_ID, 
                role: "Customer"
            }
            , process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRE,
            });
            console.log("token", token)

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ token: token}));
        }
      },
    );
  });
};

// Check if customer exists already
const checkCustomer = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    const Customer_Email = body.Customer_Email;
    const Customer_Password = body.Customer_Password;

    db.query(
      "SELECT * FROM customers WHERE Customer_Email = ?",
      [Customer_Email],
      (error, result) => {
        if (error) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: error }));
        } else if (result[0]) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message: "An account with this email already exists",
            }),
          );
        } else {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Registration successful!" }));
        }
      },
    );
  });
};

// Customer Signup
const customerSignup = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    let {
      Customer_Fname,
      Customer_Lname,
      Customer_Email,
      Customer_Password,
      Customer_Address,
      Customer_City,
      Customer_State,
      Customer_Zipcode,
    } = body;
    if (Customer_Address === "") {
      Customer_Address = null;
    }
    if (Customer_City === "") {
      Customer_City = null;
    }
    if (Customer_State === "") {
      Customer_State = null;
    }
    if (Customer_Zipcode === "") {
      Customer_Zipcode = null;
    }
    db.query(
      "INSERT INTO customers(Customer_Fname, Customer_Lname, Customer_Email, Customer_Password, Customer_Address, Customer_City, Customer_State, Customer_Zipcode) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        Customer_Fname,
        Customer_Lname,
        Customer_Email,
        Customer_Password,
        Customer_Address,
        Customer_City,
        Customer_State,
        Customer_Zipcode,
      ],
      (error, results) => {
        if (error) {
          console.log(error);
          console.log(error.code);
          if (
            error.sqlMessage === "An account with this email already exists"
          ) {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: "An account with this email already exists",
              }),
            );
          } else {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ message: "Error creating customer account!" }),
            );
          }
        } else {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ message: "Customer signed up successfully" }),
          );
        }
      },
    );
  });
};

// Employee login
const employeeLogin = (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const body = JSON.parse(data);
    const employee_email = body.employee_email;
    const employee_password = body.employee_password;
    console.log("Update request body:", data); // Log the request body

    db.query(
      "SELECT * FROM employees WHERE employee_email = ? AND employee_password=?",
      [employee_email, employee_password],
      (error, result) => {
        const employee = result[0]
        console.log(employee)

        if (error) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: error }));
        } else if (!employee) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Invalid username or password" }));
        } else {
            const token = jwt.sign({ 
                ID: employee.employee_id, 
                role: employee.role,
                department: employee.dep_ID,
            }
            , process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRE,
            });
            console.log("token", token)



          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ token: token}));
        }
      },
    );
  });
};

const verifyToken = (req, jwt) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return null;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (err) {
        console.error('Error verifying token:', err);
        return null;
    }
};

module.exports = {
  employeeLogin,
  customerLogin,
  checkCustomer,
  customerSignup,
  verifyToken
};
