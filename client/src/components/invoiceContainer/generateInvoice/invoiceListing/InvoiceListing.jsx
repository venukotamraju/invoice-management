import React, { useState } from "react";
import { Formik, Field, Form } from "formik";
import { MDBDataTableV5 } from "mdbreact";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { blue, red } from "@mui/material/colors";
function InvoiceListing() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState();
  const [invoicesListTableBody, setInvoicesListTableBody] = useState();
  
  
  const deleteInvoice = (invoiceId) => {
    console.log(invoiceId)
    fetch(`http://localhost:4001/invoices/${invoiceId}`,{
      method: "DELETE",
    })
  }
  const TableComponent = ({ tableData }) => {
    const [dataTable, setDataTable] = useState({
      columns: [
        {
          label: "Invoice ID",
          field: "invoiceId",
          width: 50,
        },
        {
          label: "Item Count",
          field: "itemCount",
          width: 50,
        },
        {
          label: "Invoice Description",
          field: "invoiceDescription",
          width: 200,
        },
        {
          label: "Invoice Amount",
          field: "invoiceAmount",
          width: 50,
        },
        {
          label: "Generated Date",
          field: "generatedDate",
          width: 70,
        },
        {
          label: "Due Date",
          field: "dueDate",
          width: 70,
        },
        {
          label: "Re-Generate Invoice",
          field: "reGenerateInvoice",
          width: 50,
        },
        {
          label: "Delete Invoice",
          field: "deleteInvoice",
          width: 30,
        },
      ],
      rows: tableData,
    });
    return (
      <MDBDataTableV5
        hover
        entriesOptions={[5, 10, 25]}
        entries={5}
        pagesAmount={4}
        data={dataTable}
      />
    );
  };
  
  const invoiceList = (values) => {
    fetch(
      `http://localhost:4001/customerEntries/${values.customerReferenceId}`
    )
      .then((customerIdFetch) => customerIdFetch.json())
        .then((customerIdData)=> fetch(
          `http://localhost:4001/invoices/customer/${customerIdData[0]["customer_id"]}`
        ))
          .then((invoiceListFetch) => invoiceListFetch.json())
            .then((invoiceListData)=>{
              setInvoicesListTableBody(
                invoiceListData.map((item) => ({
                  invoiceId: item["invoice_id"],
                  itemCount: item["line_item_count"],
                  invoiceDescription: item["invoice_description"],
                  invoiceAmount: item["total_amount"],
                  generatedDate: item["generated_date"]?.slice(0, 10),
                  dueDate: item["due_date"]?.slice(0, 10),
                  reGenerateInvoice: (
                    <Button
                      style={{ cursor: "pointer", marginLeft: 30 }}
                      onClick={() =>
                        navigate("/invoicePreview", {
                          state: {
                            invoiceId: item.invoice_id,
                            customerId: item.customer_id,
                            totalAmount: item.total_amount,
                          },
                        })
                      }
                    >
                      <AddCircleIcon sx={{ color: blue["A200"], fontSize: 30 }} />
                    </Button>
                  ),
                  deleteInvoice: (
                    <Button
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        deleteInvoice(item["invoice_id"]);
                      }}
                    >
                      <DeleteOutlineIcon sx={{ color: red["A400"], fontSize: 30 }} />
                    </Button>
                  ),
                }))
              );
              setInvoices(invoiceListData);
            })
            .catch((error)=>console.log("this error is from fetching invoices: ",error.message));
  };

  const CustomerInvoiceListing = () => {
    const initialValues = {
      customerReferenceId: "",
    };
    const validations = (values) => {
      const errors = {};
      if (!values.customerReferenceId) {
        errors.customerReferenceId =
          "Please enter the reference Id of the customer to fetch their invoices";
      }
      return errors;
    };
    return (
      <Formik
        initialValues={initialValues}
        validate={validations}
        onSubmit={(values, { resetForm }) => {
          invoiceList(values);
          // console.log(invoices)
        }}
      >
        <Form>
          <label htmlFor="customerReferenceId">Customer Reference Id</label>
          <Field name="customerReferenceId" />
          <Button type="submit" sx={{fontSize:"1rem",padding:"1rem",marginLeft:"1rem",height:"0.5rem"}} variant="contained" color="secondary">Fetch</Button>
        </Form>
      </Formik>
    );
  };
  return (
    <div>
      <CustomerInvoiceListing />
      <div className="table">
        {invoices ? (
          <div>
            <TableComponent tableData={invoicesListTableBody} />
          </div>
        ) : (
          <div>
            <p style={{color:"red",fontWeight:"400"}}>Enter the reference Id</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default InvoiceListing;
