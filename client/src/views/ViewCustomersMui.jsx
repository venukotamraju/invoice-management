import { Box, Button, Typography } from "@mui/material";
import { blue } from "@mui/material/colors";
import { MDBDataTableV5 } from "mdbreact";
import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

function ViewCustomersMui() {
  const [customerTable, setCustomerTable] = useState();
  const location = useLocation();
  const nav = useNavigate();
  console.log(location);
  useEffect(() => {
    !location.state
      ? nav("/employee")
      : fetch(
          `http://localhost:4001/customerEntries/company/${location.state?.company_id}`
        )
          .then((res) => res.json())
          .then((data) =>
            setCustomerTable({
              columns: [
                {
                  label: "First Name",
                  field: "firstName",
                  width: 150,
                  attributes: {
                    "aria-controls": "DataTable",
                    "aria-label": "First Name",
                  },
                },
                {
                  label: "Last Name",
                  field: "lastName",
                  width: 150,
                  attributes: {
                    "aria-controls": "DataTable",
                    "aria-label": "Last Name",
                  },
                },
                {
                  label: "Description",
                  field: "description",
                  width: 150,
                  attributes: {
                    "aria-controls": "DataTable",
                    "aria-label": "Customer Description",
                  },
                },
                {
                  label: "Reference-Id",
                  field: "referenceId",
                  width: 100,
                  attributes: {
                    "aria-controls": "DataTable",
                    "aria-label": "Customer Reference Id",
                  },
                },
                {
                  label: "Customer Invoices",
                  field: "viewInvoices",
                  with: 100,
                  attributes: {
                    "aria-controls": "DataTable",
                    "aria-label": "Customer Invoices",
                  },
                },
              ],
              rows: data.map((customer) => ({
                firstName: (
                  <Typography>{customer.customer_first_name}</Typography>
                ),
                lastName: (
                  <Typography>{customer.customer_last_name}</Typography>
                ),
                description: (
                  <Typography>{customer.customer_description}</Typography>
                ),
                referenceId: (
                  <Typography>{customer.customer_reference_id}</Typography>
                ),
                viewInvoices: (
                  <Box>
                    <NavLink
                      to={"/employee/viewInvoices"}
                      state={{
                        customerId: customer.customer_id,
                        customerName:
                          customer.customer_first_name +
                          " " +
                          customer.customer_last_name,
                      }}
                      style={{ color: blue["A400"] }}
                    >
                      <Typography
                        sx={{ "&:hover": { textDecoration: "underline" } }}
                      >
                        View Inovices
                      </Typography>
                    </NavLink>
                    /
                    <NavLink
                      to={"/employee/lineItems"}
                      state={{ ...customer, flow: true }}
                      style={{ color: blue["A400"] }}
                    >
                      <Typography
                        sx={{ "&:hover": { textDecoration: "underline" } }}
                      >
                        Generate New Invoice
                      </Typography>
                    </NavLink>
                  </Box>
                ),
              })),
            })
          );
  }, []);
  if (customerTable) {
    return (
      <Box m={"10px"}>
        <MDBDataTableV5
          hover
          entriesOptions={[5, 10, 25]}
          entries={10}
          pagesAmount={4}
          data={customerTable}
        />
      </Box>
    );
  }
}

export default ViewCustomersMui;
