import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import ReactToPrint from "react-to-print";
import "./invoiceFinal.css";
import { Button } from "@mui/material";
function InvoiceFinal() {
  const location = useLocation();
  const [invoiceIdFromLocation, setInvoiceIdFromLocation] = useState(
    location.state.invoiceId
  );
  const [nameFromLocation, setNameFromLocation] = useState(location.state.name);
  const [productUnitAmountFromLocation, setProductUnitAmount] = useState(
    location.state.productUnitAmount
  );
  const [totalAmountFromLocation, setTotalAmountFromLocation] = useState(
    location.state.totalAmount
  );
  const [lineItemsBody, setLineItemsBody] = useState();
  const [lineItemsLength, setLineItemsLength] = useState();
  const [date, setDate] = useState({ generatedDate: "", dueDate: "" });
  const [dateInputValue, setDateInputValue] = useState({
    generatedDate: "",
    dueDate: "",
  });
  const [loading, setLoading] = useState(true);
  const [showSetDate, setShowSetDate] = useState("block");
  const [tableHeadersData, setTableHeadersData] = useState(
    ["Product Name", "Quantity", "Unit Price", "Amount"].map((header, idx) => (
      <th key={idx}>{header}</th>
    ))
  );
  const componentRef = useRef();
  async function submitDates(values) {
    const dateSubmission = await fetch("http://localhost:4001/invoices/date", {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  useEffect(() => {
    fetch(`http://localhost:4001/lineItemDetails/${invoiceIdFromLocation}`)
      .then((fetchData) => fetchData.json())
      .then((lineItemsData) => {
        setLineItemsBody(
          lineItemsData.map((item, idx) => (
            <tr key={idx}>
              <td>{item.line_item}</td>
              <td>{item.line_item_quantity}</td>
              <td>{location.state.productUnitAmount[item.line_item]}</td>
              <td>{item.line_amount}</td>
            </tr>
          ))
        );
        setLineItemsLength(lineItemsData.length);
      })
      .catch((error)=>console.log("this error is from fetching line item details in use effect: ", error.message));
    fetch(`http://localhost:4001/invoices/${invoiceIdFromLocation}`)
      .then((fetchResult) => fetchResult.json())
      .then((dateDetails) => {
        if (dateDetails[0].generated_date === null) {
          setDate({ ...date });
        } else {
          setDate({
            ...date,
            generatedDate: dateDetails[0].generated_date.slice(0, 10),
            dueDate: dateDetails[0].due_date.slice(0, 10),
          });
          setShowSetDate("none");
        }
      })
      .catch((error)=>console.log("this error is from fetching date details in use effect: ", error.message))
  }, []);
  setTimeout(() => setLoading(false), 200);
  return loading ? (
    <div>loading</div>
  ) : (
    <>
      <ReactToPrint
        trigger={() => <Button size="large" variant="contained">Print/Download</Button>}
        content={() => componentRef.current}
      />
      <div className="invoice-print-page" ref={componentRef}>
        <div className="heading">
          <h1>INVOICE</h1>
        </div>
        <section className="top">
          <div className="purchaser">
            <h3>BILL TO : </h3>
            <p>{nameFromLocation}</p>
          </div>
          <div className="date">
            <div className="generatedDate">
              <h3>DATE GENERATED : </h3>
              {date.generatedDate ? (
                <p>{date.generatedDate}</p>
              ) : (
                <input
                  value={dateInputValue.generatedDate}
                  onChange={(e) =>
                    setDateInputValue({
                      ...dateInputValue,
                      generatedDate: e.target.value,
                    })
                  }
                  type="date"
                />
              )}
            </div>
            <div className="dueDate">
              <h3>DUE DATE : </h3>
              {date.dueDate ? (
                <p>{date.dueDate}</p>
              ) : (
                <input
                  value={dateInputValue.dueDate}
                  onChange={(e) =>
                    setDateInputValue({
                      ...dateInputValue,
                      dueDate: e.target.value,
                    })
                  }
                  type="date"
                />
              )}
            </div>
            <div className="setDateAndDueDate" style={{ display: showSetDate }}>
              <Button
                type="button"
                onClick={() => {
                  submitDates({
                    generatedDate: dateInputValue.generatedDate,
                    dueDate: dateInputValue.dueDate,
                    invoiceId:invoiceIdFromLocation,
                  });
                  setShowSetDate("none");
                }}
                variant="contained"
              >
                Set
              </Button>
            </div>
          </div>
        </section>
        <section className="middle">
          <div className="purchaseDetails">
            <table>
              <thead>
                <tr>{tableHeadersData}</tr>
              </thead>
              <tbody>{lineItemsBody}</tbody>
            </table>
          </div>
          <div className="finalNumbers">
            <div className="totalQuantity">
              <h3>Total Qty : {lineItemsLength}</h3>
            </div>
            <div className="totalAmount">
              <h3>Sub Total: {totalAmountFromLocation}</h3>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
export default InvoiceFinal;
