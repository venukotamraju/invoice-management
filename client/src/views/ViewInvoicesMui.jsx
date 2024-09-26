import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { EmployeeInfoContext } from "../routes/employeePage/EmployeeHome";
import { Box, Button, Typography } from "@mui/material";
import { MDBDataTableV5 } from "mdbreact";
import { blue } from "@mui/material/colors";

function ViewInvoicesMui() {
  const [invoiceTable, setInvoiceTable] = useState();
  const location = useLocation();
  const nav = useNavigate();
  const employeeInfo = useContext(EmployeeInfoContext);
  console.log(employeeInfo);
  const invoiceTableData = {
    columns: [
      {
        label: "Invoice Id",
        field: "invoiceId",
        attributes: {
          "aria-controls": "DataTable",
          "aria-label": "Invoice Id",
        },
      },
      {
        label: "Items",
        field: "items",
        attributes: {
          "aria-controls": "DataTable",
          "aria-label": "Number of items",
        },
      },
      {
        label: "Description",
        field: "description",
        attributes: {
          "aria-controls": "DataTable",
          "aria-label": "Invoice Description",
        },
      },
      {
        label: "Total Amount",
        field: "totalAmount",
        attributes: {
          "aria-controls": "DataTable",
          "aria-label": "Total Amount",
        },
      },
      {
        label: "Date Generated",
        field: "generatedDate",
        attributes: {
          "aria-controls": "DataTable",
          "aria-label": "Generated Date",
        },
      },
      {
        label: "Due Date",
        field: "dueDate",
        attributes: {
          "aria-controls": "DataTable",
          "aria-label": "Date Due",
        },
      },
      {
        label: "Generate Invoice",
        field: "generateInvoice",
        attributes: {
          "aria-controls": "DataTable",
          "aria-label": "Print Invoice",
        },
      },
    ],
    rows: (invoiceData) =>
      invoiceData.map((invoice) => ({
        invoiceId: <Typography>{invoice.invoice_id}</Typography>,
        items: <Typography>{invoice.line_item_count}</Typography>,
        description: <Typography>{invoice.invoice_description}</Typography>,
        totalAmount: <Typography>{invoice.total_amount}</Typography>,
        generatedDate: <Typography>{invoice.generated_date}</Typography>,
        dueDate: <Typography>{invoice.due_date}</Typography>,
        generateInvoice: (
          <Button
            onClick={() => handleClick(invoice)}
            sx={{
              "&:hover": { textDecoration: "underline", color: blue["A400"] },
            }}
          >
            Click here to print invoice
          </Button>
        ),
      })),
  };
  useEffect(() => {
    location.state?.customerId
      ? fetch(
          `http://localhost:4001/invoices/customer/${location.state.customerId}`
        )
          .then((res) => res.json())
          .then((data) =>
            setInvoiceTable({
              columns: invoiceTableData.columns,
              rows: invoiceTableData.rows(data),
            })
          )
          .catch((err) =>
            console.error("error from fetching invoices of a customer: ", err)
          )
      : fetch(
          `http://localhost:4001/invoices/company/${employeeInfo.company_id}`
        )
          .then((res) => res.json())
          .then((data) => {
            setInvoiceTable({
              columns: invoiceTableData.columns,
              rows: invoiceTableData.rows(data),
            });
          })
          .catch((err) => console.error("error from fetching invoices: ", err));
  }, []);
  const handleClick = (invoice) => {
    fetch(
      `http://localhost:4001/customerEntries/customerId/${invoice.customer_id}`
    )
      .then((res) => res.json())
      .then((customerData) =>
        fetch(`http://localhost:4001/lineItemDetails/${invoice.invoice_id}`)
          .then((res1) => res1.json())
          .then((lineItemsData) =>
            nav("/employee/invoicePrint", {
              state: {
                lineItemsTable: lineItemsData,
                invoiceTable: invoice,
                customerDetails: customerData[0],
              },
            })
          )
      )
      .catch((err) =>
        console.error(
          "error from fetching customer details and line items: ",
          err
        )
      );
  };
  return (
    <Box m={"10px"}>
      {location.state?.customerId ? (
        <Box width={"100%"} p={3}>
          <Typography variant="h4" textAlign={"right"} fontWeight={600}>
            Invoices of {location.state.customerName}
          </Typography>
        </Box>
      ) : null}
      <MDBDataTableV5
        hover
        entriesOptions={[5, 10, 15]}
        entries={10}
        pagesAmount={4}
        data={invoiceTable}
      />
    </Box>
  );
}

export default ViewInvoicesMui;
