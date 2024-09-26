import React, { useState, useEffect } from "react";
import { Formik, Form, FieldArray, Field, ErrorMessage } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import "./lineitems.css";
import {Button} from "@mui/material"
function LineItems() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [customerReferenceIdFromLocation, setCustomerReferenceIdFromLocation] =
    useState(location.state.custRefId);
  const [productSelectList, setProductSelectList] = useState();
  const [productAmount, setProductAmount] = useState();
  const [customerFirstName, setCustomerFirstName] = useState();
  const [customerLastName, setCustomerLastName] = useState();
  const [customerDob, setCustomerDob] = useState();
  const [customerAddress, setCustomerAddress] = useState();
  const [customerDescription, setCustomerDescription] = useState();
  const [customerId, setCustomerId] = useState();
  const [invoiceId, setInvoiceId] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    // for customer details
    fetch(
      `http://localhost:4001/customerEntries/${customerReferenceIdFromLocation}`
    )
      .then((fetchData) => fetchData.json())
      .then((customerData) => {
        setCustomerFirstName(customerData[0].customer_first_name);
        setCustomerLastName(customerData[0].customer_last_name);
        setCustomerAddress(customerData[0].customer_address);
        setCustomerDescription(customerData[0].customer_description);
        setCustomerDob(customerData[0].customer_dob.slice(0, 10));
        setCustomerId(customerData[0].customer_id);
        location.state.flow === "customerRegistration"
          ? setInvoiceId(location.state.invoiceID)
          : setInvoiceId(null);
      })
      .catch((error) =>
        console.log("from setting customer details: ", error.message)
      );
    fetch(`http://localhost:4001/products`)
      .then((fetchData) => fetchData.json())
      .then((data) => {
        setProductSelectList(
          data.rows.map((e, idx) => (
            <option key={idx} value={e.product_name}>
              {e.product_name}
            </option>
          ))
        );
        const productAmount = data.rows.map((e) => ({
          [e.product_name]: e.product_unit_cost,
        }));

        setProductAmount(() => {
          let object = {};
          for (let i = 0; i < productAmount.length; i++) {
            object[Object.keys(productAmount[i])] = Object.values(
              productAmount[i]
            )[0];
          }
          return object;
        });
      })
      .catch((error) =>
        console.log("error from fetching products: ", error.message)
      );
  }, []);
  const initialValues = {
    customerReferenceId: customerReferenceIdFromLocation,
    customerFirstName: customerFirstName,
    customerLastName: customerLastName,
    customerDob: customerDob,
    customerAddress: customerAddress,
    customerDescription: customerDescription,
    customerId: customerId,
    listItems: [
      {
        itemName: "",
        itemQuantity: 0,
        itemAmount: 0,
      },
    ],
  };
  const validations = (values) => {
    const errors = {};
    if (!values.customerReferenceId) {
      errors.customerReferenceId =
        "Enter the reference Id to fetch customer details";
    }
    if (!values.listItems) {
      errors.listItems = "Enter Items";
    }
    return errors;
  };
  const onSubmitForm = async (values) => {
    location.state.flow === "customerRegistration"
      ? fetch("http://localhost:4001/lineItemDetails/update", {
          method: "POST",
          body: JSON.stringify({ ...values, invoiceId }),
          headers: {
            "Content-type": "application/json",
          },
        }).then((response) => {
          setTimeout(
            () =>
              navigate("/invoiceGeneration", {
                state: {
                  customerId: values.customerId,
                  invoiceId,
                  name:
                    values.customerFirstName + " " + values.customerLastName,
                  totalAmount: values.listItems
                    .map((item) => item.itemAmount)
                    .reduce((acc, num) => acc + num, 0),
                  productUnitAmount: productAmount,
                },
              }),
            200
          );
        }).catch((error)=>console.log("this error is from fetch of lineItemDetails/update: ",error.message))
      : fetch("http://localhost:4001/lineItemDetails/insert", {
          method: "POST",
          body: JSON.stringify(values),
          headers: {
            "Content-type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setInvoiceId(data["invoice_id"]);
            setTimeout(
              () =>
                navigate("/invoiceGeneration", {
                  state: {
                    customerId: values.customerId,
                    invoiceId: data["invoice_id"],
                    name:
                      values.customerFirstName + " " + values.customerLastName,
                    totalAmount: values.listItems
                      .map((item) => item.itemAmount)
                      .reduce((acc, num) => acc + num, 0),
                    productUnitAmount: productAmount,
                  },
                }),
              200
            );
          });
  };

  setTimeout(() => setLoading(false), 200);

  return loading ? (
    <div>Loading...</div>
  ) : (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, { resetForm }) => {
        // console.log(values);
        onSubmitForm(values);
        resetForm();
      }}
      validate={validations}
    >
      {(formikProps) => {
        return (
          <Form>
            <label htmlFor="customerReferenceId">
              Enter Customer Reference Id
            </label>
            <Field name="customerReferenceId" />
            <ErrorMessage
              name="customerReferenceId"
              component={"div"}
              className="errorMessage"
            />
            <label htmlFor="customerFirstName">First Name</label>
            <Field name="customerFirstName" disabled={true} />
            <label htmlFor="customerLastName">Last Name</label>
            <Field name="customerLastName" disabled={true} />
            <label htmlFor="customerDob">Date of birth</label>
            <Field name="customerDob" disabled={true} />
            <label htmlFor="customerAddress">Address</label>
            <Field name="customerAddress" disabled={true} />
            <label htmlFor="customerDescription">Description</label>
            <Field name="customerDescription" disabled={true} />
            {/* <div id="field-array-container"> */}
            <div id="select-items-container"><label htmlFor="listItems">----Select Items----</label></div>
            <FieldArray name="listItems">
              {(fieldArrayProps) => {
                const { form, push, remove } = fieldArrayProps;
                const { listItems } = form.values;
                return (
                  <div id="field-array-container">
                    {listItems.map((listItem, index) => {
                      return (
                        <div key={index} className="field-array-blocks">
                          <label>Item Name</label>
                          <Field
                            as="select"
                            name={`listItems[${index}.itemName]`}
                          >
                            <option value={""}>Select an option</option>
                            {productSelectList}
                          </Field>
                          <label>Quantity</label>
                          <Field
                            name={`listItems[${index}].itemQuantity`}
                            type="number"
                          />
                          <label>Line Amount</label>
                          <Field name={`listItems[${index}].itemAmount`}>
                            {(fieldProps) => {
                              const { field, form } = fieldProps;
                              if (
                                productAmount &&
                                form.values.listItems[index].itemQuantity &&
                                form.values.listItems[index].itemName
                              ) {
                                field.value =
                                  form.values.listItems[index].itemQuantity *
                                  productAmount[
                                    form.values.listItems[index].itemName
                                  ];
                                form.values.listItems[index].itemAmount =
                                  field.value;
                              } else {
                                field.value = 0;
                              }
                              return <input type="number" {...field} />;
                            }}
                          </Field>
                          {index > 0 && (
                            <Button type="button" onClick={() => remove(index)} className="button" id="button-remove" color="secondary" variant="outlined" size="large" >
                              -
                            </Button>
                          )}

                          <Button type="button" onClick={(e) => push("")} className="button" color="secondary" variant="outlined" >
                            +
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                );
              }}
            </FieldArray>
              {/* </div> */}
            <ErrorMessage
              name="listItems"
              component={"div"}
              className="errorMessage"
            />
            <div id="generate-invoice-button-container">
            <Button type="submit" id="generate-invoice-button" size="large" sx={{border:"3px solid gray",padding:"10px",margin:"10px",color:"gray"}}>Generate Invoice</Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}

export default LineItems;
