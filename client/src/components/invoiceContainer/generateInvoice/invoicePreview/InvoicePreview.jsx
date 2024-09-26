import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
function InvoicePreview() {
  const location = useLocation();
  function InvoicePreviewProps({ invoiceId, customerId, totalAmount }) {
    const [name, setName] = useState();
    const [lineItems, setLineItems] = useState();
    const [generatedDate, setGeneratedDate] = useState();
    const [dueDate, setDueDate] = useState();
    const [productSelectlist, setProductSelectList] = useState();
    const [productUnitAmount, setProductUnitAmount] = useState();
    const [productListEditable, setProductListEditable] = useState(false);
    const [loading, setLoading] = useState(true);
    const [dateUpdatePrompt, setDateUpdatePrompt] = useState(false);
    const [generateInvoice, setGenerateInvoice] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
      async function invoicePreviewDetailsFetch() {
        // for customer first name
        const customerNameFetch = await fetch(
          `http://localhost:4001/customerEntries/customerId/${customerId}`
        );
        const customerNameData = await customerNameFetch.json();
        const customerFirstName = customerNameData[0].customer_first_name;
        const customerLastName = customerNameData[0].customer_last_name;
        // for line Items
        const lineItemsFetch = await fetch(
          `http://localhost:4001/lineItemDetails/${invoiceId}`
        );
        const lineItemsData = await lineItemsFetch.json();
        setLineItems(lineItemsData);
        // for product select list
        const productList = await fetch("http://localhost:4001/products");
        const data = await productList.json();
        const { rows } = data;
        // product item list for selection
        const selectItems = rows.map((e, idx) => (
          <option key={idx} value={e.product_name}>
            {e.product_name}
          </option>
        ));
        const productAmount = rows.map((e) => {
          let returnData = {
            [e.product_name]: e.product_unit_cost,
          };
          return returnData;
        });
        let object = {};
        for (let i = 0; i < productAmount.length; i++) {
          object[Object.keys(productAmount[i])] = Object.values(
            productAmount[i]
          )[0];
        }
        // for date and due date
        const dateAndDueDateFetch = await fetch(
          `http://localhost:4001/invoices/${invoiceId}`
        );
        const dateAndDueDateData = await dateAndDueDateFetch.json();
        const date = dateAndDueDateData[0].generated_date;
        const dueDate = dateAndDueDateData[0].due_date;
        if (customerFirstName) {
          setGeneratedDate(!date ? "" : date.slice(0, 10));
          setDueDate(!dueDate ? "" : dueDate.slice(0, 10));
          setName(customerFirstName + " " + customerLastName);
          setProductSelectList(selectItems);
          setProductUnitAmount(object);
        }
        setTimeout(() => {
          setLoading(false);
        }, 900);
      }
      invoicePreviewDetailsFetch();
    }, [productListEditable]);
    const InvoicePreviewSetDate = () => {
      const initialValues = {
        generatedDate: generatedDate,
        dueDate: dueDate,
      };
      const validations = (values) => {
        const errors = {};
        if (!values.generatedDate) {
          errors.generatedDate = "Enter today's Date";
        }
        if (!values.dueDate) {
          errors.dueDate =
            "Enter the Due date...if no due date enter today's date";
        }
        return errors;
      };
      return (
        <Formik
          initialValues={initialValues}
          validate={validations}
          onSubmit={(values) => {
            fetch("http://localhost:4001/invoices/date", {
              method: "POST",
              body: JSON.stringify({ ...values, invoiceId }),
              headers: {
                "Content-type": "application/json",
              },
            });
            setDateUpdatePrompt(true);
            setGenerateInvoice(true);
          }}
        >
          <Form>
            <label htmlFor="generatedDate">Generated Date</label>
            <Field
              name="generatedDate"
              type="date"
              disabled={generatedDate ? true : false}
            />
            <label htmlFor="dueDate">Due Date</label>
            <Field
              name="dueDate"
              type="date"
              disabled={dueDate ? true : false}
            />
            <button type="submit" disabled={generatedDate ? true : false}>
              Update
            </button>
          </Form>
        </Formik>
      );
    };
    const LineItemsPreviewComponent = () => {
      const tableHeaderContent = ["Product Name", "Quantity", "Line Amount"];
      const tableHeaders = tableHeaderContent.map((header, idx) => {
        return <th key={idx}>{header}</th>;
      });
      const tableData = lineItems.map((lineItem, idx) => {
        return (
          <tr key={idx}>
            <td>{lineItem.line_item}</td>
            <td>{lineItem.line_item_quantity}</td>
            <td>{lineItem.line_amount}</td>
          </tr>
        );
      });
      return (
        <>
          <table style={{ textAlign: "center" }}>
            <thead>
              <tr>{tableHeaders}</tr>
            </thead>
            <tbody>{tableData}</tbody>
          </table>
          <button
            type="button"
            onClick={() => setProductListEditable(true)}
            disabled={generatedDate ? true : false}
          >
            Edit Items
          </button>
        </>
      );
    };
    const LineItemsEditComponent = () => {
      const initialValue = {
        listItem: [
          {
            itemName: "",
            itemQuantity: 0,
            itemAmount: 0,
          },
        ],
      };
      const validations = (values) => {
        const errors = {};
        if (!values.listItem) {
          errors.listItem = "Enter Items";
        }
      };
      const editLineItemsOnSubmit = async (values) => {
        fetch("http://localhost:4001/lineItemDetails", {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(values),
        });
      };
      return (
        <Formik
          initialValues={initialValue}
          validate={validations}
          onSubmit={(values) => {
            editLineItemsOnSubmit({ ...values, invoiceId, name });
            setProductListEditable(false);
          }}
        >
          <Form>
            <FieldArray name="listItem">
              {(fieldArrayProps) => {
                const { form, push, remove } = fieldArrayProps;
                const { listItem } = form.values;
                console.log(form.values);
                return (
                  <div>
                    {listItem.map((Item, idx) => {
                      return (
                        <div key={idx}>
                          <label htmlFor="listItem.itemName">Name</label>
                          <Field as="select" name={`listItem[${idx}].itemName`}>
                            <option value={""}>Select an option</option>
                            {productSelectlist}
                          </Field>
                          <label htmlFor="listItem.itemQuantity">
                            Quantity
                          </label>
                          <Field
                            name={`listItem[${idx}].itemQuantity`}
                            type="number"
                          />
                          <label htmlFor="listItem.itemAmount">Amount</label>
                          <Field name={`listItem[${idx}].itemAmount`}>
                            {(fieldProps) => {
                              const { field, form } = fieldProps;
                              if (
                                form.values.listItem[idx].itemQuantity &&
                                form.values.listItem[idx].itemName
                              ) {
                                field.value =
                                  form.values.listItem[idx].itemQuantity *
                                  productUnitAmount[
                                    form.values.listItem[idx].itemName
                                  ];
                                form.values.listItem[idx].itemAmount =
                                  field.value;
                              } else {
                                field.value = 0;
                              }
                              return <input type="number" {...field} />;
                            }}
                          </Field>
                          {idx > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                remove(idx);
                              }}
                            >
                              -
                            </button>
                          )}
                          <button type="button" onClick={() => push("")}>
                            +
                          </button>
                        </div>
                      );
                    })}
                  </div>
                );
              }}
            </FieldArray>
            <button type="submit">Update Items</button>
          </Form>
        </Formik>
      );
    };
    if (loading) {
      return <div>loading...</div>;
    } else {
      return (
        <div>
          <div className="invoicePreviewComponent">
            <InvoicePreviewSetDate />
          </div>
          <div className="dateUpdatePrompt">
            {dateUpdatePrompt ? (
              <div style={{ color: "green", textAlign: "center" }}>
                date has been updated!
              </div>
            ) : null}
          </div>
          <div className="invoice-id">
            <p>Invoice Id : {invoiceId}</p>
          </div>
          <div className="customer-name">
            <p>Customer Name : {name}</p>
          </div>
          {!productListEditable ? (
            <div className="line-items">
              <LineItemsPreviewComponent />
            </div>
          ) : (
            <div className="line-items-edit">
              <LineItemsEditComponent />{" "}
            </div>
          )}
          <button
            disabled={generateInvoice || generatedDate ? false : true}
            type="button"
            onClick={() => {
              navigate("/invoiceGeneration", {
                state: {
                  customerId,
                  invoiceId,
                  name,
                  lineItems,
                  totalAmount,
                  productUnitAmount,
                },
              });
            }}
          >
            Generate Invoice
          </button>
        </div>
      );
    }
  }
  return (
    <div>
      <InvoicePreviewProps
        invoiceId={location.state.invoiceId}
        customerId={location.state.customerId}
        totalAmount={location.state.totalAmount}
      />
    </div>
  );
}
export default InvoicePreview;
