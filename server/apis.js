const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const cors = require("cors");
const Pool = require("pg").Pool;
const colors = require("colors/safe"); //optional package
require("dotenv").config(); //FOR ACCESSING ENV VARIABLES -> INSTALL "dotenv" PACKAGE AND DECALRE VARIABLES IN A ".env" FILE
const bcrypt = require("bcrypt");
const saltRounds = 10; //for hashing via bcrypt

// instance of postgres
const pool = new Pool({
  user: process.env.USER,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  port: parseInt(process.env.PORT),
  database: process.env.DATABASE,
});
// instance of postgres-session-store
const sessionStore = new pgSession({
  pool: pool,
  tableName: "usersession",
});

// express middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    store: sessionStore,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 100 * 60 * 60 * 24,
    },
  })
);

// routes
app.get("/products/company/:companyId", (req, res) => {
  try {
    pool.query(
      "SELECT * FROM products WHERE company_id = $1",
      [req.params.companyId],
      (err, result) => {
        if (err) {
          console.log("error from fetching products of a company: ", err);
        }
        res.json(result.rows);
      }
    );
  } catch (error) {
    res.json({ message: error });
  }
});
app.post("/products", (req, res) => {
  pool.query(
    "INSERT INTO products (product_name,product_unit_type,product_unit_cost,product_status,product_available_quantity,product_description,company_id) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
    [
      req.body.name,
      req.body.unitType,
      req.body.unitCost,
      req.body.status,
      req.body.availableQuantity,
      req.body.description,
      req.body.companyId
    ],
    (err, result) => {
      if (err) {
        console.log("error from inserting product: ", err);
      }
      res.json({
        message: "Product Added Successfully",
        result: result.rows,
      });
    }
  );
});
app.delete("/products", (req, res) => {
  pool.query(
    "DELETE FROM products WHERE product_id = $1",
    [req.body.productId],
    (err) => {
      if (err) {
        console.log("error from deleting products: ", err);
      }
      res.json({ deletionStatus: true });
    }
  );
});
app.post("/customerEntries", (req, res) => {
  try {
    pool.query(
      "INSERT INTO customers (customer_first_name,customer_last_name,customer_dob,customer_address,customer_description,customer_reference_id,customer_contact_no,company_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *",
      [
        req.body.customerFirstName,
        req.body.customerLastName,
        req.body.customerDob,
        req.body.customerAddress,
        req.body.customerDescription,
        req.body.customerReferenceId,
        req.body.customerContactNo,
        req.body.companyId,
      ],
      (err, result) => {
        if (err) {
          console.log("error from inserting customers: ", err);
        }
        pool.query(
          "INSERT INTO invoices (customer_id,company_id) VALUES ($1,$2) RETURNING *",
          [result.rows[0].customer_id, result.rows[0].company_id],
          (err1, result1) => {
            if (err1) {
              console.log("error from inserting into invoices: ", err1);
            }
            res.json({
              ...result.rows[0],
              invoiceId: result1.rows[0].invoice_id,
            });
          }
        );
      }
    );
  } catch (error) {
    console.log("error from customerEntries route with post method: ", error);
  }
});
app.get("/customerEntries", ({ res }) => {
  try {
    pool.query(
      "SELECT * FROM customers ORDER BY customer_id",
      (err, result) => {
        if (err) {
          console.log("error from fetching data from customers table: ", err);
        }
        res.json({ rows: result.rows, fields: result.fields });
      }
    );
  } catch (error) {
    console.log("error from customer entries route with get method: ", error);
  }
});
app.get("/customerEntries/:id", (req, res) => {
  try {
    pool.query(
      "SELECT * FROM customers WHERE customer_reference_id = $1",
      [req.params.id],
      (err, result) => {
        if (err) {
          console.log(
            "error from fetching customer details using referenceId from customers table: ",
            err
          );
        }
        res.json(result.rows);
      }
    );
  } catch (error) {
    console.log(
      "error from customer entries route with customerReferenceId: ",
      error
    );
  }
});
app.get("/customerEntries/customerId/:id", (req, res) => {
  try {
    pool.query(
      "SELECT * FROM customers WHERE customer_id = $1",
      [req.params.id],
      (err, result) => {
        if (err) {
          console.log(
            "error from fetching customers with customerId from pool: ",
            err
          );
        }
        res.json(result.rows);
      }
    );
  } catch (error) {
    console.log(
      "error from fetching customer details with customerId: ",
      error
    );
  }
});
app.get("/customerEntries/company/:companyId", (req, res) => {
  try {
    pool.query(
      "SELECT * FROM customers WHERE company_id = $1",
      [req.params.companyId],
      (err, result) => {
        if (err) {
          console.log("error from fetching customers with company id: ", err);
        }
        res.json(result.rows);
      }
    );
  } catch (error) {
    console.log("error from /customerEntries/company/:companyId: ", error);
  }
});

app.delete("/customerEntries/customerId/:id", async (req, res) => {
  try {
    pool.query(
      "DELETE FROM customers WHERE customer_id = $1 RETURNING *",
      [req.params.id],
      (err, result) => {
        if (err) {
          console.log("error from deleting customer: ", err);
        }
        res.json(result.command);
      }
    );
  } catch (error) {
    console.log(
      "error from customer entries route with delete method: ",
      error
    );
  }
});

app.post("/lineItemDetails/update", async (req, res) => {
  try {
    const totalAmount = req.body.listItems
      .map((item) => item.itemAmount)
      .reduce((acc, num) => acc + num, 0);
    const description = `${req.body.firstName} having a purchase of ${req.body.listItems.length} totaling to an amount of ${totalAmount}`;
    const invoiceTable = await pool.query(
      "UPDATE invoices SET line_item_count = $1, invoice_description = $2, total_amount= $3 WHERE invoice_id = $4 RETURNING *",
      [req.body.listItems.length, description, totalAmount, req.body.invoiceId]
    );
    const lineItemsTable = [];
    for (let i = 0; i < req.body.listItems.length; i++) {
      const lineItems = await pool.query(
        "INSERT INTO lineitems (line_item,line_item_quantity,line_amount,invoice_id) VALUES ($1,$2,$3,$4) RETURNING *",
        [
          req.body.listItems[i].itemName,
          req.body.listItems[i].itemQuantity,
          req.body.listItems[i].itemAmount,
          req.body.invoiceId,
        ]
      );
      lineItemsTable[i] = lineItems["rows"][0];
    }
    res.json({
      invoiceTable: invoiceTable["rows"][0],
      lineItemsTable: lineItemsTable,
    });
  } catch (error) {
    console.log("error from /lineitems update route: ", error);
  }
});

app.post("/lineItemDetails/insert", async (req, res) => {
  if (req.body) {
    try {
      // for invoices table
      const totalAmount = req.body.listItems
        .map((item) => item.itemAmount)
        .reduce((acc, num) => acc + num, 0);
      const invoiceDescription = `${req.body.firstName} having a purchase of ${req.body.listItems.length} items totaling to an amount of ${totalAmount}`;
      const postInvoiceTableData = await pool.query(
        "INSERT INTO invoices (customer_id,line_item_count,invoice_description,total_amount,company_id) VALUES ($1,$2,$3,$4,$5) RETURNING *",
        [
          req.body.customerId,
          req.body.listItems.length,
          invoiceDescription,
          totalAmount,
          req.body.companyId,
        ]
      );
      // for line items table
      const lineItemsTable = [];
      const invoiceId = postInvoiceTableData["rows"][0].invoice_id;
      for (let i = 0; i < req.body.listItems.length; i++) {
        const lineSubmission = await pool.query(
          "INSERT INTO lineitems (line_item,line_item_quantity,line_amount,invoice_id) VALUES ($1,$2,$3,$4) RETURNING *",
          [
            req.body.listItems[i].itemName,
            req.body.listItems[i].itemQuantity,
            req.body.listItems[i].itemAmount,
            invoiceId,
          ]
        );
        lineItemsTable[i] = lineSubmission["rows"][0];
      }
      res.status(202).json({
        invoiceTable: postInvoiceTableData["rows"][0],
        lineItemsTable: lineItemsTable,
      });
    } catch (error) {
      console.log("this error is from lineItemDetails/insert: ", error);
    }
  }
});

app.get("/lineItemDetails", async (req, res) => {
  const lineItemDetailsFetch = await pool.query("SELECT * FROM lineitems");
  res.json(lineItemDetailsFetch["rows"]);
});
app.get("/lineItemDetails/:invoiceId", async (req, res) => {
  const { invoiceId } = req.params;
  const lineItemDetailsOfAnInvoice = await pool.query(
    "SELECT * FROM lineitems WHERE invoice_id = $1",
    [invoiceId]
  );
  res.json(lineItemDetailsOfAnInvoice["rows"]);
});
app.put("/lineItemDetails", async (req, res) => {
  if (req.body) {
    try {
      const { listItem, invoiceId, name } = req.body;
      const lineItemDeleteQuery = await pool.query(
        "DELETE FROM lineitems WHERE invoice_id = $1",
        [invoiceId]
      );
      for (let item of listItem) {
        const lineItemInsertQuery = await pool.query(
          "INSERT INTO lineitems (line_item,line_item_quantity,line_amount,invoice_id) VALUES ($1,$2,$3,$4)",
          [item.itemName, item.itemQuantity, item.itemAmount, invoiceId]
        );
      }
      // for invoices
      const totalAmount = listItem
        .map((item) => item.itemAmount)
        .reduce((acc, num) => acc + num, 0);
      const lineItemCount = listItem.length;
      const firstName = name.split(" ")[0];
      const description = `${firstName} having a purchase of ${lineItemCount} items totaling to an amount of ${totalAmount}`;
      const postInvoiceTableData = await pool.query(
        `UPDATE invoices SET line_item_count = $1, invoice_description =$2, total_amount = $3 WHERE invoice_id = $4 RETURNING *;`,
        [lineItemCount, description, totalAmount, invoiceId]
      );
    } catch (error) {
      console.log(
        "this error is from lineItemDetails route with PUT verb: ",
        error.message
      );
    }
  }
});

app.get("/invoices", ({ res }) => {
  try {
    pool.query("SELECT * FROM invoices", (err, result) => {
      if (err) {
        console.log("Error from fetching invoices: ", err);
      }
      res.json(result.rows);
    });
  } catch (error) {
    console.log(
      "[this error is from /invoices route of get method]... ",
      error.message
    );
  }
});
// for fetching invoices of a customer with customer id
app.get("/invoices/customer/:customerid", (req, res) => {
  try {
    pool.query(
      "SELECT * FROM invoices WHERE customer_id = $1",
      [req.params.customerid],
      (err, result) => {
        if (err) {
          console.log("error from fetching invoices of a customer: ", err);
        }
        res.json(result.rows);
      }
    );
  } catch (error) {
    console.log("error from /invoices/customer/:customerId : ", error);
  }
});
// for fetching individual invoices
app.get("/invoices/:invoiceid", (req, res) => {
  try {
    pool.query(
      "SELECT * FROM invoices WHERE invoice_id = $1",
      [req.params.invoiceid],
      (err, result) => {
        if (err) {
          console.log("error from fetching invoice with invoiceId: ", err);
        }
        res.json(result.rows);
      }
    );
  } catch (error) {
    console.log("error from invoices/:invoiceId : ", error);
  }
});
// for fetching individual invoices of a company
app.get("/invoices/company/:companyId", (req, res) => {
  try {
    pool.query(
      "SELECT * FROM invoices WHERE company_id = $1 ORDER BY invoice_id",
      [req.params.companyId],
      (err, result) => {
        if (err) {
          console.log("error from fetching invoices of a copmany: ", err);
        }
        res.json(result.rows);
      }
    );
  } catch (error) {
    console.log("error from /invoices/company/:companyId : ", error);
  }
});
app.post("/invoices/date", (req, res) => {
  try {
    pool.query(
      "UPDATE invoices SET generated_date=$1,due_date=$2,tax=$3,final_amount=$4 WHERE invoice_id = $5 RETURNING *",
      [
        req.body.date,
        req.body.dueDate,
        req.body.tax,
        req.body.finalAmount,
        req.body.invoiceId,
      ],
      (err, result) => {
        if (err) {
          console.log("error from updating dates: ", err);
        }
        res.json({
          message: {
            status: true,
            res: result.rows[0],
          },
        });
      }
    );
  } catch (error) {
    console.log("error from /invoices/date: ", error);
  }
});
app.delete("/invoices/:invoiceid", async (req, res) => {
  const { invoiceid } = req.params;
  const deleteInvoice = await pool.query(
    "DELETE FROM invoices WHERE invoice_id = $1",
    [invoiceid]
  );
  res.status(202).json(deleteInvoice["command"]);
});

// ******* AUTHENTICATION ROUTES ********
app.get("/users", (req, res) => {
  try {
    pool.query("SELECT * FROM users", (error, result) => {
      if (error) {
        res.json({ err: error });
      }
      res.json(result["rows"]);
    });
  } catch (error) {
    console.log("this error is from /users with get route: ", error.message);
  }
});

app.get("/registerCompany", async (req, res) => {
  const data = await pool.query("SELECT * FROM company");
  res.status(202).json(data["rows"]);
});
app.get("/registerCompany/companyId/:companyId", (req, res) => {
  try {
    pool.query(
      "SELECT * FROM company WHERE company_id = $1",
      [req.params.companyId],
      (err, result) => {
        if (err) {
          console.log("error fetching company details via company_id: ", err);
        }
        res.json(result.rows[0]);
      }
    );
  } catch (error) {
    console.log("error from /registerCompany/companyId/:companyId: ", error);
  }
});
app.post("/registerCompany", (req, res) => {
  const {
    companyName,
    companyAddress,
    companyContactNo,
    companyGstNo,
    companyEmail,
    companyPassword,
  } = req.body;
  try {
    bcrypt.hash(companyPassword, saltRounds, (err, hash) => {
      if (err) {
        console.error("error from hashing: ", err);
      }
      pool.query(
        "INSERT INTO company (company_name,company_address,company_contact_no,company_gst_no,company_email,company_password) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
        [
          companyName,
          companyAddress,
          companyContactNo,
          companyGstNo,
          companyEmail,
          hash,
        ],
        (error, result) => {
          if (error) {
            res.json({
              err: error,
            });
          }
          res.json({
            res: result["rows"],
            status: 200,
          });
        }
      );
    });
  } catch (error) {
    console.error(
      "this error is from /registerCompany with postRoute: ",
      error.message
    );
  }
});

app.get("/loginCompany", (req, res) => {
  if (req.session.companyAuth) {
    res.json({
      auth: {
        companyAuth: req.session.companyAuth,
      },
    });
  } else {
    res.json({
      auth: {
        companyAuth: false,
      },
    });
  }
});

app.post("/loginCompany", (req, res) => {
  const { email, password } = req.body;
  try {
    pool.query(
      "SELECT * FROM company WHERE company_email = $1",
      [email],
      (err, result) => {
        if (err) {
          res.json({ err: err });
        }
        if (result.rows.length > 0) {
          bcrypt.compare(
            password,
            result.rows[0].company_password,
            (error, response) => {
              if (response) {
                req.session.companyAuth = {
                  status: true,
                  info: result["rows"][0],
                };
                res.json({ companyAuth: req.session.companyAuth, status: 202 });
              } else {
                res.json({ message: "Wrong username/password combination" });
              }
              if (error) {
                console.error("from comparing hashes: ", error);
              }
            }
          );
        } else {
          res.json({ message: "Unregistered Company" });
        }
      }
    );
  } catch (error) {
    console.error("error from /loginCompany: ", error);
  }
});

app.post("/logoutCompany", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("error from destroying session: ", err);
    }
    res.clearCookie("connect.sid", { path: "/" });
    res.json({
      message: {
        logOut: true,
      },
    });
  });
});

// registering employees from a company
app.get("/employees", (req, res) => {
  pool.query("SELECT * FROM employees", (err, result) => {
    if (err) {
      console.error("error from fetching employees from employee table: ", err);
    }
    res.json(result["rows"]);
  });
});
// for employees belonging to a specific company
app.get("/employees/:companyName", (req, res) => {
  const { companyName } = req.params;
  try {
    pool.query(
      "SELECT * FROM company WHERE company_name = $1",
      [companyName],
      (err, result) => {
        if (err) {
          console.log("error from fetchig company details: ", err);
        } else {
          pool.query(
            "SELECT * FROM employees WHERE company_id=$1",
            [parseInt(result["rows"][0]["company_id"])],
            (err2, result2) => {
              if (err2) {
                console.log(
                  "error from fetching employees of a company: ",
                  err2
                );
              }
              res.json({ result: result2["rows"] });
            }
          );
        }
      }
    );
  } catch (error) {
    console.log("error from fetching employees: ", error);
  }
});

app.post("/employee", (req, res) => {
  const {
    companyId,
    firstName,
    lastName,
    email,
    password,
    contactNo,
    id,
    dob,
  } = req.body;
  try {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        console.log("error from hashing employee password: ", err);
      }
      pool.query(
        "INSERT INTO employees (company_id,employee_first_name,employee_last_name,employee_dob,employee_contact,employee_reg_id,employee_email,employee_password) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *",
        [companyId, firstName, lastName, dob, contactNo, id, email, hash],
        (err1) => {
          if (err1) {
            console.error(
              "error from inserting employee details into database: ".err1
            );
          }
          res.json({ message: "registration success" });
        }
      );
    });
  } catch (error) {
    console.error("error from /employee with post method: ", error);
  }
});
app.delete("/employee", (req, res) => {
  const { regId } = req.body;
  try {
    pool.query(
      "DELETE FROM employees WHERE employee_reg_id = $1 RETURNING *",
      [regId],
      (err) => {
        if (err) {
          console.log("error from deleting employee using pool: ", err);
        }
        res.json({ message: "delete success" });
      }
    );
  } catch (error) {
    console.log("error from deleting employee: ", error);
  }
});

// for employee login
app.post("/login/employee", (req, res) => {
  const { email, password } = req.body;
  try {
    pool.query(
      "SELECT * FROM employees WHERE employee_email=$1",
      [email],
      (err, result) => {
        if (err) {
          console.log("error from fetching employee with email id: ", err);
          res.json({ err: err });
        }
        if (result["rows"].length > 0) {
          bcrypt.compare(
            password,
            result["rows"][0]["employee_password"],
            (error, response) => {
              if (error) {
                console.log("error from comparing hashes: ", err);
              }
              if (response) {
                req.session.employeeAuth = {
                  status: true,
                  info: result["rows"][0],
                };
                res.json({
                  employeeAuth: req.session.employeeAuth,
                  status: 202,
                });
              } else {
                res.json({ message: "wrong username/password combination" });
              }
            }
          );
        } else {
          res.json({ message: "unregistered employee" });
        }
      }
    );
  } catch (error) {}
});
app.get("/login/employee", (req, res) => {
  if (req.session.employeeAuth) {
    res.json({
      auth: {
        employeeAuth: req.session.employeeAuth,
      },
    });
  } else {
    res.json({
      auth: {
        employeeAuth: false,
      },
    });
  }
});
app.post("/logout/employee", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("error from destroying session: ", err);
    }
    res.clearCookie("connect.sid", { path: "/" });
    res.json({
      message: {
        logOut: true,
      },
    });
  });
});

// express local server
app.listen(4001, () =>
  console.log(colors.brightCyan("started server on port 4001..."))
);
