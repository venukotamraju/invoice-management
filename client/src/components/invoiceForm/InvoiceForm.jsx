import React, { useEffect, useState } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import "./invoiceForm.css";

function InvoiceForm() {
  const FormSchematic = () => {
    const [productSelectList, setProductSelectList] = useState();
    const [amount, setAmount] = useState();
    useEffect(() => {
      async function getProductsList() {
        const productsList = await fetch("http://localhost:4001");
        const data = await productsList.json();
        const { rows } = data;
        // product item list for selection
        const selectItems = rows.map((e, idx) => (
          <option key={idx} value={e.product_name}>
            {e.product_name}
          </option>
        ));
        setProductSelectList(selectItems);
        // product amount list
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
        setAmount(object);
      }
      getProductsList();
    }, []);
    const initialValues = {
      dueDate: "",
      generatedDate: "",
      customerName: "",
      customerAddress: "",
      customerDescription: "",
      listItems: [
        {
          itemName: "",
          itemQuantity: 0,
          itemAmount: 0,
        },
      ],
    };
    const validation = (values) => {
      const errors = {};

      if (!values.generatedDate) {
        errors.generatedDate = "Please enter the date";
      }
      if (!values.dueDate) {
        errors.dueDate = "Please enter the Due date";
      }
      if (!values.customerName) {
        errors.customerName = "Please enter the Customer Name";
      }
      if (!values.customerAddress) {
        errors.customerAddress = "Please enter the Customer Address";
      }
      if (!values.customerDescription) {
        errors.customerDescription =
          "Please enter the description of the Customer";
      }
      if (
        !values.listItems ||
        values.listItems[0].itemName === "" ||
        values.listItems[0].itemQuantity === 0
      ) {
        errors.listItems = "Please add items";
      }
      return errors;
    };
    return (
      <>
        <Formik
          initialValues={initialValues}
          validate={validation}
          onSubmit={(values, { resetForm }) => {
            console.log(values);
            resetForm();
          }}
        >
          {(props) => (
            <Form className="form_container">
              <div className="form_initials">
                <div className="generatedDate">
                  <label htmlFor="genratedDate">Enter Date</label>
                  <Field type="date" name="generatedDate" id="generatedDate" />
                </div>
                <div className="errorMessage">
                  <ErrorMessage name="generatedDate" className="errorMessage" />
                </div>
                <div className="dueDate">
                  <label htmlFor="dueDate">Enter Due Date</label>
                  <Field type="date" name="dueDate" id="dueDate" />
                </div>
                <div className="errorMessage">
                  <ErrorMessage name="dueDate" className="errorMessage" />
                </div>
                <div className="customerName">
                  <label htmlFor="customerName">Enter Customer's Name</label>
                  <Field type="text" name="customerName" id="customerName" />
                </div>
                <div className="errorMessage">
                  <ErrorMessage name="customerName" className="error_Message" />
                </div>
                <div className="customerAddress">
                  <label htmlFor="customerAddress">
                    Enter Customer's Address
                  </label>
                  <Field
                    type="text"
                    name="customerAddress"
                    id="customerAddress"
                  />
                </div>
                <div className="errorMessage">
                  <ErrorMessage name="customerAddress" />
                </div>
                <div className="customerDescription">
                  <label htmlFor="customerDescription">
                    Enter Customer's Description
                  </label>
                  <Field
                    type="text"
                    name="customerDescription"
                    id="customerDescription"
                  />
                </div>
                <div className="errorMessage">
                  <ErrorMessage
                    name="customerDescription"
                    className="errorMessage"
                  />
                </div>
              </div>
              <div className="form_LineItems">
                <div className="form_labelHead">
                <label id="label_head" htmlFor="listItems">
                  List of Line items
                </label>
                </div>
                <FieldArray name="listItems">
                  {(fieldArrayProps) => {
                    const { form, push, remove } = fieldArrayProps;
                    const { listItems } = form.values;
                    return (
                      <div className="listItems_container">
                        {listItems.map((listItem, index) => {
                          return (
                            <div key={index} className="listItemsMap">
                              <label htmlFor="listItems.itemName">
                                enter the name of the item
                              </label>
                              <Field
                                as="select"
                                name={`listItems[${index}.itemName]`}
                              >
                                <option value={""}>Select an option</option>
                                {productSelectList}
                              </Field>
                              <label>enter quantity</label>
                              <Field
                                name={`listItems[${index}].itemQuantity`}
                                type="number"
                              />
                              <label>Item Amount</label>
                              <Field name={`listItems[${index}].itemAmount`}>
                                {(fieldProps) => {
                                  const { field, form } = fieldProps;

                                  if (
                                    amount &&
                                    form.values.listItems[index].itemQuantity &&
                                    form.values.listItems[index].itemName
                                  ) {
                                    field.value =
                                      form.values.listItems[index]
                                        .itemQuantity *
                                      amount[
                                        form.values.listItems[index].itemName
                                      ];
                                    form.values.listItems[index].itemAmount =
                                      field.value;
                                  }
                                  return <input type="number" {...field} />;
                                }}
                              </Field>

                              {index > 0 && (
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                >
                                  -
                                </button>
                              )}

                              <button type="button" onClick={(e) => push("")}>
                                +
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    );
                  }}
                </FieldArray>
              </div>
              <div className="errorMessage">
                <ErrorMessage name="listItems" className="errorMessage" />
              </div>
              <div className="button">
                <button type="submit">submit</button>
              </div>
            </Form>
          )}
        </Formik>
      </>
    );
  };

  return (
    <div>
      <FormSchematic />
    </div>
  );
}

export default InvoiceForm;
